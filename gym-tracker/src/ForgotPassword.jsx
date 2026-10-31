
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ForgotPassword.css";

const API_URL = "http://localhost:5000/api";

function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Step 1: Request OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/forgot-password`,
        { email: email.trim() }
      );

      setMessage(
        response.data.message || "OTP sent to your email."
      );

      setStep(2);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Unable to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!otp.trim()) {
      setError("Please enter the OTP.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/verify-otp`,
        {
          email: email.trim(),
          otp: otp.trim()
        }
      );

      setMessage(
        response.data.message || "OTP verified successfully."
      );

      setStep(3);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Invalid or expired OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

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

      const response = await axios.post(
        `${API_URL}/reset-password`,
        {
          email: email.trim(),
          otp: otp.trim(),
          newPassword: password
        }
      );

      setMessage(
        response.data.message ||
        "Password reset successfully."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Unable to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-page">
      <div className="forgot-card">
        <div className="forgot-icon">🔐</div>

        <h1>Forgot Password?</h1>

        <p className="forgot-subtitle">
          {step === 1 &&
            "Enter your registered email to receive an OTP."}

          {step === 2 &&
            "Enter the OTP sent to your email address."}

          {step === 3 &&
            "Create a new password for your account."}
        </p>

        <div className="forgot-steps">
          <span className={step >= 1 ? "active" : ""}>1</span>
          <div className={step >= 2 ? "active-line" : ""}></div>
          <span className={step >= 2 ? "active" : ""}>2</span>
          <div className={step >= 3 ? "active-line" : ""}></div>
          <span className={step >= 3 ? "active" : ""}>3</span>
        </div>

        {error && (
          <div className="forgot-error">
            {error}
          </div>
        )}

        {message && (
          <div className="forgot-success">
            {message}
          </div>
        )}

        {/* Step 1: Email */}
        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <label htmlFor="forgot-email">
              Email Address
            </label>

            <input
              id="forgot-email"
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="forgot-button"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* Step 2: OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <label htmlFor="forgot-otp">
              Enter OTP
            </label>

            <input
              id="forgot-otp"
              type="text"
              inputMode="numeric"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              maxLength={6}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="forgot-button"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              type="button"
              className="forgot-secondary-button"
              onClick={() => {
                setStep(1);
                setOtp("");
                setError("");
                setMessage("");
              }}
            >
              Change Email
            </button>
          </form>
        )}

        {/* Step 3: New password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <label htmlFor="new-password">
              New Password
            </label>

            <input
              id="new-password"
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
            />

            <label htmlFor="confirm-password">
              Confirm New Password
            </label>

            <input
              id="confirm-password"
              type="password"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={8}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="forgot-button"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        <div className="forgot-footer">
          Remember your password?{" "}
          <Link to="/login">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
