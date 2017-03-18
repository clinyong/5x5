import * as React from "react";
import store from "store";
import { Link } from "react-router-dom";
import { KEY, workouts, ExerciseProps } from "../../utils/constants";
import { NavHead } from "../../components/NavHead";
const styles = require("./index.scss");

function updateWeight(exercise, index) {
    const count = index === 0 ? 2.5 : 1.25;
    return {
        name: exercise.name,
        weight: parseFloat(exercise.weight) + count
    };
}

function updateDate(startDate, base) {
    const [year, mon, day] = startDate.split(".");
    return `${year}.${mon}.${parseInt(day, 10) + base}`;
}

function addDateToWorkouts(recents, startDate) {
    return recents.map((r, index) => ({
        ...r,
        date: updateDate(startDate, 2 * index),
    }));
}

interface RecentItem {
    exercises: ExerciseProps[];
    date: string;
}

interface HomeState {
    recents: RecentItem[];
}

export class Home extends React.Component<any, HomeState> {
    constructor(props) {
        super(props);

        this.state = {
            recents: []
        };
    }

    componentDidMount() {
        const settings = store.get(KEY);
        const { exercises, currentWorkout, startDate } = settings;
        const id = currentWorkout.id;
        const current = workouts[id].map(w => exercises[w]);
        const next = workouts[1 - id].map(w => exercises[w]);

        const recents = addDateToWorkouts([
            { exercises: current, workoutID: id },
            {
                exercises: next.map((w, i) => {
                    return i === 0 ? ({ name: w.name, weight: parseFloat(w.weight) + 1.25 }) : w;
                }),
                workoutID: 1 - id,
            },
            {
                exercises: current.map(updateWeight),
                workoutID: id,
            },
        ], startDate);

        this.setState({ recents });
        settings.recents = recents;
        store.set(KEY, settings);
    }

    render() {
        return (
            <div className={styles.container}>
                <NavHead title={"STRONGLIFTS"} />
                <h3 className={styles.week}>WEEK 3</h3>
                <ul className={styles.workoutList}>
                    {
                        this.state.recents.map(item => {
                            return (
                                <li key={item.date}>
                                    <h3 className={styles.date}>{item.date}</h3>
                                    <ul className={styles.workout}>
                                        {
                                            item.exercises.map(e => {
                                                return (
                                                    <li key={`${item.date}${e.name}`}>
                                                        {`${e.name}: ${e.weight}kg`}
                                                    </li>
                                                );
                                            })
                                        }
                                    </ul>
                                </li>
                            );
                        })
                    }
                </ul>

                <Link to="/play" className={styles.beginWrapper}>
                    <i className={styles.begin}>
                        play_arrow
                    </i>
                </Link>
            </div>
        );
    }
}
