import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { notFoundError, unauthorizedError, forbiddenError } from "@/errors";
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
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw forbiddenError();
  }
  //Tem ticket pago isOnline false e includesHotel true
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw forbiddenError();
  }

  // verify if there is a room
  const room = await bookingRepository.findBookingRoom(roomId);
  if (!room) {
    throw notFoundError();
  }

  // verify if the room is full
  if (room.Booking.length === room.capacity) {
    throw forbiddenError();
  }

  const createsBooking = await bookingRepository.createBooking(userId, roomId);
  return createsBooking;
}

async function updateBooking(oldBookingId: number, userId: number, roomId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw forbiddenError();
  }

  //Tem ticket pago isOnline false e includesHotel true
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw forbiddenError();
  }

  const booking = await bookingRepository.findBooking(userId);
  if (!booking || booking.id !== oldBookingId) {
    throw forbiddenError();
  }
  
  const room = await bookingRepository.findBookingRoom(roomId);
  if (!room) {
    throw notFoundError();
  }
  
  if (room.Booking.length === room.capacity) {
    throw forbiddenError();
  }

  if (roomId <= 0) {
    throw forbiddenError();
  }

  const newBooking = await bookingRepository.createBooking(userId, roomId);
  await bookingRepository.removeBooking(oldBookingId);
  return newBooking;
}

const bookingService = {
  getBooking,
  createBooking,
  updateBooking
};

export default bookingService;
