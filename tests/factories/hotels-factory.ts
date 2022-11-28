import { prisma } from "@/config";
import { TicketStatus } from "@prisma/client";

export async function createValidTicket() {
  return prisma.ticketType.create({
    data: {
      name: "Valid",
      price: 1500,
      isRemote: false,
      includesHotel: true,
    }
  });
}

export async function createInvalidTicket() {
  return prisma.ticketType.create({
    data: {
      name: "Invalid",
      price: 1500,
      isRemote: true,
      includesHotel: true,
    }
  });
}

// export async function createHotel() {
//     return prisma.hotel.create({
//         data: {
//             name: "Invalid",
//             image: sda,
//         }
//     });
// }

// export async function createRoom() {
//     return prisma.room.create({
//         data: {
//             name: "Valid",
//             capacity: 2,
//             hotelId: id,
//         }
//     });
// }
