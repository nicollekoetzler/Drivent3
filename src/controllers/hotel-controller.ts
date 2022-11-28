import { AuthenticatedRequest } from "@/middlewares";
import hotelService from "@/services/hotel-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  const { userId } = req.body;

  try {
    const hotel = await hotelService.getHotels(userId);
    
    return res.status(httpStatus.OK).send(hotel);
  } catch (error) {
    if(error.name === "invalidPaymentError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    
    if(error.name === "notFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    if(error.name === "unauthorizedError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

