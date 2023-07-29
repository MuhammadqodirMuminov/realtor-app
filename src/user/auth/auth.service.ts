import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { UserType } from '@prisma/client';
import * as bcript from "bcryptjs";
import * as JWT from "jsonwebtoken";
import { PrismaService } from 'src/prisma/prisma.service';
import { IGenerateKey, ISignInBody, ISignUpBody } from './auth,interface';

@Injectable()
export class AuthService {

	constructor(private readonly prismaService: PrismaService) { }

	async signUp({ email, password, name, phone }: ISignUpBody, userType: UserType) {
		const existEmail = await this.prismaService.user.findUnique({ where: { email } })
		if (existEmail) throw new ConflictException("User already signed up")

		const hashedPassword = await bcript.hash(password, 10)
		const user = await this.prismaService.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
				phone,
				userType : userType
			}
		})
		return this.generateJwt(email, user.id)
	}

	async signIn({ email, password }: ISignInBody) {
		const existUser = await this.prismaService.user.findUnique({ where: { email } })
		if (!existUser) throw new BadRequestException("User not found")

		const checkPassword = await bcript.compare(password, existUser.password)
		if (!checkPassword) throw new BadRequestException("Password does not match");

		return this.generateJwt(email, existUser.id)
	}

	async generateKey({ email, userType }: IGenerateKey) {
		const string = `${email}-${userType}-asdfghjkl-asdfghjk-12`
		return await bcript.hash(string, 10)
	}

	private generateJwt(email: string, id: number) {
		return JWT.sign({ userId: id, email }, "asdfghjkl-asdfghjk-12", { expiresIn: 360000 })
	}
}
