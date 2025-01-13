import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from './schemas/user.schema';
import * as debugLib from 'debug';

const debug = debugLib('app:UserService');

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private jwtService: JwtService,
        
    ) {
        debug('UserService initialized');
    }

    async signup(username: string, email: string, password: string): Promise<User> {
        debug('Attempting signup with email: %s, username: %s', email, username);

        const existingUser = await this.userModel.findOne({ email });
        if (existingUser) {
            debug('Signup failed: Email %s is already in use', email);
            throw new BadRequestException('Email is already in use');
        }

        const existingUsername = await this.userModel.findOne({ username });
        if (existingUsername) {
            debug('Signup failed: Username %s is already in use', username);
            throw new BadRequestException('Username is already in use');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new this.userModel({ username, email, password: hashedPassword });
        await newUser.save();

        debug('Signup successful for user: %s', username);
        return { ...newUser.toObject(), password: undefined };
    }

    async login(email: string, password: string): Promise<{ accessToken: string }> {
        debug('Attempting login with email: %s', email);

        const user = await this.userModel.findOne({ email });
        if (!user) {
            debug('Login failed: No user found with email %s', email);
            throw new UnauthorizedException('Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            debug('Login failed: Incorrect password for email %s', email);
            throw new UnauthorizedException('Invalid email or password');
        }

        const payload = { username: user.username, sub: user._id };
        const accessToken = this.jwtService.sign(payload);

        debug('Login successful for email: %s', email);
        return { accessToken };
    }
}
