import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/utils/prisma';
import bcrypt from 'bcryptjs';
import { registerSchema } from '@/utils/schemas';
import { z } from 'zod';
import { parseErrors } from '@/utils';

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: 
 *       - Authentication
 *     summary: User registration
 *     description: User registration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/payloads/RegisterPayload'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/RegisterResponse'
 *       405:
 *         $ref: '#/components/responses/MethodNotAllowedResponse'
 *       500:
 *         $ref: '#/components/responses/ServerErrorResponse'
*/
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RegisterResponse>
): Promise<void> {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ message: 'Method not allowed' });
      return;
    }

    const { name, email, password, role } = registerSchema.parse(req.body);
    const existUser = await prisma.user.findUnique({ where: { email } });
    if (existUser) {
      return res
        .status(400)
        .json({ message: "User already exists" });
    }

    const today = new Date();
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        geojson: "",
        createdAt: today,
        updatedAt: today
      },
    });
    res.status(201).json({ message: 'User created', user });
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
