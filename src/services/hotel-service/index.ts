import { notFoundError, invalidPaymentError, unauthorizedError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import hotelRepository from "@/repositories/hotel-repository";
import ticketRepository from "@/repositories/ticket-repository";

async function getHotels(userId: number) {
  const isUserEnrolled = await enrollmentRepository.findWithAddressByUserId(userId);

  if(!isUserEnrolled) throw notFoundError();

  const isTicketPaid = await ticketRepository.findTicketByUserId(userId);

  if(isTicketPaid.status === "RESERVED") throw invalidPaymentError();

  if(isTicketPaid.TicketType.isRemote === true || isTicketPaid.TicketType.includesHotel === false) throw unauthorizedError();

  const hotel = await hotelRepository.findHotels();
  if (!hotel) throw notFoundError();
  return hotel;
}

async function getHotelRooms(userId: number, hotelId: number) {
  const isUserEnrolled = await enrollmentRepository.findWithAddressByUserId(userId);

  if(!isUserEnrolled) throw notFoundError();

  const isTicketPaid = await ticketRepository.findTicketByUserId(userId);

  if(isTicketPaid.status === "RESERVED") throw invalidPaymentError();

  if(isTicketPaid.TicketType.isRemote === true || isTicketPaid.TicketType.includesHotel === false) throw unauthorizedError();

  const rooms = await hotelRepository.findHotelRooms(hotelId);
  if (!rooms) throw notFoundError();
  return rooms;
}

const hotelService = {
  getHotels,
  getHotelRooms
};

export default hotelService;
