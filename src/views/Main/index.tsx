import * as React from "react";
import store from "store";
import dateFormat from "dateformat";
import { Route, NavLink as Link, Switch, Redirect } from "react-router-dom";
import { KEY, exerciseNames } from "../../utils/constants";
import { Home } from "../Home";
import { Sync } from "../Sync";
import { Setting } from "../Setting";
const styles = require("./index.scss");

interface Menus {
    to: string;
    name: string;
    showRipple: boolean;
}

interface HomeState {
    menus: Menus[];
}

interface RouterMatch {
    url: string;
}

interface RouterLocation {
    key: string;
}

interface WrapperProps {
    match: RouterMatch;
    location: RouterLocation;
}

export class Main extends React.Component<WrapperProps, HomeState> {
    constructor(props) {
        super(props);

        this.state = {
            menus: [{
                to: "/home",
                name: "home",
                showRipple: false,
            }, {
                to: "/setting",
                name: "settings",
                showRipple: false,
            }, {
                to: "/sync",
                name: "sync",
                showRipple: false,
            }]
        };

        this.clickMenuItem = this.clickMenuItem.bind(this);
    }

    clickMenuItem(i) {
        const { menus } = this.state;
        const menuItem = menus[i];
        menuItem.showRipple = false;

        this.setState({
            menus
        });

        setTimeout(() => {
            menuItem.showRipple = true;
            this.setState({
                menus
            });
        }, 0);

    }

    componentDidMount() {
        const settings = store.get(KEY);
        if (!settings) {
            const startDate = dateFormat(new Date(), "yyyy.mm.dd");
            const data = {
                week: "1",
                startDate,
                currentWorkout: {
                    name: "a",
                    id: 0
                },
                exercises: exerciseNames.map(name => ({ name, weight: 0 })),
                recents: []
            };

            store.set(KEY, data);
        }
    }

    render() {
        return (
            <div className={styles.container}>
                <Switch>
                    <Route exact path="/" render={() => (<Redirect to="/home" />)} />
                    <Route path="/home" component={Home} />
                    <Route path="/sync" component={Sync} />
                    <Route path="/setting" component={Setting} />
                </Switch>

                <nav className={styles.nav}>
                    <ul className={styles.navList}>
                        {
                            this.state.menus.map((menu, index) => {
                                let cn = styles.ripple;
                                if (menu.showRipple) {
                                    cn += ` ${styles.rippleEffect}`;
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
                                );
                            })
                        }
                    </ul >
                </nav >
            </div>
        );
    }
}
