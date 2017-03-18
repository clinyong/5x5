import * as React from "react";
const styles = require("./index.scss");

interface ButtonProps {
    className?: string;
    rippleClass?: string;
    onClick?: React.EventHandler<React.MouseEvent<HTMLButtonElement>>;
}

interface ButtonState {
    showRipple: boolean;
    rippleLeft: number;
    rippleTop: number;
    rippleWidth: number;
}

export class Button extends React.Component<ButtonProps, ButtonState> {
    btn: HTMLButtonElement;
    rippleEle: HTMLSpanElement;

    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
        this.state = {
            showRipple: false,
            rippleLeft: 0,
            rippleTop: 0,
            rippleWidth: 0
        };
    }

    handleClick(e: React.MouseEvent<HTMLButtonElement>) {
        const { onClick } = this.props;
        const { left, top } = this.btn.getBoundingClientRect();
        const { offsetWidth, offsetHeight } = this.btn;

        const rippleWidth = offsetWidth > offsetHeight ? offsetWidth : offsetHeight;

        const rippleLeft = e.clientX - left - (rippleWidth / 2);
        const rippleTop = e.clientY - top - (rippleWidth / 2);

        this.setState({
            showRipple: false,
            rippleLeft,
            rippleTop,
            rippleWidth
        });

        setTimeout(() => {
            this.setState({
                showRipple: true
            });
        }, 0);

        if (onClick) {
            onClick(e);
        }
    }

    render() {
        const { children, className, rippleClass } = this.props;
        const { showRipple, rippleLeft, rippleTop, rippleWidth } = this.state;
        let cn = styles.container;
        if (className) {
            cn = `${cn} ${className}`;
        }

        let rippleCN = [styles.ripple];
        if (rippleClass) {
            rippleCN.push(rippleClass);
        }
        if (showRipple) {
            rippleCN.push(styles.rippleEffect);
        }
        return (
            <button className={cn} onClick={this.handleClick} ref={btn => this.btn = btn}>
                {children}
                <span
                    className={rippleCN.join(" ")}
                    style={{ left: rippleLeft, top: rippleTop, width: rippleWidth, height: rippleWidth }}
                    ref={ele => this.rippleEle = ele}
                ></span>
            </button>
        );
    }
}