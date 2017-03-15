export const KEY = 'KEY';
export const WORKOUTS = 'WORKOUTS';
export const TOKEN = 'TOKEN';

export const exerciseNames = [
  'Squat',
  'Bench Press',
  'Deadlift',
  'Overhead Press',
  'Barbell Row',
];

export const workouts = [
  [0, 1, 4], // a
  [0, 3, 2], // b
];

export interface ExerciseProps {
  name: string;
  weight: number;
}
