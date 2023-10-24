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