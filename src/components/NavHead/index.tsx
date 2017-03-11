import * as React from "react";
const styles = require("./index.scss");

interface NavHeadProps {
    title: string;
}

export class NavHead extends React.Component<NavHeadProps, any> {
    render() {
        return (
            <div className={styles.head}>
                <span className={styles.title}>{this.props.title}</span>
            </div>
        )
    }
}
