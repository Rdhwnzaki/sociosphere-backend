import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(CreateUserDto: CreateUserDto): Promise<User> {
    try {
      const { username, password, email, bio, image } = CreateUserDto;

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = this.userRepository.create({
        username,
        password: hashedPassword,
        email,
        bio,
        image,
      });

      return this.userRepository.save(newUser);
    } catch (error) {
      if (error.code === '23505') {
        throw new HttpException(
          'Email or username already exists',
          HttpStatus.CONFLICT,
        );
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.UNAUTHORIZED,
      );
    }

    user.password = undefined;

    const payload = { id: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    return {
      status: HttpStatus.OK,
      message: 'Login successful',
      data: { ...user, token },
    };
  }
}
