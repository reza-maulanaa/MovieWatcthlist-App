import express from "express";
import { getMyWatchlist, addToWatchlist, removeFromWatchlist, updateWatchlistItem } from "../controller/watchlistController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { addToWatchlistSchema } from "../validator/watchlistValidators.js";

const router = express.Router();

router.use(authMiddleware)

router.get("/", getMyWatchlist);
router.post("/", validateRequest(addToWatchlistSchema), addToWatchlist);

router.put("/:id", updateWatchlistItem)

router.delete("/:id", removeFromWatchlist)

export default router;
