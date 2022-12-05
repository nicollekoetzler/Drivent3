import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { notFoundError, unauthorizedError } from "@/errors";
import bookingRepository from "@/repositories/booking-repository";

async function listBooking(userId: number) {
  //Tem enrollment?
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  //Tem ticket pago isOnline false e includesHotel true
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw notFoundError();
  }
}

async function getBooking(userId: number) {
  await listBooking(userId);

  const booking = await bookingRepository.findBooking(userId);
  if (!booking) {
    throw notFoundError();
  }

  return {
    id: booking.id,
    Room: booking.Room
  };
}

async function createBooking(userId: number, roomId: number) {
  await listBooking(userId);

  // verify if there is a room
  const room = await bookingRepository.findBookingRoom(roomId);
  if (!room) {
    throw notFoundError();
  }

  // verify if the room is full
  if (room.Booking.length === room.capacity) {
    throw unauthorizedError();
  }

  const createsBooking = await bookingRepository.createBooking(userId, roomId);
  return createsBooking;
}

const bookingService = {
  getBooking,
  createBooking,
};

export default bookingService;
