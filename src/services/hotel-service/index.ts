import { notFoundError } from "@/errors";
import hotelRepository from "@/repositories/hotel-repository";

async function getHotels() {
  const hotel = await hotelRepository.findHotels();

  if (!hotel) throw notFoundError();

  return hotel;
}

const hotelService = {
  getHotels
};

export default hotelService;
