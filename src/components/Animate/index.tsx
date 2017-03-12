import * as React from "react";
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import "./index.scss";

interface AnimateProps {
    animateKey: string;
    children?: any;
}

export class Animate extends React.Component<AnimateProps, any> {
    render() {
        const {children, animateKey} = this.props;
        return (
            <ReactCSSTransitionGroup
                component="div"
                transitionName="container"
                transitionAppear={true}
                transitionEnter={false}
                transitionLeave={true}
                transitionAppearTimeout={2000}
                transitionLeaveTimeout={2000}
            >
                {
                   React.cloneElement(children, {
                       key:animateKey
                    })
                }
            </ReactCSSTransitionGroup>
        )
    }
}