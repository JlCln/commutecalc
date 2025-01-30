import { motion } from "framer-motion";
import { useState } from "react";
import defaultAvatar from "../assets/default-avatar.png";

interface AvatarProps {
  url?: string | null;
  onImageChange: (file: File) => Promise<void>;
  size?: "small" | "medium" | "large";
}

export default function Avatar({
  url,
  onImageChange,
  size = "medium",
}: AvatarProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getImageUrl = () => {
    if (!url) return defaultAvatar;
    if (url.startsWith("http")) return url;
    return `${import.meta.env.VITE_API_URL}${url}`;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsLoading(true);
      try {
        await onImageChange(file);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <button
      className={`avatar-container avatar-${size}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Change profile picture"
      type="button"
    >
      <motion.div
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        className="avatar-wrapper"
      >
        <img
          src={getImageUrl()}
          alt="Profile"
          className={`avatar-image ${isHovered ? "hovered" : ""}`}
        />

        {isLoading && (
          <div className="avatar-loading">
            <div className="spinner" />
          </div>
        )}

        <motion.label
          className={`avatar-overlay ${isHovered ? "visible" : ""}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          whileHover={{ scale: 1.02 }}
        >
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
            aria-label="Upload new profile picture"
          />
          <motion.span className="change-photo-btn">Change Photo</motion.span>
        </motion.label>
      </motion.div>
    </button>
  );
}
