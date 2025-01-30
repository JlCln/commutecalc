import express from "express";
import authMiddleware from "./middleware/auth";
import authActions from "./modules/auth/authActions";
import transportActions from "./modules/transport/transportActions";
import userActions from "./modules/user/userActions";

const router = express.Router();

router.get("/api/auth/verify", authMiddleware, authActions.verify);
router.post("/api/auth/login", authActions.login);
router.post("/api/auth/register", authActions.register);

router.get("/api/transport/stops", authMiddleware, transportActions.getStops);

router.post(
  "/api/commute/calculate",
  authMiddleware,
  transportActions.calculateCommuteStats,
);
router.get("/api/commute/stats", authMiddleware, transportActions.getUserStats);

router.get(
  "/api/commute/detailed-stats",
  authMiddleware,
  transportActions.getDetailedStats,
);
router.put("/api/user/update", authMiddleware, userActions.updateUser);
router.post("/api/user/avatar", authMiddleware, userActions.updateAvatar);

export default router;
