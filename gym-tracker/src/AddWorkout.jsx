import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from "axios";
import "./AddWorkout.css";


function AddWorkout() {
    const navigate = useNavigate();
    const[searchParams] = useSearchParams();
    const initialCategory = searchParams.get("category") || "Chest";
    const[category, setCategory] = useState(initialCategory);
    const[sessionName, setSessionName] = useState(`${initialCategory} Day`);
    const[date, setDate] = useState(() => {
        const today = new Date();
        return[
            today.getFullYear(),
            String(today.getMonth() + 1).padStart(2, "0"),
            String(today.getDate()).padStart(2, "0"),
        ].join("-");
    });
    const[duration,  setDuration] = useState("");
    const[exercises, setExercises] = useState([
        {
            name: "",
            sets: [{reps: "", weight: ""}],
        },
    ]);
    const[loadng, setLoading] = useState(false);
    const[error, seteror] = useState("");
    const Categories = [
        "Chest",
        "Back",
        "Shoulders",
        "Biceps",
        "Triceps",
        "Legs",
        "Core",,
    ];
    const addExercise = () => {
        setExercises((previous) => [
            ...previous,
            {
                name: "",
                sets: [{reps: "", weight: ""}],
            },
        ]);
    };
    const removeExercise = (exerciseIndex) => {
        setExercises((previous) => 
            previous.filter((_, index) => index !== exerciseIndex)
        );
    };
    const updateExerciseName = (exerciseIndex, value) => {
        setExercises((previous) => 
            previous.map((exercise, index) => 
                index === exerciseIndex
        ? {...exercise, name: value}
    :exercise             )
        );
    };
    const addSet = (exerciseIndex) => {
        setExercises((previous) => 
            previous.map((exercise, index) => 
                index === exerciseIndex ? {
                    ...exercise,
                    sets: [
                        ...exercise.sets,
                        {reps: "", weight: ""},
                    ],
                }
                : exercise
             )
        );
    };
    const removeSet = (exerciseIndex, setIndex) => {
        setExercises((previous) =>
            previous.map((exercise, index) => 
                index === exerciseIndex ? {
                    ...exercise,
                    sets: exercise.sets.filter(
                        (_, i) => i !== setIndex
                    ),
                }
                : exercise
            )
         );
    };
    const updateSet = (
        exerciseIndex,
        setIndex,
        field,
        value
    ) => {
        setExercises((previous) =>
            previous.map((exercise, index) => 
                index === exerciseIndex ? {
                    ...exercise,
                    sets: exercise.sets.map((set, i) => 
                        i === setIndex
                    ? {...set, [field]: value}
                    : set
                    ),
                }
                : exercise
            ) 
         );
    };
    const handleSubmit = async (event) => {
        event.prevntDefault();
        setError("");
        if(
            !sessionName.trim() ||
            !date || 
            !duration ||
            Number(duration) < 1
        ) {
            setError("Please enetr valid session details.");
            return;
        }
        const invalidExercise = exercises.some(
            (exercise) => 
                !exercise.name.trim() || 
            exercise.sets.length === 0 || 
            exercise.sets.some(
                (set) => 
                    set.reps === "" || 
                set.weight === "" || 
                !Number.isInteger(Number(set.reps)) || 
                Number(set.reps) < 1 ||
                !Number.isFinite(Number(set.weight)) || 
                Number(set.weight) < 0
            )
        );
        if (invalidExercise) {
            setError("Enter an exercise name and valid reps and weights for every set.");
            return;
        }
        const workoutData = {
            category,
            sessionName: sessionName.trim(),
            date,
            duration: Number(duration),
            exercises: exercises.map((exercise) => ({
                name: exercise.name.trim(),
                sets: exercise.sets.map((set) => ({
                    reps: Number(set.reps),
                    weight: Number(set.weight),
                })),
            })),
        } ;
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            await axios.post("http://localhost:5000/api/workouts", workoutData, 
                {
                    headers: token
                    ? {Authorization: `Bearer ${token}`} 
                    : {},
                }
            )
            alert("Workout saved successfully!");
            navigate("/workout-history");
        } catch (err) {
            setError(
                err.response?.data?.message || 
                err.response?.data?.error || 
                "Failed to save workout. Check your backend API."
            );
        } finally {
            setLoading(false);
        }
       };
  return (
    <div className='add-workout-page'>
        <div className='add-workout-container'>
            <button 
            type='button'
            className='workout-button workout-secondary-button workout-back-button'
            onClick={() => navigate("/dashboard")}
            >Back to Dashboard</button>
            <h1>Add Workout</h1>
            <p className='add-workout-subtitle'>Record your exercises, sets, reps, and weights</p>
            {error && (
                <div className='workout-error'>{error}</div>
            )}
            <form onSubmit={handleSubmit}>
                <div className='workout-form-card'>
                    <h2>Workout Session Details</h2>
                    <label className='workout-label'>Workout Category</label>
                    <select 
                     className="workout-select"
              value={category}
              onChange={(event) => {
                const newCategory = event.target.value;

                setCategory(newCategory);

                if (sessionName === `${category} Day`) {
                  setSessionName(`${newCategory} Day`);
                }
              }}
                    > 
                    {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
                    </select>
                    <label className='workout-label'>Session Name</label>
                    <input 
                    className='workout-input'
                    type='text'
                    placeholder='Example: Chest Day'
                    value={sessionName}
                    onChange={(event) => setSessionName(event.target.value)}
                    required />
                    <label className='workout-label'>Workout Date</label>
                    <input 
                    className='workout-input'
                    type='date'
                    value={date}
                    onChange={(event) => setDate(event.target .value)}
                    required />
                    <label className='workout-label'>Duration (minutes)</label>
                    <input 
                    className='workout-input'
                    type='number'
                    min="1"
                    placeholder='Example: 60'
                    value={duration}
                    onChange={(event) => setDuration(event.target.value)}
                    required />
                </div>
                <div className='workout-form-card'>
                    <h2>Exercises</h2>
                    {exercises.map((exercise, exerciseIndex) => (
                        <div className='workout-exercise-card' key={exerciseIndex}>
                            <h3>Exercise {exerciseIndex + 1}</h3>
                            <label className='workout-label'>Exercise Name</label>
                            <input 
                            className='workout-input'
                            type='text'
                            placeholder='Example: Bench Press'
                            value={exercise.name}
                            onChange={(event) => updateExerciseName(exerciseIndex, event.target.value)} 
                            required />
                            <h4>Sets</h4>
                            {exercise.sets.map((set, setIndex) => (
                                <div className='workout-set-row' key={setIndex}>
                                    <strong className='workout-set-number'>
                                        Set {setIndex + 1}
                                    </strong>
                                    <input 
                                    className='workout-input'
                                    type='number'
                                    min="1"
                                    step="1"
                                    placeholder='Reps'
                                    aria-label={`Exercise ${exerciseIndex + 1}, set ${setIndex+ 1} reps`}
                                    value={set.reps}
                                    onChange={(event) => updateSet(exerciseIndex, setIndex, "reps", event.target.value)}
                                    required />
                                      <input
                      className="workout-input"
                      type="number"
                      min="0"
                      step="0.5"
                      placeholder="Weight (kg)"
                      aria-label={`Exercise ${exerciseIndex + 1}, set ${setIndex + 1} weight`}
                      value={set.weight}
                      onChange={(event) =>
                        updateSet(
                          exerciseIndex,
                          setIndex,
                          "weight",
                          event.target.value
                        )
                      }
                      required
                    />

                    <button
                      type="button"
                      className="workout-button workout-danger-button"
                      disabled={exercise.sets.length === 1}
                      onClick={() =>
                        removeSet(exerciseIndex, setIndex)
                      }
                    >
                      Remove
                    </button>
                                </div>
                            ))}
                             <button
                  type="button"
                  className="workout-button workout-secondary-button"
                  onClick={() => addSet(exerciseIndex)}
                >
                  + Add Set
                </button>

                <button
                  type="button"
                  className="workout-button workout-danger-button"
                  disabled={exercises.length === 1}
                  onClick={() => removeExercise(exerciseIndex)}
                >
                  Remove Exercise
                </button>
                        </div>
                    ))}
                      <button
              type="button"
              className="workout-button workout-primary-button"
              onClick={addExercise}
            >
              + Add Exercise
            </button>
                </div>
                   <button
            type="submit"
            className="workout-button workout-primary-button workout-save-button"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Workout"}
          </button>
            </form>
        </div>
    </div>
  );
}

export default AddWorkout;