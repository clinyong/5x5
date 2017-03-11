import * as React from "react";
const styles = require("./index.scss");

export class Home extends React.Component<any, any> {
    render() {
        return (
            <div className={styles.container}>
                I am Home.
            </div>
        )
    }
}
