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