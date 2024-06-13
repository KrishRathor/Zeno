import { IDeveloperOnBoarding, IDeveloperOnBoardingResponse, IDeveloperVerify, IDeveloperVerifyResponse } from "../../types/developer.types";
import HttpStatusCode from "../../types/enums";
import { prisma } from "../db";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

export const SECRET = 'SECRET';

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10; // You can adjust the number of salt rounds as needed
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

export async function checkPassword(password: string, hashedPassword: string): Promise<boolean> {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
}

function createToken(payload: object): string {
  const token = jwt.sign(payload, SECRET,);
  return token;
}

export function verifyToken(token: string): object | string {
  try {
    const decoded = jwt.verify(token, SECRET);
    return decoded;
  } catch (err) {
    throw new Error('Invalid token');
  }
}

export class Developer {

  async onBoardDeveloper(onBoardDeveloperProps: IDeveloperOnBoarding): Promise<IDeveloperOnBoardingResponse> {
    try {

      const { username, email, password } = onBoardDeveloperProps;

      const developerAlreadyExists = await prisma.developer.findFirst({
        where: {
          username
        }
      })

      if (developerAlreadyExists) {
        return {
          code: HttpStatusCode.BAD_REQUEST,
          message: "Developer alread exists",
          developer: null
        }
      }

      const hashedPassword = await hashPassword(password);

      const appId = createToken({
        username,
        email
      })

      const createDeveloper = await prisma.developer.create({
        data: {
          email,
          username,
          password: hashedPassword,
          appId
        }
      })

      return {
        code: HttpStatusCode.OK,
        message: "Created New Developer",
        developer: createDeveloper
      }

    } catch (error) {
      console.log(error);
      return {
        code: HttpStatusCode.INTERNAL_SERVER_ERROR,
        message: "INTERNAL_SERVER_ERROR",
        developer: null
      }
    } finally {
      await prisma.$disconnect();
    }
  }

  private async verifyDeveloper(DeveloperVerifyProps: IDeveloperVerify): Promise<IDeveloperVerifyResponse> {
    try {

      const { appId } = DeveloperVerifyProps;

      const verifyDeveloper = await prisma.developer.findFirst({
        where: {
          appId
        }
      })

      if (!verifyDeveloper) {
        return {
          code: HttpStatusCode.NOT_FOUND,
          message: "No developer with corresponding appId",
          isVerified: false
        }
      }

      return {
        code: HttpStatusCode.OK,
        message: "Developer Verified",
        isVerified: true
      }

    } catch (error) {
      console.log(error);
      return {
        code: HttpStatusCode.INTERNAL_SERVER_ERROR,
        message: "INTERNAL_SERVER_ERROR",
        isVerified: null
      }
    } finally {
      await prisma.$disconnect();
    }
  }

}
