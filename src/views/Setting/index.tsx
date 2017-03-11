import * as React from "react";
import store from "store";
import { KEY, ExerciseProps } from "../../utils/constants";
import { NavHead } from "../../components/NavHead";
const styles = require("./index.scss");

interface SettingState {
    exercises: ExerciseProps[];
    currentWorkout: string;
    startDate: string;
}

export class Setting extends React.Component<any, SettingState> {
    constructor(props) {
        super(props);

        this.state = {
            exercises: [],
            currentWorkout: '',
            startDate: ''
        }
        this.handleConfirm = this.handleConfirm.bind(this)
    }

    handleConfirm() {
    }

    componentDidMount() {
        const settings = store.get(KEY);
        if (settings) {
            const { exercises, currentWorkout, startDate } = settings;
            this.setState({
                exercises,
                currentWorkout: currentWorkout.name,
                startDate
            })
        }
    }

    render() {
        const { exercises, currentWorkout, startDate } = this.state
        return (
            <div>
                <NavHead title={'SETTING'} />
                <ul className={styles.settings}>
                    {
                        exercises.map(e => {
                            return (
                                <li>
                                    <span>
                                        {e.name}:
                                    </span>
                                    <input type="text" value={e.weight} />
                                </li>
                            )
                        })
                    }
                    <li>
                        <span>
                            Current Workout:
                        </span>
                        <input type="text" value={currentWorkout} />
                    </li>
                    <li>
                        <span>
                            Start Date:
                        </span>
                        <input type="text" value={startDate} />
                    </li>
                </ul>
                <button className={styles.submit} onClick={this.handleConfirm}>
                    确定
                </button>
            </div>
        )
    }
}
