
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    } = formData;

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await axios.post("http://localhost:5000/api/register", {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      setSuccess("Registration successful! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <div className="register-logo">🏋️</div>

        <h1>FitTracker</h1>

        <p className="register-subtitle">
          Start your fitness journey today.
        </p>

        <h2>Create Account</h2>

        <p className="register-description">
          Register to track workouts and manage your fitness goals.
        </p>

        {error && (
          <div className="register-error">
            {error}
          </div>
        )}

        {success && (
          <div className="register-success">
            {success}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div className="register-name-row">
            <div className="register-field">
              <label htmlFor="firstName">First Name</label>

              <input
                id="firstName"
                type="text"
                name="firstName"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleChange}
                autoComplete="given-name"
                required
              />
            </div>

            <div className="register-field">
              <label htmlFor="lastName">Last Name</label>

              <input
                id="lastName"
                type="text"
                name="lastName"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleChange}
                autoComplete="family-name"
                required
              />
            </div>
          </div>

          <div className="register-field">
            <label htmlFor="registerEmail">Email Address</label>

            <input
              id="registerEmail"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="register-field">
            <label htmlFor="registerPassword">Password</label>

            <div className="register-password-wrapper">
              <input
                id="registerPassword"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Minimum 8 characters"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                minLength={8}
                required
              />
            </div>
          </div>

          <div className="register-field">
            <label htmlFor="confirmPassword">
              Confirm Password
            </label>

            <div className="register-password-wrapper">
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                minLength={8}
                required
              />

              <button
                type="button"
                className="register-show-password"
                onClick={() =>
                  setShowPassword((previous) => !previous)
                }
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="register-submit-button"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="register-login-text">
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
