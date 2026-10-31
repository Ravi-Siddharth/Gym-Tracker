
import { NavLink, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Dumbbell,
  History,
  Salad,
  UserRound,
  LogOut
} from "lucide-react";

import "./Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard"
    },
    {
      name: "Add Workout",
      icon: Dumbbell,
      path: "/add-workout"
    },
    {
      name: "Workout History",
      icon: History,
      path: "/workout-history"
    },
    {
      name: "Diet Planner",
      icon: Salad,
      path: "/diet-planner"
    },
    {
      name: "Profile",
      icon: UserRound,
      path: "/profile"
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="sidebar">

      {/* Logo */}
      <div className="sidebar-brand">
        <h2>FitTracker</h2>
        <p>Gym & Fitness Tracker</p>
      </div>

      {/* Navigation */}
      <nav className="sidebar-navigation">

        <p className="sidebar-heading">MENU</p>

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? "sidebar-link active"
                  : "sidebar-link"
              }
            >
              <Icon size={20} strokeWidth={2} />

              <span>{item.name}</span>
            </NavLink>
          );
        })}

      </nav>

      {/* Logout */}
      <div className="sidebar-bottom">
        <button
          className="sidebar-logout"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>

    </aside>
  );
}

export default Sidebar;
