import { ForbiddenException, Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto, LoginDto } from './dto/auth.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private mailService: MailService,
  ) {}
  // signup
  async register(dto: AuthDto) {
    try {
      // create dummy token for email verification
      const token = Math.floor(1000 + Math.random() * 9000).toString();
      // generate password hash
      const password = await argon.hash(dto.password);
      // try to save user
      // const user = await this.prisma.aipuser.create({
      //   data: {
      //     name: dto.name,
      //     email: dto.email,
      //     password: password,
      //     createdAt: new Date(),
      //     updatedAt: new Date(),
      //   },
      // });
      //  dont send user password in response
      // delete user.password;
      // return the user data
      // return this.signToken(user.id, user.email);
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          // field duplicated error
          throw new ForbiddenException('Email already exists');
        }
      }
    }
  }
  async login(dto: LoginDto) {
    console.log(dto);
    // find user if it not exists  thorw forbidden exception
    const user = await this.prisma.aipuser.findUnique({
      where: { email: dto.email },
    });
    if (!user) {
      throw new ForbiddenException('User does not exist');
    }
    // if password does not matched throw forbidden exception
    const passwordMatch = await argon.verify(user.password, dto.password);
    if (!passwordMatch) {
      throw new ForbiddenException('User password does not matched');
    }
    // remvoe password in response for client
    delete user.password;
    return this.signToken(user.id, user.email);
  }
  async forgotPassword(params: Object) {
    console.log(params);
    return { message: 'sent mail to your mail id' };
  }
  // make sign token method to generate token as jwt
  async signToken(
    userId: string,
    email: string,
  ): Promise<{ access_token: any }> {
    const dataPayload = {
      sub: userId,
      email,
    };
    const generateToken = await this.jwt.signAsync(dataPayload, {
      expiresIn: '15d',
      secret: 'super-secret',
    });
    console.log(generateToken, 'generateToken');
    return { access_token: generateToken };
  }

  // make function to logout and clean the cookies
  async logout(request) {
    // remove it from cookes
    console.log(
      request.res,
      request.res?.clearCookie('Authorization'),
      'request.res',
    );
    request.res?.clearCookie('Authorization');
    return { message: 'logout successfully' };
  }

  // make function to get current user
  async profile(request) {
    delete request.password;
    return request;
  }
  async verifyEmail(token: string) {
    console.log(token);
    return { message: 'email verified successfully' };
  }
  async resetPassword(email: string, password: string) {
    const user = await this.prisma.aipuser.findUnique({
      where: { email: email },
    });
    if (!user) {
      throw new ForbiddenException('User does not exist');
    } else {
      const newPpassword = await argon.hash(password);
      const updateUser = this.prisma.aipuser.update({
        where: { email: email },
        data: {
          password: newPpassword,
        },
      });
      return { message: 'password changed successfully' };
    }
  }
}
