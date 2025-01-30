import type { NextFunction, Request, Response } from "express";

interface CommuteInput {
  startStopId: number;
  endStopId: number;
  departureTime: string;
  selectedDate: string;
}

export const validateCommuteInput = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { startStopId, endStopId, departureTime, selectedDate }: CommuteInput =
    req.body;

  const errors: string[] = [];

  if (!startStopId) errors.push("Start location is required");
  if (!endStopId) errors.push("End location is required");
  if (!departureTime) errors.push("Departure time is required");
  if (!selectedDate) errors.push("Date is required");

  if (startStopId === endStopId) {
    errors.push("Start and end locations must be different");
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};
