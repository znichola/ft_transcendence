import { WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { ChallengeEntity, PlayerEntity, UserEntity, UserNameEntity } from './user.entity';
import { SocketAuthMiddleware } from 'src/ws/ws.middleware';
import { WsGuard } from 'src/ws/ws.guard';
import { UserStatusService } from './user.status.service';
import { UserStatus } from '@prisma/client';
import { DirectMessageEntity, DirectMessageWithUsername, UserDisplayNameWithUserName } from 'src/dm/entities/direct-message.entity';
import { MessageEntity, MessageWithChatroomEntity} from 'src/chat/entities/message.entity';
import { PongService } from 'src/pong/pong.service';
import {I2D, IBall, IGameState, IPlayer, IRoom, ISocGameOver} from 'src/interfaces';
import {
	canvas,
	timer,
	gameStart,
	definePlayerContact,
	setBallPos,
	bounceWallBall,
	scoreBall,
	createNewBall,
	positionPlayer,
	setRandomDirBall,
	setInitialPosition } from 'src/pong/pong.maths';
import { Cron } from '@nestjs/schedule';

// prettier-ignore
@WebSocketGateway({
	cors: {
		origin: '*',
	},
})
@UseGuards(WsGuard)
export class UserGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer() server: Server;
	constructor(
		private readonly authService: AuthService,
		private readonly userStatusService: UserStatusService,
		private readonly pongService: PongService,
		){}
	private userList: PlayerEntity[] = [];
	private normalQueue: PlayerEntity[] = [];
	private specialQueue: PlayerEntity[] = [];

	private roomList: IRoom[] = [];

	async afterInit(client: Socket)
	{
		client.use(SocketAuthMiddleware() as any);
		console.log('User WS Initialized');
	}

	async handleDisconnect(client: Socket)
	{
		let index: number = this.findSocketInRoom(client.id);
		if (index != -1)
		{
		  this.roomList[index].user1.client.id == client.id
			  ? this.roomList[index].gs.p1.afk = true
			  : this.roomList[index].gs.p2.afk = true;
		  this.roomList[index].user1.client.id == client.id
			  ? this.roomList[index].user1.state = 'AFK'
			  : this.roomList[index].user2.state = 'AFK';
		  client.leave(this.roomList[index].roomID);
		}

		const userToken: string = client.handshake.auth.token;
		const userLogin = await this.authService.getLoginFromToken(userToken);

		index = this.findSocketInQueue(client.id, false);
		if (index != -1) this.normalQueue.splice(index, 1);
		index = this.findSocketInQueue(client.id, true);
		if (index != -1) this.specialQueue.splice(index, 1);

		index = this.userList.findIndex(user => user.client.id === client.id);
		this.userList.splice(index, 1);

		if (this.userList.findIndex(user => user.login === userLogin) == -1)
		{
			await this.updateUserStatus(userLogin, UserStatus.OFFLINE);
			this.broadcast("userDisconnect", userLogin);
		}
	}

	async handleConnection(client: Socket)
	{
		const userToken: string = client.handshake.auth.token;
		const userLogin = await this.authService.getLoginFromToken(userToken);
		const userElo: number = await this.pongService.getUserElo(userLogin);
		console.log(
			'Pong User connected : ',
			userLogin,
			' with id ',
			client.id,
			' and elo: ',
			userElo,
		);
		const user: PlayerEntity = new PlayerEntity(userLogin, client, userElo, undefined);
		const index: number = this.findLoginInRoom(userLogin);
		//tells player he can rejoin a lobby
		if (index != -1 && this.roomList[index].started)
			this.broadcastTo(client.id, 'reconnection', {user1: this.roomList[index].user1.login, user2: this.roomList[index].user2.login, special: this.roomList[index].type})
		this.userList.push(user);

		if (this.userList.findIndex(user => user.login === userLogin) == -1)
			await this.updateUserStatus(userLogin, UserStatus.OFFLINE);
	}

	sendFriendRequest(to: string, sender: UserNameEntity)
	{
		this.toAllUserClients(to, 'friendRequest', sender);
	}

	toAllUserClients(to: string, event: string, message: any)
	{
		this.userList.forEach((user) => {
			if (user.login == to)
			{
				this.broadcastTo(user.client.id, event, message);
			}
		});
	}

	sendUserUpdated(login: string)
	{
		this.server.emit('userUpdated', <any>login);
	}

	sendDM(msg: UserDisplayNameWithUserName, to: string)
	{
		this.toAllUserClients(to, 'dm', msg);
	}

	sendToChatroom(msg: MessageWithChatroomEntity, to: string)
	{
		this.toAllUserClients(to, 'chatroomMessage', msg);
	}

	broadcast(event: string, message: any)
	{
		this.server.emit(event, message);
	}

	broadcastTo(room: string, event: string, message: any)
	{
		this.server.to(room).emit(event, message);
	}

	async updateUserStatus(user: string, status: UserStatus)
	{
		await this.userStatusService.setUserStatus(user, status);
		this.sendUserUpdated(user);
	}

	/* ---------------------- EVENTS FUNCTIONS ----------------------*/

	@SubscribeMessage('looking-for-game')
	async handleSpecial(@MessageBody() special: boolean, @ConnectedSocket() client: Socket): Promise<void>
	{
		let index: number;
		const userToken: string = client.handshake.auth.token;
		const userLogin: string = await this.authService.getLoginFromToken(userToken);
		
		console.log("looking-for-game triggered", userLogin, this.userList[this.findSocketInPlayer(client.id)].state, special);
		if (!this.checkState(userLogin)) return ;
		index = this.findSocketInQueue(client.id, special);
		console.log('Mission passed !!!', index)
		if (index == -1)
		{
			index = this.findSocketInPlayer(client.id);
			const player: PlayerEntity = this.userList[index];
			player.state = 'PENDING';
			special ? this.specialQueue.push(player) : this.normalQueue.push(player);
			//update user state
			await this.updateUserStatus(userLogin, UserStatus.INQUEUE);
			//if player was in the other queue it gets deleted
			// Should not happen as previous return should trigger
			index = this.findSocketInQueue(client.id, !special);
			if (index != -1) special ? this.normalQueue.splice(index, 1) : this.specialQueue.splice(index, 1);
			//check queue to create room if needed
			this.findPlayersInQueue(special);
		}
	}

	@SubscribeMessage('challenge')
	async handleChallenge(
		@MessageBody() data: { invitedLogin: string, special: boolean },
		@ConnectedSocket() client: Socket,
	): Promise<void>
	{
		const userToken: string = client.handshake.auth.token;
		const userLogin: string = await this.authService.getLoginFromToken(userToken);
		//CHECK IF BOTH ARE IN UNACCEPTABLE STATE
		if (!this.checkState(userLogin) || !this.checkState(data.invitedLogin))
			return ;
		// console.log(userLogin, ' with id: ', client.id, ' challenges: ', data.invitedLogin);
		//FIND CHALLENGER IN PLAYER LIST
		let index: number = this.findSocketInPlayer(client.id);
		const player1: PlayerEntity = this.userList[index];
		//FIND CHALLENGED IN PLAYER LIST
		index = this.findLoginInPlayer(data.invitedLogin);
		const player2: PlayerEntity = this.userList[index];
		//CREATING ROOM
		player1.state = 'PENDING';
		//SEND INVITE TO ALL SOCKET CHALLENGED IS CONNECTED ON
		await this.createNewRoom(player1, player2, data.special, false);
		this.toAllUserClients(data.invitedLogin, 'challenge', {from: userLogin, to: data.invitedLogin, special: data.special});
		// console.log('sent message challenge');
	}
  
	@SubscribeMessage('accept')
	async handleAccept(
		@MessageBody() data: { opponent: string, special: boolean },
		@ConnectedSocket() client: Socket,
	): Promise<void>
	{
		const userToken: string = client.handshake.auth.token;
		const userLogin: string = await this.authService.getLoginFromToken(userToken);
		const userElo: number = await this.pongService.getUserElo(userLogin);
		// CHECK IF BOTH ARE IN UNACCEPTABLE STATE
		if (!this.checkState(userLogin) || !this.checkState(data.opponent))
			return ;
		// FIND CORRECT ROOM
		let index: number = this.findCorrectRoom(data.opponent, userLogin);
		console.log('test accept: ', userLogin, ' with id: ', client.id, ' accept challenge from : ', data.opponent, ' and index: ' , index);
		if (index != -1)
		{
			//CHECK IF PAS DEJA ACCEPTE
			console.log("if if something deja", this.roomList[index]);
			if (this.roomList[index].user2.state == undefined)
			{
				client.join(this.roomList[index].roomID);
				this.broadcastTo(this.roomList[index].roomID, 'test', 'asdfasdfasf');
				// this.roomList[index].user2 = this.userList[this.findCorrectPlayer(userLogin, client.id)];
				this.roomList[index].user2.state = 'PENDING';
			}
		}
	}

	@SubscribeMessage('ready') // TODO: check qu'il confirme le bon match, donc for each
	async handleReady(@ConnectedSocket() client: Socket): Promise<void>
	{
		const userToken: string = client.handshake.auth.token;
		const userLogin: string = await this.authService.getLoginFromToken(userToken);
		const index: number = this.findSocketInRoom(client.id);
		// console.log('test ready: ', userLogin, client.id, index);
		if (index != -1)
		{
			if (this.roomList[index].user1.login == userLogin && this.roomList[index].user1.client.id == client.id)
			{
				this.roomList[index].user1.state = 'READY';
				// console.log(this.roomList[index].user1.login, 'with id: ', this.roomList[index].user1.client.id, 'has been defined as READY')
			}
			else if (this.roomList[index].user2.login == userLogin && this.roomList[index].user2.client.id == client.id)
			{
				this.roomList[index].user2.state = 'READY';
				// console.log(this.roomList[index].user2.login, 'with id: ', this.roomList[index].user2.client.id, 'has been defined as READY')
			}
		}
	}

	@SubscribeMessage('reconnect') // TODO: check qu'il confirme le bon match, donc for each
	async handleReconnect(
		@MessageBody() data: { user1: string, user2: string, special: boolean },
		@ConnectedSocket() client: Socket,): Promise<void>
	{
		let user: PlayerEntity = undefined;
		const userToken: string = client.handshake.auth.token;
		const userLogin: string = await this.authService.getLoginFromToken(userToken);
		const index: number = this.findLoginInRoom(userLogin);
		//check room has the user
		if (index != -1)
		{
			//check data has correct info
			if (this.roomList[index].user1.login != data.user1 || this.roomList[index].user2.login != this.roomList[index].user2.login || this.roomList[index].type != data.special)
				return ;
			const tmp: number = this.findSocketInPlayer(client.id)
			//redefine the player inside the room
			if (tmp != -1)
			{
				user = this.userList[tmp];
				//mets a jour le state
				this.roomList[index].user1.login == userLogin
					? this.roomList[index].gs.p1.afk = false
					: this.roomList[index].gs.p2.afk = false;
				//mets a jour le user dans la room
				this.roomList[index].user1.login == userLogin
					? this.roomList[index].user1 = user
					: this.roomList[index].user2 = user;
				//putting in correct state
				if (user.login == this.roomList[index].user1.login)
					this.roomList[index].user2.login == 'GAMING'? user.state = 'GAMING' : user.state ='READY';
				if (user.login == this.roomList[index].user2.login)
					this.roomList[index].user1.login == 'GAMING'? user.state = 'GAMING' : user.state = 'READY';
				//join socket room
				client.join(this.roomList[index].roomID);
				await this.updateUserStatus(userLogin, UserStatus.INGAME);
			}
		}
	}

	// @SubscribeMessage('afk') // TODO: check qu'il confirme le bon match, donc for each
	// async handleAfk(@ConnectedSocket() client: Socket,): Promise<void>
	// {
	// 	console.log('ASDGGAGGFGSAGS');
	// 	let index: number = this.findSocketInRoom(client.id);
	// 	if (index != -1)
	// 	{
	// 		this.roomList[index].user1.client.id == client.id
	// 			? this.roomList[index].gs.p1.afk = true
	// 			: this.roomList[index].gs.p2.afk = true;
	// 		this.roomList[index].user1.client.id == client.id
	// 			? this.roomList[index].user1.state = 'AFK'
	// 			: this.roomList[index].user2.state = 'AFK';
	// 		client.leave(this.roomList[index].roomID);
	// 	}
	// }

	@SubscribeMessage('moveUp')
	async handleMoveUp(@MessageBody() data: boolean, @ConnectedSocket() client: Socket): Promise<void>
	{
		const userToken: string = client.handshake.auth.token;
		const userLogin: string = await this.authService.getLoginFromToken(userToken);
		const index: number = this.findSocketInRoom(client.id);

		if (index != -1)
		{
			if (this.roomList[index].user1.login == userLogin && this.roomList[index].user1.client.id == client.id)
				this.roomList[index].gs.p1.moveUp = data;
			else if (this.roomList[index].user2.login == userLogin && this.roomList[index].user2.client.id == client.id)
				this.roomList[index].gs.p2.moveUp = data;
		}
	}

	@SubscribeMessage('moveDown')
	async handleMoveDown(@MessageBody() data: boolean, @ConnectedSocket() client: Socket): Promise<void>
	{
		const userToken: string = client.handshake.auth.token;
		const userLogin: string = await this.authService.getLoginFromToken(userToken);
		const index: number = this.findSocketInRoom(client.id);

		if (index != -1)
		{
			if (this.roomList[index].user1.login == userLogin && this.roomList[index].user1.client.id == client.id)
				this.roomList[index].gs.p1.moveDown = data;
			else if (this.roomList[index].user2.login == userLogin && this.roomList[index].user2.client.id == client.id)
				this.roomList[index].gs.p2.moveDown = data;
		}
	}

	/* ---------------------- FINDER FUNCTIONS ----------------------*/
	findSocketInQueue(socketID: string, type: boolean): number
	{
		if (!type)
		{
			return this.normalQueue.findIndex(
				(user: PlayerEntity): boolean => user.client.id == socketID);
		}
		else
		{
			return this.specialQueue.findIndex(
				(user: PlayerEntity): boolean => user.client.id == socketID);
		}
	}

	findLoginInRoom(userLogin: string): number
	{
		return this.roomList.findIndex(
			(room: IRoom): boolean =>
				userLogin == room.user1.login || userLogin == room.user2.login,
		);
	}

	findSocketInRoom(socketID: string): number
	{
		return this.roomList.findIndex(
			(room: IRoom): boolean => {
			return socketID == room.user1.client.id || socketID == room.user2.client.id;
		});
	}

	findCorrectRoom(user1Login: string, user2Login: string): number
	{
		return this.roomList.findIndex(
		(r: IRoom): boolean => {
			return((user1Login == r.user1.login && user2Login == r.user2.login)
			|| (user1Login == r.user2.login && user2Login == r.user1.login));
		});
	}

	findSocketInPlayer(socketID: string): number
	{
		return this.userList.findIndex(
		(p: PlayerEntity): boolean => socketID == p.client.id)
	}

	findLoginInPlayer(userLogin: string): number 
	{
		return this.userList.findIndex(
		(p: PlayerEntity): boolean => userLogin == p.login,);
	}

	findAllLoginsInPlayer(userLogin: string): PlayerEntity[]
	{
		return this.userList.filter((p: PlayerEntity): boolean => p.login == userLogin);
	}

	findCorrectPlayer(userLogin: string, socketID: string): number
	{
		const logins: PlayerEntity[] = this.findAllLoginsInPlayer(userLogin);
		return logins.findIndex((p: PlayerEntity): boolean => socketID == p.client.id);
	}

	async findPlayersInQueue(special: boolean): Promise<void>
	{
		special ? this.specialQueue = this.trimQueue(this.specialQueue) : this.normalQueue = this.trimQueue(this.normalQueue);
		let array: PlayerEntity[] = special ? this.specialQueue : this.normalQueue;
		//console.log('test length: ', array.length, 'merde:', this.merde++);
		// NOT ENOUGH PEOPLE
		if (array.length <= 1) {
			// console.log (`not enough players in ${special} queue`);
			return ;
		}
		const user1: PlayerEntity = array.shift();
		const user2: PlayerEntity = array.shift();
		await this.createNewRoom(user1, user2, special, true);
	}

	/* ----------------------- GAME FUNCTIONS -----------------------*/
	async createNewRoom(user1: PlayerEntity, user2: PlayerEntity, special: boolean, ranked: boolean): Promise<void>
	{
		// CREATE NEW GS FOR THIS ROOM
		const newGameState: IGameState = JSON.parse(JSON.stringify(gameStart)); //TODO
		// CREATE ROOM IN DATA
		newGameState.id = await this.pongService.createGame(special, ranked, user1.login, user2.login);
		const roomName: string = `${newGameState.id}`;
		setRandomDirBall(newGameState.balls[0]);
		// CREATE A ROOM IN LIST
		const newRoom: IRoom = {
			gs: newGameState,
			user1: user1,
			user2: user2,
			roomID: roomName,
			type: special,
			ranked: ranked,
			timer: Date.now(),
			started: false,
		};
		newRoom.gs.type = special;
		this.roomList.push(newRoom);
		//console.log('creates room with: ', newRoom.user1.login, ' with id: ', newRoom.user1.client.id, ' & ', newRoom.user2.login, ' with id: ', newRoom.user2.client.id, ' and room id: ', newRoom.roomID);
		// ADD USER TO SOCKET ROOM IF POSSIBLE
		if (user1.client != undefined)
			user1.client.join(`${roomName}`);
		if (user2.client != undefined)
			user2.client.join(`${roomName}`);
		this.broadcastTo(`${roomName}`, 'test', "asdfasfasdf");
	}
	
	trimQueue(queue: PlayerEntity[]): PlayerEntity[]
	{
		//ERASE ALL PLAYERS WITH UNACCEPTABLE STATE
		return queue.filter((p: PlayerEntity) => p.state != 'GAMING' && p.state != 'READY' && p.state != undefined);
	}

	async pongCalculus(r: IRoom, canvas: I2D): Promise<void>
	{
		let endCase: boolean = false;
		//updata game state
		if (!r.gs.p1.afk && !r.gs.p2.afk)
		{
			positionPlayer(r.gs.p1, canvas);
			positionPlayer(r.gs.p2, canvas);
			r.gs.balls.forEach((b: IBall) => setBallPos(b));
			if (r.gs.type)
				createNewBall(r.gs.balls, canvas);
			r.gs.balls.forEach((b: IBall) => bounceWallBall(b, canvas));
			r.gs.balls.forEach((b: IBall) => definePlayerContact(b, r.gs, canvas));
			endCase = scoreBall(r.gs, canvas);
		}
		//counter for afk decreases
		else
		{
			r.gs.timerAfk -= timer / 1000;
			if (gameStart.timerAfk <= 0) return; //TODO GIVE DATA INFO
		}
		this.broadcastTo(`${r.gs.id}`, 'upDate', <any>r.gs);
		//re update gs
		if (!this.isGameOver(r.gs))
		{
			if (endCase) {
				setRandomDirBall(r.gs.balls[0]);
				setInitialPosition(r.gs);
			}
			setTimeout((): void => {
				this.pongCalculus(r, canvas);
			}, timer);
		}
		//en the game
		else
		{
			r.user1.state = undefined;
			r.user2.state = undefined;
			if(r.gs.p1.afk && r.gs.p2.afk)
				await this.cancelGame(r);
			else
			{
				const gameOver: ISocGameOver = await this.pongService.endGame(r.gs);
				this.broadcastTo(r.roomID, 'game-over', gameOver);
				r.user1.client.leave(r.roomID);
				r.user2.client.leave(r.roomID);
				await this.updateUserStatus(r.user1.login, UserStatus.ONLINE);
				await this.updateUserStatus(r.user2.login, UserStatus.ONLINE);
				const index: number = this.findCorrectRoom(r.user1.login, r.user2.login);
				if (index != -1) this.roomList.splice(index, 1);
			}
		}
	}
	
	checkState(userLogin:string): boolean
	{
		const logins: PlayerEntity[] = this.findAllLoginsInPlayer(userLogin);
		if (!logins.length) return false;
		return logins.every((p: PlayerEntity): boolean => p.state == 'PENDING' || p.state == 'AFK' || p.state == undefined);
	}
	
	isGameOver(gs: IGameState): boolean
	{
		if (gs.timerAfk <= 0)
		{
			if (gs.p1.afk && !gs.p2.afk)
			gs.type == true ? gs.p2.score = 30 : gs.p2.score = 5;
			else if (!gs.p1.afk && gs.p2.afk)
			gs.type == true ? gs.p1.score = 30 : gs.p1.score = 5;
			else
			return false;
		}
		if (gs.type && (gs.p1.score == 30 || gs.p2.score == 30))
			return true;
		return !gs.type && (gs.p1.score == 5 || gs.p2.score == 5);
	}

	async cancelGame(r: IRoom)
	{
		this.pongService.cancelGame(r.gs.id);
		this.updateUserStatus(r.user1.login, UserStatus.ONLINE);
		this.updateUserStatus(r.user2.login, UserStatus.ONLINE);
		this.broadcastTo(r.roomID, 'cancelled', {user1: r.user1.login, user2: r.user2.login, special: r.type})
		r.user1.state = undefined;
		r.user2.state = undefined;
		r.user1.client.leave(r.roomID);
		r.user2.client.leave(r.roomID);
		const index: number = this.findCorrectRoom(r.user1.login, r.user2.login);
		if (index != - 1) this.roomList.splice(index, 1);
	}

	/* --------------------- SCHEDULE FUNCTIONS ---------------------*/
  
	@Cron('*/3 * * * * *')//TODO supprime les rooms si les deux afk trop longtemps
	async launchRoom(): Promise<void>
	{
		console.log("the rooms[");
		this.roomList.forEach((r) => console.log(r.roomID, r.user1.login, r.user1.state, r.user2.login, r.user2.state));
		console.log("]");
		for (const r of this.roomList)
		{
			if (r.user1.client != undefined && r.user2.client != undefined)
			{
				//TELLS PLAYERS GAME WILL START
				const payload = {
				user1: r.user1.login,
				user2: r.user2.login,
				special: r.type,
				};
				console.log("launch room:", payload);
				if (r.user1.state == 'PENDING' && r.user2.state == 'PENDING')
					this.broadcastTo(r.roomID, 'room-created', payload); //TODO
				if (r.user1.state == 'READY' && r.user2.state == 'READY')
				{
					this.broadcastTo(r.roomID, 'start-game', payload); // TODO
					//console.log('both players were seen as ready');
					r.user1.state = 'GAMING';
					r.user2.state = 'GAMING';
					r.started = true;
					r.gs.p1.afk = false;
					r.gs.p2.afk = false;
					// SET GAMERS STATUS AS INGAME
					await this.updateUserStatus(r.user1.login, UserStatus.INGAME);
					await this.updateUserStatus(r.user2.login, UserStatus.INGAME);
					this.pongCalculus(r, canvas);
				}
			}
			if (Date.now() - r.timer >= 10000 && !r.started)
				this.cancelGame(r);
		}
	}
}