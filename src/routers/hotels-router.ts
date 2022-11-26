import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getHotels } from "@/controllers/hotel-controller";

const hotelsRouter = Router();

hotelsRouter
  .all("/*", authenticateToken)
  .get("", getHotels);
// .get("/:hotelId", getRooms)

export { hotelsRouter };
