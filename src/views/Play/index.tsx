import * as React from "react";
import store from "store";
import { KEY, workouts } from "../../utils/constants";
import { Link } from "react-router-dom";
const styles = require("./index.scss");

function updateDate(startDate, base) {
    const [year, mon, day] = startDate.split('.');
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
    return w.index === 0 ? { name: 'b', index: 1 } : { name: 'a', index: 0 };
}

export class Play extends React.Component<any, any> {
    handleDone() {
        const settings = store.get(KEY);
        const history = settings.history || [];
        let recents = settings.recents;

        history.push(recents[0]);

        const exerciseIndexes = workouts[recents[0].index];
        exerciseIndexes.forEach((i) => {
            const e = settings.exercises[i];
            e.weight = parseFloat(e.weight) + 1.25;
        });

        const newWorkout = recents[1];
        recents.push({
            exercises: newWorkout.exercises.map(updateWeight),
            index: newWorkout.index,
            date: updateDate(newWorkout.date, 2)
        });

        recents = recents.slice(1);

        const latest = recents[0];
        store.set(KEY, Object.assign({}, settings, {
            history,
            currentWorkout: toggleWorkout(settings.currentWorkout),
            startDate: latest.date
        }));
    }

    render() {
        return (
            <div className={styles.container}>
                <div className={styles.head}
                >
                    <Link to={'/'} className={styles.backWrapper}>
                        <i className={styles.back}>arrow_back</i>
                    </Link>
                    <span className={styles.title}>Play</span>
                </div>

                <div className={styles.content}>
                    <button className={styles.done}>
                        Done
                    </button>
                </div>
            </div>
        )
    }
}
