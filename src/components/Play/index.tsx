import * as React from "react";
import store from "store";
import { KEY, workouts } from "../../utils/constants";
import { Redirect } from "react-router-dom";
const styles = require("./index.scss");

function updateDate(startDate, base) {
    const [year, mon, day] = startDate.split(".");
    return `${year}.${mon}.${parseInt(day, 10) + base}`;
}

function updateWeight(exercise, index) {
    const count = index === 0 ? 2.5 : 1.25;
    return {
        name: exercise.name,
        weight: parseFloat(exercise.weight) + count
    };
}

function toggleWorkout(w) {
    return w.id === 0 ? { name: "b", id: 1 } : { name: "a", id: 0 };
}

interface PlayProps {
    visible: boolean;
    handleBack: React.EventHandler<React.MouseEvent<HTMLAnchorElement>>;
}

interface PlayState {
    count: number;
    done: boolean;
}

export class Play extends React.Component<PlayProps, PlayState> {
    exeCount: number;

    constructor(props) {
        super(props);

        this.handleDone = this.handleDone.bind(this);
        this.handleCount = this.handleCount.bind(this);
        this.state = {
            count: 0,
            done: false
        };
        this.exeCount = 0;
    }

    handleDone() {
        const settings = store.get(KEY);
        const history = settings.history || [];
        let recents = settings.recents;

        history.push(recents[0]);

        const exerciseIndexes = workouts[recents[0].workoutID];
        exerciseIndexes.forEach((i) => {
            const e = settings.exercises[i];
            e.weight = parseFloat(e.weight) + 1.25;
        });

        const newWorkout = recents[1];
        recents.push({
            exercises: newWorkout.exercises.map(updateWeight),
            workoutID: newWorkout.workoutID,
            date: updateDate(newWorkout.date, 2)
        });

        recents = recents.slice(1);

        const latest = recents[0];
        store.set(KEY, Object.assign({}, settings, {
            recents,
            history,
            currentWorkout: toggleWorkout(settings.currentWorkout),
            startDate: latest.date
        }));
    }

    handleCount() {
        const { count } = this.state;
        const { exeCount } = this;

        if (exeCount === 3) {
            this.handleDone();
            this.setState({
                done: true
            });
        } else {
            if (count === 5) {
                this.exeCount += 1;
                this.setState({
                    count: 0
                });
            } else {
                this.setState({
                    count: count + 1
                });
            }

        }
    }

    render() {
        const { count, done } = this.state;
        const { visible, handleBack } = this.props;
        if (done) {
            return <Redirect to="/" />;
        }

        return (
            <div className={visible ? styles.containerVisible : styles.containerHidden}>
                <div className={styles.head}
                >
                    <a className={styles.backWrapper} onClick={handleBack}>
                        <i className={styles.back}>arrow_back</i>
                    </a>
                    <span className={styles.title}>Play</span>
                </div>

                <div className={styles.content}>
                    <div className={styles.count}>
                        {count}
                    </div>
                    <button className={styles.done} onClick={this.handleCount}>
                        Done
                    </button>
                </div>
            </div>
        );
    }
}
