import fs from "node:fs";
import path from "node:path";
import bcrypt from "bcrypt";
import type { RequestHandler } from "express";
import multer from "multer";
import userRepository from "./userRepository";

const publicDir = path.join(__dirname, "../../../public/avatars");
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

interface UpdateUserRequest {
  email: string;
  username: string;
  password: string;
  newPassword?: string;
}

interface User {
  id: number;
  email: string;
  username: string;
  password: string;
}

const storage = multer.diskStorage({
  destination: publicDir,
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `avatar-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

const updateUser: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.userId as number;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { email, username, password, newPassword } =
      req.body as UpdateUserRequest;

    if (!email?.trim() || !username?.trim() || !password?.trim()) {
      res.status(400).json({
        message: "Missing required fields",
        details: {
          email: !email?.trim() ? "Email is required" : null,
          username: !username?.trim() ? "Username is required" : null,
          password: !password?.trim() ? "Current password is required" : null,
        },
      });
      return;
    }

    const user = await userRepository.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      res.status(401).json({ message: "Invalid current password" });
      return;
    }

    const updates: Partial<Pick<User, "email" | "username" | "password">> = {
      email,
      username,
    };
    if (newPassword?.trim()) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(newPassword, salt);
    }

    await userRepository.updateUser(userId, updates);
    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    next(err);
  }
};

const updateAvatar: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.userId as number;
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    const avatarUrl = `/avatars/${req.file.filename}`;
    await userRepository.updateUser(userId, { avatar_url: avatarUrl });

    const updatedUser = await userRepository.findById(userId);

    res.json({
      message: "Avatar updated successfully",
      user: {
        id: updatedUser?.id,
        email: updatedUser?.email,
        username: updatedUser?.username,
        avatar_url: avatarUrl,
      },
    });
  } catch (err) {
    next(err);
  }
};

export default {
  updateUser,
  updateAvatar: [upload.single("avatar"), updateAvatar],
};
