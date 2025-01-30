import type { Request, RequestHandler, Response } from "express";
import transportRepository from "./transportRepository";

const getStops = async (req: Request, res: Response) => {
  try {
    const stops = await transportRepository.getAllStops();
    res.json(stops);
  } catch (error) {
    console.error("Transport stops error:", error);
    res.status(500).json({ message: "Failed to fetch transport stops" });
  }
};

const calculateCommuteStats: RequestHandler = async (req, res, next) => {
  try {
    if (!req.userId) {
      throw new Error("User ID is required");
    }

    const { startStopId, endStopId, departureTime, selectedDate } = req.body;

    const record = {
      user_id: req.userId,
      start_stop_id: Number(startStopId),
      end_stop_id: Number(endStopId),
      departure_time: departureTime,
      average_duration_minutes: req.body.average_duration_minutes,
      days_of_week: "MON,TUE,WED,THU,FRI",
    };

    await transportRepository.createCommuteRecord(record);
    const stats = await transportRepository.getCommuteStats(req.userId);
    res.json(stats);
  } catch (err) {
    next(err);
  }
};

const getUserStats: RequestHandler = async (req, res, next) => {
  try {
    if (!req.userId) {
      throw new Error("User ID is required");
    }
    const stats = await transportRepository.getUserStats(req.userId);
    res.json(stats);
  } catch (err) {
    next(err);
  }
};

const getDetailedStats: RequestHandler = async (req, res, next) => {
  try {
    if (!req.userId) {
      throw new Error("User ID is required");
    }

    const stats = await transportRepository.getDetailedStats(req.userId);
    res.json(stats);
  } catch (err) {
    next(err);
  }
};

export default {
  getStops,
  calculateCommuteStats,
  getUserStats,
  getDetailedStats,
};
