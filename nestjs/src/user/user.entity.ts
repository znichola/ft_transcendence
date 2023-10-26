import { Socket } from "socket.io";

export class UserEntity
{
    constructor(login: string, client: Socket)
    {
        this.login = login;
        this.client = client;
    }
    login:      string;
    client:     Socket;
}

export class PlayerEntity
{
    constructor(login: string, client: Socket | undefined, elo: number | undefined, state: string | undefined)
    {
        this.login = login;
        this.client = client;
        this.elo = elo;
        this.state = state;
    }
    login:      string;
    client:     Socket | undefined;
    elo:        number | undefined;
    state:      string | undefined;
    //states:
    //  - undefined : just connected ;
    //  - 'PENDING': waiting for room confirmation;
    //  - 'READY': waiting for other player;
    //  - 'GAMING': is playing;
    //  - 'AFK': well...;
}

export class UserNameEntity
{
    constructor(login: string, name: string)
    {
        this.login = login;
        this.name = name;
    }

    login: string;
    name:  string;
}

export class ChallengeEntity
{
    constructor(user: string, gameId: number, special: boolean)
    {
        this.user = user;
        this.gameId = gameId;
        this.special = special;
    }

    user: string;
    gameId: number;
    special: boolean;
}