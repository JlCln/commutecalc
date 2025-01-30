import { motion } from "framer-motion";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Avatar from "./Avatar";

export default function UserProfile() {
  const { user, token, setUser } = useAuth();
  const [formData, setFormData] = useState({
    email: user?.email || "",
    username: user?.username || "",
    password: "",
    newPassword: "",
  });
  const [message, setMessage] = useState("");

  const handleAvatarChange = async (file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/avatar`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      if (!response.ok) throw new Error("Failed to update avatar");

      const data = await response.json();

      if (user) {
        setUser({
          ...user,
          avatar_url: data.user.avatar_url,
        });
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...user,
            avatar_url: data.user.avatar_url,
          }),
        );
      }

      setMessage("Avatar updated successfully!");
    } catch (error) {
      setMessage("Failed to update avatar");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) throw new Error("Update failed");
      setMessage("Profile updated successfully!");
    } catch (error) {
      setMessage("Failed to update profile");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="user-profile"
    >
      <div className="avatar-profile-container">
        <Avatar
          url={user?.avatar_url}
          onImageChange={handleAvatarChange}
          size="large"
        />
      </div>
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="current-password">Current Password</label>
          <input
            type="password"
            id="current-password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="new-password">New Password (optional)</label>
          <input
            type="password"
            id="new-password"
            value={formData.newPassword}
            onChange={(e) =>
              setFormData({ ...formData, newPassword: e.target.value })
            }
          />
        </div>

        <button type="submit">Update Profile</button>
      </form>
      {message && <div className="message">{message}</div>}
    </motion.div>
  );
}
