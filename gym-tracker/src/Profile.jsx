
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  UserRound,
  Camera,
  Upload,
  Save,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Image
} from "lucide-react";

import Sidebar from "./Sidebar";
import "./Profile.css";

const API_URL = "http://localhost:5000/api";

function Profile() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [profilePicture, setProfilePicture] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const user = response.data.user || response.data;

        setFormData({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
        });

        if (user.profilePictureUrl) {
          setProfilePicture(user.profilePictureUrl);
        } else if (user.profilePicture) {
          setProfilePicture(user.profilePicture);
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to load your profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, token]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim()
    ) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setSaving(true);

      const response = await axios.put(
        `${API_URL}/profile`,
        {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim().toLowerCase(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedUser = response.data.user || response.data;

      const updatedData = {
        firstName: updatedUser.firstName || formData.firstName.trim(),
        lastName: updatedUser.lastName || formData.lastName.trim(),
        email: updatedUser.email || formData.email.trim().toLowerCase(),
      };

      setFormData(updatedData);

      const storedUser = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...storedUser,
          ...updatedData,
        })
      );

      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Unable to update your profile."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Choose a JPG, PNG, or WEBP image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("The image must be smaller than 5 MB.");
      event.target.value = "";
      return;
    }

    setError("");
    setSuccess("");
    setSelectedFile(file);
    setProfilePicture(URL.createObjectURL(file));
  };

  const handleUploadPicture = async () => {
    if (!selectedFile) {
      setError("Please select an image first.");
      return;
    }

    const formDataToUpload = new FormData();
    formDataToUpload.append("file", selectedFile);

    try {
      setUploading(true);
      setError("");
      setSuccess("");

      const response = await axios.put(
        `${API_URL}/profile-picture`,
        formDataToUpload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;

      const pictureUrl =
        data.profilePictureUrl ||
        data.url ||
        data.profilePicture;

      if (pictureUrl) {
        setProfilePicture(pictureUrl);
      }

      setSelectedFile(null);
      setSuccess("Profile picture uploaded successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Unable to upload your profile picture."
      );
    } finally {
      setUploading(false);
    }
  };

  const initials =
    `${formData.firstName.charAt(0)}${formData.lastName.charAt(0)}`
      .toUpperCase() || "U";

  if (loading) {
    return (
      <div className="profile-loading">
        Loading your profile...
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Sidebar />

      <main className="profile-content">

        <header className="profile-header">
          <h1>My Profile</h1>
          <p>Manage your personal information and account.</p>
        </header>

        {error && (
          <div className="profile-error">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {success && (
          <div className="profile-success">
            <CheckCircle size={18} />
            {success}
          </div>
        )}

        <section className="profile-card">

          <div className="profile-picture-section">

            <div className="profile-avatar">
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt="Profile"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <span>{initials}</span>
              )}
            </div>

            <div className="profile-picture-details">
              <h2>
                {formData.firstName} {formData.lastName}
              </h2>

              <p>{formData.email}</p>

              <span>JPG, PNG, or WEBP · Maximum 5 MB</span>
            </div>

          </div>

          <div className="profile-picture-actions">

            <label
              htmlFor="profilePicture"
              className="profile-file-label"
            >
              <Camera size={17} />
              Choose Picture
            </label>

            <input
              id="profilePicture"
              className="profile-file-input"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
            />

            <button
              type="button"
              className="profile-upload-button"
              onClick={handleUploadPicture}
              disabled={!selectedFile || uploading}
            >
              <Upload size={17} />
              {uploading ? "Uploading..." : "Upload Picture"}
            </button>

          </div>

          {selectedFile && (
            <p className="profile-selected-file">
              Selected: {selectedFile.name}
            </p>
          )}

        </section>

        <section className="profile-card">

          <h2>
            <UserRound size={21} />
            Personal Information
          </h2>

          <p className="profile-section-description">
            Update your name and email address.
          </p>

          <form onSubmit={handleSaveProfile}>

            <div className="profile-form-grid">

              <div className="profile-field">
                <label htmlFor="firstName">First Name</label>

                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  autoComplete="given-name"
                  required
                />
              </div>

              <div className="profile-field">
                <label htmlFor="lastName">Last Name</label>

                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  autoComplete="family-name"
                  required
                />
              </div>

              <div className="profile-field profile-email-field">
                <label htmlFor="email">Email Address</label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>

            </div>

            <div className="profile-form-actions">
              <button
                type="submit"
                className="profile-save-button"
                disabled={saving}
              >
                <Save size={17} />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>

          </form>

        </section>

        <section className="profile-card profile-account-card">

          <h2>
            <ShieldCheck size={21} />
            Account Information
          </h2>

          <div className="profile-account-row">
            <span>Account</span>
            <strong>FitTracker Member</strong>
          </div>

          <div className="profile-account-row">
            <span>Profile Status</span>

            <strong className="profile-status">
              Active
            </strong>
          </div>

        </section>

      </main>
    </div>
  );
}

export default Profile;
