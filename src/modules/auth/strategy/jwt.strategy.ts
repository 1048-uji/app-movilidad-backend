import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants, jwtConstantsEmail } from './jwt.constant';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'strategy_jwt_1') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret
        });
    }
    async validate(payload: any) {
        return { id: payload.id, email: payload.email };
    }
}

@Injectable()
export class JwtStrategy1 extends PassportStrategy(Strategy, 'strategy_jwt_2') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstantsEmail.secret
        });
    }
    async validate(payload: any) {
        return { id: payload.id, email: payload.email, emailType: payload.emailType };
    }
}