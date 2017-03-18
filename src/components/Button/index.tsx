import * as React from "react";
const styles = require("./index.scss");

interface ButtonProps {
    className?: string;
    onClick?: React.EventHandler<React.MouseEvent<HTMLButtonElement>>;
}

export class Button extends React.Component<ButtonProps, any> {
    render() {
        const { children, className, onClick } = this.props;
        let cn = styles.container;
        if (className) {
            cn = `${cn} ${className}`;
        }
        return (
            <button className={cn} onClick={onClick}>
                {children}
            </button>
        );
    }
}