import { prisma } from "@/config";
import { TicketStatus } from "@prisma/client";

export async function createTicketWithHotel() {
  return prisma.ticketType.create({
    data: {
      name: "withHotel",
      price: 1500,
      isRemote: false,
      includesHotel: true,
    }
  });
}

export async function createTicketWithoutHotel() {
  return prisma.ticketType.create({
    data: {
      name: "withoutHotel",
      price: 1500,
      isRemote: true,
      includesHotel: false,
    }
  });
}
