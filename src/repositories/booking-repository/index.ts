import { prisma } from "@/config";

async function findBooking(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId,
    },
    include: {
      Room: true,
    }
  });
}

async function createBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      userId,
      roomId,
    }
  });
}

async function findBookingRoom(roomId: number) {
  return prisma.room.findFirst({
    where: {
      id: roomId,
    },
    include: {
      Booking: true,
    }
  });
}

async function removeBooking(bookingId: number) {
  return prisma.booking.delete({
    where: {
      id: bookingId
    }
  });
}

const bookingRepository = {
  findBooking,
  createBooking,
  findBookingRoom,
  removeBooking,
};

export default bookingRepository;
