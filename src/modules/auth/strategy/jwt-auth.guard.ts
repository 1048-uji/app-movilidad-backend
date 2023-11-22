import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard(['strategy_jwt_1', 'strategy_jwt_2', 'admin']) {
    canActivate(context: ExecutionContext) {
        // Add your custom authentication logic here
        // for example, call super.logIn(request) to establish a session.
        return super.canActivate(context);
    }
    handleRequest(err, user, info) {
        if (err || !user) {
            throw err || new UnauthorizedException();
        }
        return user;
    }
}