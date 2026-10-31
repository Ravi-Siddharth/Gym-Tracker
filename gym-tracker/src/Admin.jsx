import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


import {
  Dumbbell,
  LayoutDashboard,
  House,
  LogOut,
  Users,
  Activity,
  Salad,
  ShieldCheck,
  Trash2,
} from "lucide-react";

import "./Admin.css";

const API_URL = "http://localhost:5000/api";

function Admin() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalWorkouts: 0,
    totalDietPlans: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [deletingId, setDeletingId] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    const loadAdminData = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/admin/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data;

        setUsers(data.users || []);

        setStats({
          totalUsers:
            data.stats?.totalUsers ?? data.users?.length ?? 0,
          totalWorkouts: data.stats?.totalWorkouts ?? 0,
          totalDietPlans: data.stats?.totalDietPlans ?? 0,
        });

      } catch (err) {
        const status = err.response?.status;

        if (status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login", { replace: true });
          return;
        }

        setError(
          status === 403
            ? "Access denied. Only administrators can view this page."
            : err.response?.data?.message ||
              err.response?.data?.error ||
              "Unable to load admin dashboard."
        );

      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, [navigate, token]);

  // DELETE USER
  const handleDeleteUser = async (userId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      setDeletingId(userId);

      await axios.delete(
        `${API_URL}/admin/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers((previous) =>
        previous.filter((user) => user._id !== userId)
      );

      setStats((previous) => ({
        ...previous,
        totalUsers: Math.max(0, previous.totalUsers - 1),
      }));

      setMessage("User deleted successfully.");

    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to delete this user."
      );

    } finally {
      setDeletingId("");
    }
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  if (loading) {
    return (
      <div className="admin-loading">
        Loading admin dashboard...
      </div>
    );
  }

  return (
    <div className="admin-page">

      {/* SIDEBAR */}
      <aside className="admin-sidebar">

      <div className="admin-brand">
  <Dumbbell
    size={30}
    strokeWidth={2.2}
    className="brand-icon"
  />
  <h2 className="logo">Fit Tracker</h2>
</div>

        <div className="admin-role-label">
          ADMIN PANEL
        </div>

        <nav className="admin-navigation">

          <button className="admin-nav-active">
            <LayoutDashboard size={19} />
            <span>Dashboard</span>
          </button>

          <button onClick={() => navigate("/dashboard")}>
            <House size={19} />
            <span>User Dashboard</span>
          </button>

        </nav>

        <button
          className="admin-logout"
          onClick={handleLogout}
        >
          <LogOut size={19} />
          <span>Logout</span>
        </button>

      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-content">

        {/* HEADER */}
        <header className="admin-header">

          <div>
            <h1>Admin Dashboard</h1>
            <p>
              Manage FitTracker users and monitor activity.
            </p>
          </div>

          <span className="admin-badge">
            <ShieldCheck size={17} />
            Administrator
          </span>

        </header>

        {/* MESSAGES */}
        {error && (
          <div className="admin-error">
            {error}
          </div>
        )}

        {message && (
          <div className="admin-success">
            {message}
          </div>
        )}

        {/* STATISTICS */}
        <section className="admin-stats">

          <div className="admin-stat-card">

            <div className="admin-stat-icon admin-users-icon">
              <Users size={27} />
            </div>

            <div>
              <p>Total Users</p>
              <h2>{stats.totalUsers}</h2>
            </div>

          </div>

          <div className="admin-stat-card">

            <div className="admin-stat-icon admin-workouts-icon">
              <Activity size={27} />
            </div>

            <div>
              <p>Total Workouts</p>
              <h2>{stats.totalWorkouts}</h2>
            </div>

          </div>

          <div className="admin-stat-card">

            <div className="admin-stat-icon admin-diet-icon">
              <Salad size={27} />
            </div>

            <div>
              <p>Total Diet Plans</p>
              <h2>{stats.totalDietPlans}</h2>
            </div>

          </div>

        </section>

        {/* REGISTERED USERS */}
        <section className="admin-users-section">

          <div className="admin-section-header">

            <div>
              <h2>Registered Users</h2>
              <p>View and manage user accounts.</p>
            </div>

            <span className="admin-user-count">
              {users.length} users
            </span>

          </div>

          {error && users.length === 0 ? (

            <div className="admin-empty">
              User information is unavailable.
            </div>

          ) : users.length === 0 ? (

            <div className="admin-empty">
              No registered users found.
            </div>

          ) : (

            <div className="admin-table-wrapper">

              <table className="admin-users-table">

                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {users.map((user) => (

                    <tr key={user._id}>

                      <td>
                        <div className="admin-user-info">

                          <div className="admin-user-avatar">
                            {(
                              `${user.firstName?.charAt(0) || ""}` +
                              `${user.lastName?.charAt(0) || ""}`
                            ).toUpperCase() || "U"}
                          </div>

                          <strong>
                            {user.firstName} {user.lastName}
                          </strong>

                        </div>
                      </td>

                      <td>{user.email}</td>

                      <td>
                        <span
                          className={
                            user.role === "admin"
                              ? "admin-role admin-role-admin"
                              : "admin-role"
                          }
                        >
                          {user.role || "user"}
                        </span>
                      </td>

                      <td>
                        {user.createdAt
                          ? new Date(
                              user.createdAt
                            ).toLocaleDateString("en-IN")
                          : "—"}
                      </td>

                      <td>

                        {user.role === "admin" ? (

                          <span className="admin-protected">
                            <ShieldCheck size={15} />
                            Protected
                          </span>

                        ) : (

                          <button
                            className="admin-delete-button"
                            onClick={() =>
                              handleDeleteUser(user._id)
                            }
                            disabled={deletingId === user._id}
                          >

                            <Trash2 size={16} />

                            {deletingId === user._id
                              ? "Deleting..."
                              : "Delete"}

                          </button>

                        )}

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default Admin;