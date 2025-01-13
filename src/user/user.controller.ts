import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import debug from 'debug';

const dbug = debug('app:user:controller'); // Configure the debug namespace

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {
    dbug('UserController initialized');
  }

  @Post('signup')
  async signup(
    @Body('username') username: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    dbug('Signup request received', { username, email });
    try {
      const result = await this.userService.signup(username, email, password);
      dbug('Signup successful', { username, email });
      return result;
    } catch (error) {
      dbug('Signup failed', { error: error.message });
      throw error;
    }
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    dbug('Login request received', { email });
    try {
      const result = await this.userService.login(email, password);
      dbug('Login successful', { email });
      return result;
    } catch (error) {
      dbug('Login failed', { error: error.message });
      throw error;
    }
  }
}
