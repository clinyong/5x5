import * as React from "react";
import store from "store";
import dateFormat from "dateformat";
import { KEY } from "../../utils/constants";
import { NavHead } from "../../components/NavHead";

const box = require("../../utils/dropbox-fetch")
const styles = require("./index.scss");

export class Sync extends React.Component<any, any> {
    constructor(props) {
        super(props);

        this.handleDownload = this.handleDownload.bind(this);
        this.handleUpload = this.handleUpload.bind(this)
        box.setToken('xvBKIaiH2fIAAAAAAAAC4rhc0AG1PsaII_pDvo4Lr_OAoFvURzYezpai85_Yvawt')
    }

    handleUpload() {
        const settings = store.get(KEY);
        const fileName = dateFormat(new Date(), "yyyy-mm-dd-HH-MM-ss")

        box.upload({ path: `/${fileName}.json` }, JSON.stringify(settings))
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.error(error);
            });
    }

    handleDownload() {
        box.listFiles('')
            .then(resp => resp.json())
            .then(function (response) {
                const latestEntry = response.entries
                    .filter(entry => entry['.tag'] === 'file' && entry.path_lower.endsWith('.json'))
                    .reduce((pre, cur) => {
                        if (cur.client_modified > pre.client_modified) {
                            return cur
                        } else {
                            return pre
                        }
                    }, { client_modified: '', path_lower: '' })

                if (latestEntry.path_lower === '') {
                    return
                }

                box.download(latestEntry.path_lower)
                    .then(resp => resp.json())
                    .then(settings => {
                        // do whatever you want with the file's contents, e.g. write to a file or just log 
                        store.set(KEY, settings)
                    });
            })
            .catch(function (err) {
                console.log(err);
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
