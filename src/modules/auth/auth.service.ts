import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { PasswordDto } from './dto/password.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private jwtService: JwtService
    ) {}

    async login(loginObject: LoginDto): Promise<{ token: string}> {
        const user = await this.userRepository.findOne({where: { email: loginObject.email }});
        if (!user) {
            throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
        }
        const isMatch = await bcrypt.compare(loginObject.password, user.password);
        if (!isMatch) {
            throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
        }
        const token = await this.jwtService.signAsync({ id: user.id, email: user.email , username: user.username});
        return { token: token};
    }

    async verifyPassword(user: User, passwordDto: PasswordDto): Promise<boolean> {
        const userExist = await this.userRepository.findOne({where: { id: user.id }});
        if (!userExist) {
            throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
        }
        const isMatch = await bcrypt.compare(passwordDto.password, userExist.password);
               
        return isMatch;
    }

    async register(registerObject: RegisterDto): Promise<User> {
        const email = await this.userRepository.findOneBy({ email: registerObject.email } );
        if (email) {
            throw new HttpException('User already exists', HttpStatus.CONFLICT);
        }

        registerObject.password = await bcrypt.hash(registerObject.password, 10);

        const userRegistered = await this.userRepository.save(registerObject);
        return userRegistered;
    }
}
