import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { authenticate } from "../../utils/auth";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get list of users
 *     description: Get list of users
 *     responses:
 *       200:
 *         $ref: '#/components/responses/UsersResponse'
 *       401:
 *         $ref: '#/components/responses/AuthFailedResponse'
 *       405:
 *         $ref: '#/components/responses/MethodNotAllowedResponse'
 *       500:
 *         $ref: '#/components/responses/ServerErrorResponse'
 *     security:
 *       - BearerAuth: []
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DataResponse>
) {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = (page - 1) * limit;

  try {
    if (req.method !== "GET") {
      // Only GET method is accepted
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
    if (typeof req.headers.authorization !== "string") {
      return res.status(401).json({
        message: "Unauthorized - No Authorization Header",
      });
    }

    const user = authenticate({
      headers: { authorization: req.headers.authorization },
    });

    if (!user) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    const total = await prisma.user.count();
    if (user.role === "admin") {
      const users = await prisma.user.findMany({
        orderBy: [
          {
            updatedAt: "desc",
          },
        ],
        skip: offset,
        take: limit,
      });
      res.status(200).json({ data: { users, total } });
    } else {
      const users = await prisma.user.findMany({
        where: {
          id: parseInt(user.userId),
        },
      });
      res.status(200).json({ data: { users, total } });
    }
  } catch (error: any) {
    res.status(500).json({
      message: error?.message,
    });
  }
}
