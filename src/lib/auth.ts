import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const ADMIN_PASSWORD_HASH = '$2a$12$LQv3c1yqBWVHxkd0LQ4YCuWmkjvXKQTYN1QSGzKQG1JQDZzHbhzCG'; // "admin123"
const JWT_SECRET = process.env.JWT_SECRET || 'sorteio-monalu-secret-key';

export const authService = {
  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, ADMIN_PASSWORD_HASH);
  },

  generateToken(): string {
    return jwt.sign(
      { admin: true, timestamp: Date.now() },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
  },

  verifyToken(token: string): boolean {
    try {
      jwt.verify(token, JWT_SECRET);
      return true;
    } catch {
      return false;
    }
  }
};
