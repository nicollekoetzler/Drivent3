import app, { init } from "@/app";
import { prisma } from "@/config";
import faker from "@faker-js/faker";
import { TicketStatus } from "@prisma/client";
import e from "express";
import httpStatus from "http-status";
import { number } from "joi";
import * as jwt from "jsonwebtoken";
import supertest from "supertest";
import {
  createEnrollmentWithAddress,
  createUser,
  createTicketType,
  createTicket,
  createPayment,
  generateCreditCardData,
  createTicketTypeWithHotel,
  createTicketTypeRemote,
  createHotel,
  createRoomWithHotelId,
  createBooking,
} from "../factories";
import { cleanDb, generateValidToken } from "../helpers";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("GET /booking", () => {
  it("should respond with status 401 if no token is given", async () => {
    const result = await server.get("/booking");
  
    expect(result.status).toBe(httpStatus.UNAUTHORIZED);
  });
  
  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();
  
    const result = await server.get("/booking").set("Authorization", `Bearer ${token}`);
  
    expect(result.status).toBe(httpStatus.UNAUTHORIZED);
  });
  
  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
  
    const result = await server.get("/booking").set("Authorization", `Bearer ${token}`);
  
    expect(result.status).toBe(httpStatus.UNAUTHORIZED);
  });
  
  describe("when token is valid", () => {
    it("should respond with status 404 when user has no enrollment", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
  
      const ticketType = await createTicketTypeRemote();
  
      const result = await server.get("/booking").set("Authorization", `Bearer ${token}`);
  
      expect(result.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 404 when user has no ticket", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);

      const verifyTicket = { userId: user.id };
  
      const result = await server.get("/booking").set("Authorization", `Bearer ${token}`).send(verifyTicket);
  
      expect(result.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 404 when user has no booking", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
  
      const result = await server.get("/booking").set("Authorization", `Bearer ${token}`);
  
      expect(result.status).toEqual(httpStatus.NOT_FOUND);
    });
  
    it("should respond with status 200 and booking", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
        
      const createdHotel = await createHotel();
      const createdRoom = await createRoomWithHotelId(createdHotel.id);
      const createdBooking = await createBooking(user.id, createdRoom.id);
  
      const result = await server.get("/booking").set("Authorization", `Bearer ${token}`);
  
      expect(result.status).toEqual(httpStatus.OK);
  
      expect(result.body).toEqual([
        {
          id: createdBooking.id,
          Room: {
            id: createdRoom.id,
            name: createdRoom.name,
            capacity: createdRoom.capacity,
            hotelId: createdHotel.id,
            createdAt: createdRoom.createdAt.toISOString(),
            updatedAt: createdRoom.updatedAt.toISOString(),
          }
        }
      ]);
    });
  });
});

describe("POST /booking", () => {
  it("should respond with status 401 if no token is given", async () => {
    const result = await server.post("/booking");
  
    expect(result.status).toBe(httpStatus.UNAUTHORIZED);
  });
  
  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();
  
    const result = await server.post("/booking").set("Authorization", `Bearer ${token}`);
  
    expect(result.status).toBe(httpStatus.UNAUTHORIZED);
  });
  
  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
  
    const result = await server.post("/booking").set("Authorization", `Bearer ${token}`);
  
    expect(result.status).toBe(httpStatus.UNAUTHORIZED);
  });
  
  describe("when token is valid", () => {
    it("should respond with status 404 when user has no enrollment", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
  
      const ticketType = await createTicketTypeRemote();
  
      const result = await server.post("/booking").set("Authorization", `Bearer ${token}`);
  
      expect(result.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 404 when user has no ticket", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);

      const verifyTicket = { userId: user.id };
  
      const result = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(verifyTicket);
  
      expect(result.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 404 when user has no booking", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
  
      const result = await server.post("/booking").set("Authorization", `Bearer ${token}`);
  
      expect(result.status).toEqual(httpStatus.FORBIDDEN);
    });

    it("should respond with status 404 when room does not exist", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);

      const body = { userId: user.id, roomId: room.id+1 };
      const result = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(body);

      expect(result.status).toEqual(httpStatus.NOT_FOUND);
    });

    // TODO: verify if room is full

    it("should respond with status 200 and bookingId", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);

      const body = { userId: user.id, roomId: room.id };
      const result = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(body);

      expect(result.status).toEqual(httpStatus.OK);
      expect(result.body).toEqual({
        bookingId: result.body.bookingId,
      });
    });
  });
});
