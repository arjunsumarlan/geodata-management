import jwt, { Secret, JwtPayload } from 'jsonwebtoken';

export const authenticate = (req: { headers: { authorization: string; }; }): UserPayload | null => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const secret = process.env.JWT_SECRET as Secret;

    if (!token || !secret) {
      throw new Error('Token or secret is not provided.');
    }

    const decoded = jwt.verify(token, secret) as UserPayload;
    return decoded;
  } catch (error) {
    console.error(error);
    return null;
  }
};
