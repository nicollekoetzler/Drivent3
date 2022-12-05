import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getBooking, postNewBooking, updateBooking } from "@/controllers";

const bookingRouter = Router();

bookingRouter
  .all("/*", authenticateToken)
  .get("/", getBooking)
  .post("/", postNewBooking)
  .put("/:bookingId", updateBooking);

export { bookingRouter };
