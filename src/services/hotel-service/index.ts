import { notFoundError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import hotelRepository from "@/repositories/hotel-repository";

async function getHotels(userId: number) {
  const isUserEnrolled = await enrollmentRepository.findWithAddressByUserId(userId);

  if(!isUserEnrolled) throw notFoundError();

  const hotel = await hotelRepository.findHotels();

  if (!hotel) throw notFoundError();
  return hotel;
}

const hotelService = {
  getHotels
};

export default hotelService;
