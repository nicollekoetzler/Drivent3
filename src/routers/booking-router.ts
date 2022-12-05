import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getBooking, postNewBooking } from "@/controllers";

const bookingRouter = Router();

bookingRouter
  .all("/*", authenticateToken)
  .get("/", getBooking)
  .post("/", postNewBooking);

export { bookingRouter };
