import * as React from "react";
import store from "store";
import { KEY } from "../../utils/constants";
import { NavHead } from "../../components/NavHead";
const styles = require("./index.scss");

export class Sync extends React.Component<any, any> {
    constructor(props) {
        super(props);
    
        this.handleDownload = this.handleDownload.bind(this);
        this.handleUpload = this.handleUpload.bind(this)
    }

    handleUpload() {
        const settings = store.get(KEY);
        fetch('/api/upload', {
            method: 'POST',
            body: JSON.stringify(settings),
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(resp => console.log(resp));
    }

    handleDownload() {
        fetch('/api/download', {
            method: 'POST'
        }).then(resp => resp.json())
            .then((settings) => {
                store.set(KEY, settings);
            });
    }

    render() {
        return (
            <div>
                <NavHead title={'SYNC'} />
                <div className={styles.wrapper}>
                    <button className={styles.btn} onClick={this.handleUpload}>
                        <i className={styles.md}>cloud_upload</i>
                    </button>

                    <button className={styles.btn} onClick={this.handleDownload}>
                        <i className={styles.md}>cloud_download</i>
                    </button>
                </div>
            </div>
        )
    }
}
