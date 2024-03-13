import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from 'src/dtos/user.dto';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/user.entity';
import { LoginDto } from 'src/dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(@InjectRepository(User)
    private usersRepository: Repository<User>,
        private jwtService: JwtService,
        private configService: ConfigService
    ) { }

    async SignUp(user: UserDto) {
        const { email, password } = user;
        const userExists = await this.usersRepository.findOne({ where: { email: email } });
        if (userExists) {
            throw new ConflictException('User already exists');
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = this.usersRepository.create({ ...user, password: passwordHash });
        await this.usersRepository.save(newUser);
        return newUser;
    }

    async SignIn(user: LoginDto) {
        const { email, password } = user;
        const userExists = await this.usersRepository.findOne({ where: { email: email } });
        if (!userExists) {
            throw new ConflictException('User does not exist');
        }
        const passwordMatch = await bcrypt.compare(password, userExists.password);
        if (!passwordMatch) {
            throw new ConflictException('Invalid password');
        }
        const payload = { sub: user, firstName: user.email };
        const token = this.jwtService.sign(payload, { expiresIn: "2h", secret: this.configService.get('JWT_SECRET') });
        return { token, user: userExists };
    }
}