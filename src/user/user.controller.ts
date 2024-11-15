import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpException,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.register(createUserDto);
      return {
        status: HttpStatus.CREATED,
        message: 'User registered successfully',
        data: user,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'An unexpected error occurred',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    try {
      const user = await this.userService.login(loginUserDto);
      return {
        status: HttpStatus.OK,
        message: 'Login successful',
        data: user.data,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'An unexpected error occurred',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('token');
    return res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      message: 'Logout successful',
    });
  }
}
