import { createMocks } from "node-mocks-http";
import type { NextApiRequest, NextApiResponse } from "next";
import handler from "@/pages/api/auth/login";
import { loginSchema } from "@/utils/schemas";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "@/utils/prisma";
import { jest } from "@jest/globals";
import { User } from "@prisma/client";
import { z } from "zod";

jest.mock("@/utils/schemas", () => ({
  loginSchema: {
    parse: jest.fn(),
  },
}));
jest.mock("@/utils/prisma", () => ({
  user: {
    findUnique: jest.fn(),
  },
}));
jest.mock("@/utils/auth");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

function createNextRequestMock() {
  const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
    method: "POST",
  });

  // Adding the 'env' property to match NextApiRequest
  Object.defineProperty(req, "env", {
    value: process.env,
  });

  return { req, res };
}

describe("Login API", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks in between tests
  });

  it("responds 200 when successful", async () => {
    const { req, res } = createNextRequestMock();
    req.body = {
      email: "user.test1@gmail.com",
      password: "testpassword",
    };

    (loginSchema.parse as jest.Mock).mockReturnValue(req.body);

    const mockUser: User = {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      password: "hashedPassword",
      role: "user",
      geojson: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (prisma.user.findUnique as jest.Mock).mockReturnValueOnce(mockUser);

    (bcrypt.compare as jest.Mock).mockReturnValue(true);

    (jwt.sign as jest.Mock).mockReturnValue("token");

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
  });

  it("responds 405 if method was not POST", async () => {
    const { req, res } = createNextRequestMock();
    req.method = "GET";

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
  });

  it("responds 401 if email was not found", async () => {
    const { req, res } = createNextRequestMock();
    req.body = {
      email: "user.test@gmail.com",
      password: "test",
    };

    await handler(req, res);

    expect(res._getStatusCode()).toBe(401);
  });

  it("responds 400 if email was not found", async () => {
    const { req, res } = createNextRequestMock();
    req.body = {
      email: "user.test",
      password: "test",
    };

    const mockError = new z.ZodError([]);
    (loginSchema.parse as jest.Mock).mockImplementation(() => {
      throw mockError;
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
  });

  it("responds 500 if there is a server error", async () => {
    const { req, res } = createNextRequestMock();
    req.body = { email: "user.test@gmail.com", password: "test123" };

    (loginSchema.parse as jest.Mock).mockReturnValue(req.body);

    (prisma.user.findUnique as jest.Mock).mockRejectedValueOnce(
      new Error("Database error") as never
    );

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toEqual({ message: "Internal server error" });
  });
});
