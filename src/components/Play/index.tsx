import * as React from "react";
import store from "store";
import { KEY, workouts, RecentItem } from "../../utils/constants";
import { Button } from "../../components/Button";
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
    recents: RecentItem[];
    exeIndex: number;
}

export class Play extends React.Component<PlayProps, PlayState> {
    exeCount: number;

    constructor(props) {
        super(props);

        this.handleDone = this.handleDone.bind(this);
        this.handleCount = this.handleCount.bind(this);
        this.state = {
            count: 0,
            done: false,
            recents: [],
            exeIndex: 0
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
        const { count, exeIndex } = this.state;
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
                    count: 0,
                    exeIndex: exeIndex + 1
                });
            } else {
                this.setState({
                    count: count + 1
                });
            }

        }
    }

    componentDidMount() {
        const settings = store.get(KEY);
        this.setState({
            recents: settings.recents
        });
    }

    render() {
        const { count, done, recents, exeIndex } = this.state;
        const { visible, handleBack } = this.props;
        if (done) {
            return <Redirect to="/" />;
        }

        let currentExercise = { name: "", weight: 0 };
        if (recents[0]) {
            currentExercise = recents[0].exercises[exeIndex];
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
                    <div className={styles.countWrapper}>
                        <h2 className={styles.count}>{count}</h2>
                        <p>{`${currentExercise.name}: ${currentExercise.weight}kg`}</p>
                    </div>
                    <Button className={styles.done} onClick={this.handleCount}>
                        Done
                    </Button>
                </div>
            </div>
        );
    }
}
