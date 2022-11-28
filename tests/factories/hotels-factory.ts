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
