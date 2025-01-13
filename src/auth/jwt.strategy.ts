import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as debugLib from 'debug';

// const debug = debugLib('app:JwtStrategy');
const debug = debugLib('app2:JwtStrategy');

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    debug('Initializing JwtStrategy');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
    if (!process.env.JWT_SECRET) {
      debug('Warning: JWT_SECRET is not set in the environment variables');
    } else {
      debug('JWT_SECRET is set');
    }
  }

  async validate(payload: any) {
    debug('Validating JWT payload: %O', payload);
    const user = { userId: payload.sub, username: payload.username };
    debug('JWT validated successfully for userId: %s, username: %s', user.userId, user.username);
    return user;
  }
}
