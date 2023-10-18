export class UserEntity
{
    constructor(login: string, id: string)
    {
        this.login = login;
        this.client_id = id;
    }

    login:      string;
    client_id:  string;
}