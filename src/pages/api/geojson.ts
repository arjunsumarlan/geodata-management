import { NextApiRequest, NextApiResponse } from "next";
import { hint } from "@mapbox/geojsonhint";
import prisma from '@/utils/prisma';
import { authenticate } from "../../utils/auth";
import { geojsonSchema } from "@/utils/schemas";
import { z } from "zod";
import { parseErrors } from "@/utils";

/**
 * @swagger
 * /api/geojson:
 *   post:
 *     tags:
 *       - GeoData
 *     summary: Upload GeoJSON data
 *     description: Upload GeoJSON data
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/payloads/GeoUploadPayload'
 *     responses:
 *       200:
 *         $ref: '#/components/responses/GeoUploadResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequestResponse'
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
  try {
    if (req.method !== "POST") {
      // Only POST method is accepted
      res.setHeader("Allow", ["POST"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
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
      return res
        .status(401)
        .json({ message: "Unauthorized - Invalid Token" });
    }

    const { email, geojson } = geojsonSchema.parse(req.body);
    const errors = hint(geojson);
    if (errors.length > 0) {
      let errorMessage = '';
      for (const error of errors) {
        errorMessage += error.message + '; ';
      }
      return res
        .status(400)
        .json({ message: errorMessage });
    }

    if (email !== user.email && user.role !== "admin") {
      return res.status(401).json({
        message: "Unauthorized - Only admin can change other user geo data.",
      });
    }

    const uploadedUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!uploadedUser) {
      return res.status(400).json({
        message: "Bad Request - User email not found.",
      });
    }

    const today = new Date();
    const updatedUser = await prisma.user.update({
      where: {
        id: uploadedUser.id,
      },
      data: {
        geojson,
        updatedAt: today,
      },
    });

    res.status(200).json({
      message: "GeoJSON processed successfully",
      data: updatedUser,
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
