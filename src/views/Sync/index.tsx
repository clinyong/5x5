import * as React from "react";
import store from "store";
import dateFormat from "dateformat";
import { Dropbox } from "../../utils/Dropbox";
import { KEY, TOKEN } from "../../utils/constants";
import { NavHead } from "../../components/NavHead";
const styles = require("./index.scss");

interface SyncState {
    hasToken: boolean;
    inputFocus: boolean;
}

export class Sync extends React.Component<any, SyncState> {
    refs: {
        tokenInput: HTMLInputElement;
    }
    box: Dropbox;

    constructor(props) {
        super(props);

        this.handleDownload = this.handleDownload.bind(this);
        this.handleUpload = this.handleUpload.bind(this)
        this.handleSetToken = this.handleSetToken.bind(this)
        this.state = {
            hasToken: false,
            inputFocus: false
        }
        this.box = new Dropbox();
    }

    handleUpload() {
        const settings = store.get(KEY);
        const fileName = dateFormat(new Date(), "yyyy-mm-dd-HH-MM-ss")

        this.box.filesUpload(`/${fileName}.json`, JSON.stringify(settings))
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.error(error);
            });
    }

    handleDownload() {
        const self = this
        this.box.filesListFolder({ path: '' })
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

                self.box.filesDownload(latestEntry.path_lower)
                    .then(settings => {
                        store.set(KEY, settings)
                    })
            })
            .catch(function (err) {
                console.log(err);
            });
    }

    handleSetToken() {
        const token = this.refs.tokenInput.value

        if (token) {
            store.set(TOKEN, token);
            this.box.setToken(token)
            this.setState({
                hasToken: true
            })
        }
    }


    componentDidMount() {
        const token = store.get(TOKEN)
        if (token) {
            this.box.setToken(token)
            this.setState({
                hasToken: true
            })
        }
    }

    renderSetToken() {
        const { inputFocus } = this.state
        return (
            <div className={styles.setting}>
                <div className={styles.inputWrapper}>
                    <label htmlFor="tokenInput">Access Token: </label>
                    <input
                        type="text"
                        className={inputFocus ? styles.tokenInputActive : styles.tokenInput}
                        id="tokenInput"
                        onFocus={() => this.setState({ inputFocus: true })}
                        onBlur={() => this.setState({ inputFocus: false })}
                        ref="tokenInput"
                    />
                </div>
                <button className={styles.tokenBTN} onClick={this.handleSetToken}>
                    Submit
                </button>
            </div>
        )
    }

    renderSync() {
        return (
            <div className={styles.wrapper}>
                <button className={styles.btn} onClick={this.handleUpload}>
                    <i className={styles.md}>cloud_upload</i>
                </button>

                <button className={styles.btn} onClick={this.handleDownload}>
                    <i className={styles.md}>cloud_download</i>
                </button>
            </div>
        )
    }

    render() {
        return (
            <div>
                <NavHead title={'SYNC'} />
                {
                    this.state.hasToken ? this.renderSync() : this.renderSetToken()
                }
            </div>
        )
    }
}
