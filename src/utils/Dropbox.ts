interface FileInfo {
    ".tag": string;
    "client_modified": string;
    "path_lower": string;
}

interface FolderInfo {
    entries: FileInfo[];
}

function getURL(host, path): string {
    return `https://${host}.dropboxapi.com/2/${path}`;
}

export class Dropbox {
    token: string;

    constructor(token: string = "") {
        this.token = token;
    }

    setToken(token) {
        this.token = token;
    }

    filesUpload(path, content) {
        return fetch(getURL("content", "files/upload"), {
            method: "POST",
            headers: {
                'Content-Type': 'application/octet-stream',
                "Authorization": `Bearer ${this.token}`,
                'Dropbox-API-Arg': JSON.stringify({ path })
            },
            body: content
        }).then(resp => resp.json())
    }

    filesDownload(path) {
        return fetch(getURL("content", "files/download"), {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${this.token}`,
                'Dropbox-API-Arg': JSON.stringify({ path })
            }
        }).then(resp => resp.json())
    }

    filesListFolder(arg: { path: string }): Promise<FolderInfo> {
        return fetch(getURL("api", "files/list_folder"), {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${this.token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(arg)
        }).then(resp => resp.json() as Promise<FolderInfo>)
    }
}