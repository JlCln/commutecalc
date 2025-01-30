import bcrypt from "bcrypt";
import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import authRepository from "./authRepository";

const login: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await authRepository.findByEmail(email);

    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.APP_SECRET || "default-secret",
      { expiresIn: "1h" },
    );
    res.json({
      token,
      user: { id: user.id, email: user.email, username: user.username },
    });
  } catch (err) {
    next(err);
  }
};

const register: RequestHandler = async (req, res, next) => {
  try {
    const { email, password, username } = req.body;

    const existingUser = await authRepository.findByEmail(email);
    if (existingUser) {
      res.status(400).json({ message: "Email already registered" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await authRepository.createUser(
      email,
      hashedPassword,
      username,
    );
    const insertId =
      "insertId" in result
        ? result.insertId
        : Array.isArray(result) && "insertId" in result[0]
          ? result[0].insertId
          : 0;

    const token = jwt.sign(
      { userId: insertId },
      process.env.APP_SECRET || "default-secret",
      { expiresIn: "1h" },
    );

    res.status(201).json({
      token,
      user: { id: insertId, email, username },
    });
    return;
  } catch (err) {
    next(err);
  }
};

const verify: RequestHandler = async (req, res, next) => {
  try {
    if (!req.userId) {
      throw new Error("User ID is required");
    }

    const user = await authRepository.findById(req.userId);

    if (!user) {
      res.status(401).json({ message: "Invalid token" });
      return;
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (err) {
    next(err);
  }
};

export default { login, register, verify };
