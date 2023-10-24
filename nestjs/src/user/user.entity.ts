import { Socket } from "socket.io";

export class UserEntity
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
    //  - undefined : still not accept game;
    //  - 'AFK': well...;
    //  - 'PENDING': waiting for room confirmation;
    //  - 'READY': waiting for other player;
    //  - 'GAMING': is playing;
}