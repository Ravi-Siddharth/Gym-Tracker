
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Dashboard from "./Dashboard";
import AddWorkout from "./AddWorkout";
import WorkoutHistory from "./WorkoutHistory";
import DietPlanner from "./DietPlanner";
import Login from "./Login";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";
import Profile from "./Profile";
import Admin from "./Admin";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default page */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        {/* Authentication pages */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        {/* User pages */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/add-workout"
          element={<AddWorkout />}
        />

        <Route
          path="/workout-history"
          element={<WorkoutHistory />}
        />

        <Route
          path="/diet-planner"
          element={<DietPlanner />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        {/* Admin page */}
        <Route
          path="/admin"
          element={<Admin />}
        />

        {/* Unknown routes */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
