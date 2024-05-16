import { NextApiRequest, NextApiResponse } from "next";
import prisma from '@/utils/prisma';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { loginSchema } from '@/utils/schemas';
import { z } from 'zod';
import { parseErrors } from "@/utils";

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: User login
 *     description: User login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/payloads/LoginPayload'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/LoginResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequestResponse'
 *       401:
 *         $ref: '#/components/responses/AuthFailedResponse'
 *       405:
 *         $ref: '#/components/responses/MethodNotAllowedResponse'
 *       500:
 *         $ref: '#/components/responses/ServerErrorResponse'
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponse>
) {
  try {
    if (req.method !== "POST") {
      return res
        .status(405)
        .json({ message: "Method not allowed" });
    }

    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .json({ message: "Authentication failed" });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    res
      .status(200)
      .json({
        token,
        userId: user.id,
        message: "Logged in successfully",
      });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: parseErrors(error.flatten())
      });
    }
    return res
      .status(500)
      .json({ message: "Internal server error" });
  }
}
