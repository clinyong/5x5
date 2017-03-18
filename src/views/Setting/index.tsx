import * as React from "react";
import store from "store";
import { KEY, ExerciseProps } from "../../utils/constants";
import { NavHead } from "../../components/NavHead";
const styles = require("./index.scss");

interface WorkoutProps {
    name: string;
    id: number;
}

interface SettingState {
    exercises: ExerciseProps[];
    currentWorkout: WorkoutProps;
    startDate: string;
    week: string;
}

export class Setting extends React.Component<any, SettingState> {
    constructor(props) {
        super(props);

        this.state = {
            exercises: [],
            currentWorkout: {
                name: "",
                id: -1
            },
            startDate: "",
            week: "1"
        };
        this.handleConfirm = this.handleConfirm.bind(this);
    }

    handleConfirm() {
        const settings = store.get(KEY);

        if (settings) {
            store.set(KEY, Object.assign({}, settings, this.state));
        }

        store.set(KEY, this.state);
    }

    handleChange(stateKey, val) {
        this.setState({
            [stateKey]: val
        });
    }

    handleExerciseChange(index, val) {
        const { exercises } = this.state;
        exercises[index].weight = val;
        this.setState({
            exercises
        });
    }

    componentDidMount() {
        const settings = store.get(KEY);
        if (settings) {
            this.setState(settings);
        }
    }

    render() {
        const { exercises, currentWorkout, startDate, week } = this.state;
        return (
            <div>
                <NavHead title={"SETTING"} />
                <ul className={styles.settings}>
                    {
                        exercises.map((e, index) => {
                            return (
                                <li key={`${e.name}${index}`}>
                                    <span>
                                        {e.name}:
                                    </span>
                                    <input
                                        type="text"
                                        value={e.weight}
                                        onChange={
                                            ev => this.handleExerciseChange(index, ev.target.value)
                                        }
                                    />
                                </li>
                            );
                        })
                    }
                    <li>
                        <span>
                            Current Workout:
                        </span>
                        <input
                            type="text"
                            value={currentWorkout.name}
                            onChange={
                                e => this.setState({
                                    currentWorkout: {
                                        name: e.target.value,
                                        id: e.target.value === "a" ? 0 : 1
                                    }
                                })
                            }
                        />
                    </li>
                    <li>
                        <span>
                            Start Date:
                        </span>
                        <input type="text" value={startDate} onChange={e => this.setState({ startDate: e.target.value })} />
                    </li>
                    <li>
                        <span>
                            Week
                        </span>
                        <input type="text" value={week} onChange={e => this.setState({ week: e.target.value })} />
                    </li>
                </ul>
                <button className={styles.submit} onClick={this.handleConfirm}>
                    确定
                </button>
            </div>
        );
    }
}
