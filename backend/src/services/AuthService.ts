import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { DataSource, Repository } from "typeorm";
import { User } from "../entity/User";
import { HttpException } from "../utils/HttpException";
import { Token, TokenType } from "../entity/Token";
import { sendEmail } from "./EmailService";

dotenv.config();

export class AuthService {
  constructor(private dataSource: DataSource) {}

  async register(
    username: string,
    email: string,
    password: string,
    description: string
  ): Promise<User> {
    const userRepository = this.dataSource.getRepository(User);
    const existingUser = await userRepository.findOne({ where: { email } });

    if (existingUser) {
      if (!existingUser.emailVerified) {
        await this.sendVerificationEmail(existingUser);
        throw new HttpException(
          409,
          "User already exists, verification email resent"
        );
      } else {
        throw new HttpException(409, "User already exists");
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = userRepository.create({
      username,
      email,
      password: hashedPassword,
      description,
    });
    const savedUser = await userRepository.save(user);

    await this.sendVerificationEmail(savedUser);

    return savedUser;
  }

  async login(email: string, password: string): Promise<string> {
    const userRepository = this.dataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      throw new HttpException(404, "User not found");
    }

    if (!user.emailVerified) {
      throw new HttpException(401, "Email not verified");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new HttpException(401, "Invalid password");
    }

    const token = jwt.sign(
      { id: user.id },
      ("" + process.env.JWT_SECRET) as string
    );
    return token;
  }

  async getUserById(id: string): Promise<User | undefined> {
    const userRepository: Repository<User> =
      this.dataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id } });
    return user ?? undefined;
  }

  async createToken(user: User, type: TokenType): Promise<Token> {
    const tokenRepository = this.dataSource.getRepository(Token);
    const token = crypto.randomBytes(32).toString("hex");

    const expiration = new Date();
    if (type === TokenType.Verification) {
      expiration.setHours(expiration.getHours() + 24);
    } else if (type === TokenType.ResetPassword) {
      expiration.setHours(expiration.getHours() + 1);
    }

    const tokenEntity = tokenRepository.create({
      user,
      token,
      type,
      expiration,
    });

    return tokenRepository.save(tokenEntity);
  }

  async sendVerificationEmail(user: User): Promise<void> {
    const token = await this.createToken(user, TokenType.Verification);
    const verificationUrl = `${process.env.API_URL}/api/auth/verify?token=${token.token}`;

    await sendEmail(
      user,
      "Email Verification - AILift",
      `Please click the following link to verify your email: ${verificationUrl}`
    );
  }

  async verifyEmail(tokenString: string): Promise<boolean> {
    const tokenRepository = this.dataSource.getRepository(Token);
    const token = await tokenRepository.findOne({
      where: { token: tokenString, type: TokenType.Verification },
      relations: ["user"],
    });

    if (!token) {
      return false;
    }

    const now = new Date();
    if (token.expiration < now) {
      await tokenRepository.remove(token);
      return false;
    }

    const userRepository = this.dataSource.getRepository(User);
    const user = token.user;
    user.emailVerified = true;
    await userRepository.save(user);
    await tokenRepository.remove(token);

    return true;
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    const userRepository = this.dataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
      throw new HttpException(404, "User not found");
    }

    const token = await this.createToken(user, TokenType.ResetPassword);
    const resetPasswordUrl = `${process.env.FRONT_URL}/new-password/${token.token}`;

    await sendEmail(
      user,
      "Reset Password - AILift",
      `Please click the following link to reset your password: ${resetPasswordUrl}`
    );
  }

  async updatePassword(
    tokenString: string,
    newPassword: string
  ): Promise<void> {
    const tokenRepository = this.dataSource.getRepository(Token);
    const token = await tokenRepository.findOne({
      where: { token: tokenString, type: TokenType.ResetPassword },
      relations: ["user"],
    });

    if (!token) {
      throw new HttpException(400, "Invalid or expired token");
    }

    const now = new Date();
    if (token.expiration < now) {
      await tokenRepository.remove(token);
      throw new HttpException(400, "Invalid or expired token");
    }

    const userRepository = this.dataSource.getRepository(User);
    const user = token.user;
    user.password = await bcrypt.hash(newPassword, 10);
    await userRepository.save(user);
    await tokenRepository.remove(token);
  }
}
