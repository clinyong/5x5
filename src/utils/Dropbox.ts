const host = "https://api.dropboxapi.com/2/";

export class Dropbox {
    token: string;

    constructor(token: string) {
        this.token = token;
    }

    filesListFolder(arg: { path: string }) {
        return fetch(`${host}files/list_folder/continue`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${this.token}`,
                "Content-Type": "application/json",
                'Dropbox-API-Arg': JSON.stringify(arg)
            }
        })
    }
}