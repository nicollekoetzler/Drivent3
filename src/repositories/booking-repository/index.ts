import { prisma } from "@/config";

async function findBooking(hotelId: number) {
  return prisma.booking.findFirst({
    where: {
      id: hotelId,
    },
    include: {
      Room: true,
    }
  });
}

const hotelRepository = {
  findBooking,
};

export default hotelRepository;
