import * as React from "react";
import store from "store";
import dateFormat from "dateformat";
import { Dropbox } from "../../utils/Dropbox";
import { KEY, TOKEN } from "../../utils/constants";
import { NavHead } from "../../components/NavHead";
import { Button } from "../../components/Button";
const styles = require("./index.scss");

interface SyncState {
    hasToken: boolean;
    inputFocus: boolean;
    uploading: boolean;
    downloading: boolean;
    showError: boolean;
}

export class Sync extends React.Component<any, SyncState> {
    refs: {
        tokenInput: HTMLInputElement;
    };
    box: Dropbox;

    constructor(props) {
        super(props);

        this.handleDownload = this.handleDownload.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
        this.handleSetToken = this.handleSetToken.bind(this);
        this.state = {
            hasToken: false,
            inputFocus: false,
            uploading: false,
            downloading: false,
            showError: false
        };
        this.box = new Dropbox();
    }

    handleUpload() {
        const { downloading, uploading } = this.state;
        if (downloading || uploading) {
            return;
        }

        this.setState({
            uploading: true
        });

        const settings = store.get(KEY);
        const fileName = dateFormat(new Date(), "yyyy-mm-dd-HH-MM-ss");

        this.box.filesUpload(`/${fileName}.json`, JSON.stringify(settings))
            .then(() => {
                this.setState({
                    uploading: false
                });
            })
            .catch(error => {
                console.error(error);
                this.setState({
                    uploading: false,
                    showError: true
                });
            });
    }

    handleDownload() {

        const { downloading, uploading } = this.state;
        if (downloading || uploading) {
            return;
        }

        this.setState({
            downloading: true
        });

        this.box.filesListFolder({ path: "" })
            .then(response => {
                const latestEntry = response.entries
                    .filter(entry => entry[".tag"] === "file" && entry.path_lower.endsWith(".json"))
                    .reduce((pre, cur) => {
                        if (cur.client_modified > pre.client_modified) {
                            return cur;
                        } else {
                            return pre;
                        }
                    }, { client_modified: "", path_lower: "" });

                if (latestEntry.path_lower === "") {
                    return;
                }

                this.box.filesDownload(latestEntry.path_lower)
                    .then(settings => {
                        store.set(KEY, settings);
                        this.setState({
                            downloading: false
                        });
                    }).catch(err => {
                        console.error(err);
                        this.setState({
                            downloading: false,
                            showError: true
                        });
                    });
            })
            .catch(err => {
                console.log(err);
                this.setState({
                    downloading: false,
                    showError: true
                });
            });
    }

    handleSetToken() {
        const token = this.refs.tokenInput.value;

        if (token) {
            store.set(TOKEN, token);
            this.box.setToken(token);
            this.setState({
                hasToken: true
            });
        }
    }


    componentDidMount() {
        const token = store.get(TOKEN);
        if (token) {
            this.box.setToken(token);
            this.setState({
                hasToken: true
            });
        }
    }

    renderSetToken() {
        const { inputFocus } = this.state;
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
        );
    }

    renderSync() {
        const { downloading, uploading } = this.state;
        return (
            <div className={styles.wrapper}>
                <Button className={styles.btn} onClick={this.handleUpload}>
                    {
                        uploading ?
                            <i className={styles.loading}>sync</i> :
                            <i className={styles.md}>cloud_upload</i>
                    }
                </Button>

                <Button className={styles.btn} onClick={this.handleDownload}>
                    {
                        downloading ?
                            <i className={styles.loading}>sync</i> :
                            <i className={styles.md}>cloud_download</i>
                    }
                </Button>
            </div>
        );
    }

    render() {
        const { hasToken, showError } = this.state;
        return (
            <div>
                <NavHead title={"SYNC"} />
                {
                    hasToken ? this.renderSync() : this.renderSetToken()
                }

                {
                    showError ?
                        <div className={styles.modal}>
                            <div className={styles.modalContent}>
                                <p className={styles.modalMsg}>Network fail.</p>

                                <Button
                                    className={styles.modalBTN}
                                    rippleClass={styles.btnRipple}
                                    onClick={() => this.setState({ showError: false })}
                                >
                                    OK
                                </Button>
                            </div>
                        </div> : null
                }
            </div>
        );
    }
}
