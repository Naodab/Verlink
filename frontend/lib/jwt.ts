import jwt from "jsonwebtoken"

// In a real application, you would store this in an environment variable
const JWT_SECRET = "your-secret-key"

export interface JwtPayload {
  userId: string
  email: string
  name: string
}

export function signJwt(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyJwt(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload
  } catch (error) {
    return null
  }
}
