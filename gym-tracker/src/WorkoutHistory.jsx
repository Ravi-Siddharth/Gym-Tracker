
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

import {
  Dumbbell,
  CalendarDays,
  Clock,
  Plus,
  Activity,
  ClipboardList,
  Weight,
  Repeat,
  AlertCircle,
  CheckCircle
} from "lucide-react";

import Sidebar from "./Sidebar";
import "./WorkoutHistory.css";

function WorkoutHistory() {
  const navigate = useNavigate();

  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWorkouts = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:5000/api/workouts",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data;

        const workoutList = Array.isArray(data)
          ? data
          : data.workouts || [];

        setWorkouts(workoutList);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to load workout history."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, [navigate]);

  const formatDate = (date) => {
    if (!date) return "Date not available";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const totalExercises = workouts.reduce(
    (total, workout) =>
      total + (workout.exercises?.length || 0),
    0
  );

  const totalDuration = workouts.reduce(
    (total, workout) =>
      total + (Number(workout.duration) || 0),
    0
  );

  return (
    <div className="history-page">

      <Sidebar />

      <main className="history-content">

        <header className="history-header">
          <div>
            <h1>Workout History</h1>
            <p>Review your previous training sessions.</p>
          </div>

          <button
            className="history-add-button"
            onClick={() => navigate("/add-workout")}
          >
            <Plus size={18} />
            Add Workout
          </button>
        </header>

        {/* Summary Cards */}

        <section className="history-summary">

          <div className="history-summary-card">
            <div className="history-summary-icon">
              <Dumbbell size={23} />
            </div>

            <span>Total Sessions</span>
            <h2>{workouts.length}</h2>
          </div>

          <div className="history-summary-card">
            <div className="history-summary-icon">
              <Activity size={23} />
            </div>

            <span>Total Exercises</span>
            <h2>{totalExercises}</h2>
          </div>

          <div className="history-summary-card">
            <div className="history-summary-icon">
              <Clock size={23} />
            </div>

            <span>Total Training Time</span>
            <h2>{totalDuration} min</h2>
          </div>

        </section>

        {/* Loading */}

        {loading ? (
          <div className="history-message">
            Loading your workout history...
          </div>
        ) : error ? (

          <div className="history-error">
            <AlertCircle size={20} />
            {error}
          </div>

        ) : workouts.length === 0 ? (

          /* Empty State */

          <div className="history-empty">

            <div className="history-empty-icon">
              <Dumbbell size={42} />
            </div>

            <h2>No workouts yet</h2>

            <p>
              Your saved workout sessions will appear here.
              Start by adding your first workout.
            </p>

            <button
              className="history-add-button"
              onClick={() => navigate("/add-workout")}
            >
              <Plus size={18} />
              Create Your First Workout
            </button>

          </div>

        ) : (

          /* Workout List */

          <section className="history-workout-list">

            {workouts.map((workout) => (

              <article
                className="history-workout-card"
                key={workout._id}
              >

                <div className="history-workout-top">

                  <div>

                    <span className="history-category">
                      {workout.category || "General"}
                    </span>

                    <h2>
                      {workout.sessionName || "Workout Session"}
                    </h2>

                    <p className="history-date">
                      <CalendarDays size={16} />
                      {formatDate(workout.date)}
                    </p>

                  </div>

                  <div className="history-duration">
                    <span>
                      <Clock size={15} />
                      Duration
                    </span>

                    <strong>
                      {workout.duration || 0} min
                    </strong>
                  </div>

                </div>

                {/* Exercises */}

                <div className="history-exercises">

                  <h3>
                    <ClipboardList size={19} />
                    Exercises
                  </h3>

                  {workout.exercises?.length > 0 ? (

                    workout.exercises.map((exercise, index) => (

                      <div
                        className="history-exercise"
                        key={exercise._id || index}
                      >

                        <div className="history-exercise-name">

                          <span className="history-exercise-number">
                            {index + 1}
                          </span>

                          <strong>{exercise.name}</strong>

                        </div>

                        <div className="history-sets">

                          {exercise.sets?.length > 0 ? (

                            exercise.sets.map((set, setIndex) => (

                              <div
                                className="history-set"
                                key={set._id || setIndex}
                              >

                                <span>
                                  <Repeat size={14} />
                                  Set {setIndex + 1}
                                </span>

                                <span>
                                  {set.reps} reps
                                </span>

                                <span>
                                  <Weight size={14} />
                                  {set.weight} kg
                                </span>

                              </div>

                            ))

                          ) : (

                            <span className="history-no-sets">
                              No sets recorded
                            </span>

                          )}

                        </div>

                      </div>

                    ))

                  ) : (

                    <p className="history-no-sets">
                      No exercises recorded.
                    </p>

                  )}

                </div>

              </article>

            ))}

          </section>

        )}

      </main>

    </div>
  );
}

export default WorkoutHistory;
