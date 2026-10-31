
import { useNavigate } from "react-router-dom";

import {
  Dumbbell,
  Activity,
  Flame,
  BicepsFlexed,
  Zap,
  Footprints,
  Target,
  Plus,
  History,
  Salad
} from "lucide-react";

import Sidebar from "./Sidebar";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const workouts = [
    {
      name: "Chest",
      icon: Dumbbell,
      description:
        "A sculpted, armor-like anterior shield that defines upper-body fullness, density, and striking frontal proportions."
    },
    {
      name: "Back",
      icon: Activity,
      description:
        "Expansive posterior muscles that forge a powerful V-taper, defining upper-body width, depth, and striking symmetry."
    },
    {
      name: "Shoulder",
      icon: Flame,
      description:
        "Primary upper-body muscles responsible for arm elevation, multidirectional rotation, and overhead pressing strength."
    },
    {
      name: "Biceps",
      icon: BicepsFlexed,
      description:
        "Primary upper-arm muscles responsible for elbow flexion, forearm rotation, and pulling strength."
    },
    {
      name: "Triceps",
      icon: Zap,
      description:
        "A sweeping, three-headed posterior powerhouse that carves a deeply sculpted horseshoe, defining ultimate arm thickness and striking structural mass."
    },
    {
      name: "Legs",
      icon: Footprints,
      description:
        "Sweeping, deeply chiseled lower-body pillars that forge powerful quad teardrops and dense mass, anchoring the physique with striking proportion and structural dominance."
    },
    {
      name: "Core",
      icon: Target,
      description:
        "A deeply etched, razor-sharp centerpiece that tightens the waistline, anchoring the physique with striking abdominal definition and flawless structural symmetry."
    }
  ];

  return (
    <div className="dashboard">

      <Sidebar />

      <main className="dashboard-content">

        {/* Header */}

        <header className="dashboard-header">

          <div>
            <h1>Workout Dashboard</h1>
            <p>Choose your workout and start training today!</p>
          </div>

          <button
            className="add-workout-btn"
            onClick={() => navigate("/add-workout")}
          >
            <Plus size={18} />
            Add Workout
          </button>

        </header>

        {/* Welcome Card */}

        <section className="welcome-card">

          <h2>Train Hard. Stay Consistent.</h2>

          <p>
            Track your workouts, improve your strength,
            and reach your fitness goals.
          </p>

        </section>

        {/* Workout Categories */}

        <section className="workout-section">

          <h2>Workout Categories</h2>

          <div className="workout-grid">

            {workouts.map((workout) => {

              const Icon = workout.icon;

              return (
                <div
                  className="workout-card"
                  key={workout.name}
                >

                  <div className="workout-icon">
                    <Icon size={32} strokeWidth={1.8} />
                  </div>

                  <h3>{workout.name}</h3>

                  <p>{workout.description}</p>

                  <button
                    onClick={() =>
                      navigate(
                        `/add-workout?category=${encodeURIComponent(workout.name)}`
                      )
                    }
                  >
                    Start Workout
                  </button>

                </div>
              );
            })}

          </div>

        </section>

        {/* Quick Actions */}

        <section className="quick-actions">

          <h2>Quick Actions</h2>

          <div className="quick-action-buttons">

            <button
              onClick={() => navigate("/workout-history")}
            >
              <History size={19} />
              View Workout History
            </button>

            <button
              onClick={() => navigate("/diet-planner")}
            >
              <Salad size={19} />
              Plan Your Diet
            </button>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;
