import * as React from "react";
import { Link } from 'react-router';
const styles = require("./index.scss");

interface Menus {
    to: string;
    name: string;
    showRipple: boolean;
}

interface HomeState {
    menus: Menus[];
}

export class Wrapper extends React.Component<any, HomeState> {
    constructor(props) {
        super(props);

        this.state = {
            menus: [{
                to: '/home',
                name: 'home',
                showRipple: false,
            }, {
                to: '/setting',
                name: 'settings',
                showRipple: false,
            }, {
                to: '/sync',
                name: 'sync',
                showRipple: false,
            }]
        }

        this.clickMenuItem = this.clickMenuItem.bind(this)
    }

    clickMenuItem(i) {
        const { menus } = this.state
        const menuItem = menus[i]
        menuItem.showRipple = false

        this.setState({
            menus
        })

        setTimeout(() => {
            menuItem.showRipple = true
            this.setState({
                menus
            })
        }, 0);

    }

    render() {
        return (
            <div>
                {this.props.children}
                <nav className={styles.nav}>
                    <ul className={styles.navList}>
                        {
                            this.state.menus.map((menu, index) => {
                                let cn = styles.ripple
                                if (menu.showRipple) {
                                    cn += ` ${styles.rippleEffect}`
                                }
                                return (
                                    <li key={menu.to}>
                                        <Link
                                            to={menu.to}
                                            onClick={() => this.clickMenuItem(index)}
                                            className={styles.navItem}
                                            activeClassName={styles.active}
                                        >
                                            {menu.name}
                                        </Link>
                                        <span className={cn}></span>
                                    </li>
                                )
                            })
                        }
                    </ul >
                </nav >
            </div>
        )
    }
}
