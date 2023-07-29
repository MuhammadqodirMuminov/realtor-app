import { Body, Controller, Get, Param, ParseEnumPipe, Post, UnauthorizedException } from '@nestjs/common';
import { UserType } from '@prisma/client';
import * as bcript from "bcryptjs";
import { IUserType, User } from '../decorator/user.decorator';
import { GenerateKeyDto, SignInDto, SignUpDto } from '../dto/signup.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

	constructor(private readonly authService: AuthService) { }

	@Post('/signup/:userType')
	async signUp(@Body() body: SignUpDto, @Param('userType', new ParseEnumPipe(UserType)) userType: UserType) {
		if (userType !== UserType.BUYER) {
			if (!body.productKey) throw new UnauthorizedException()
			const validateKey = `${body.email}-${userType}-asdfghjkl-asdfghjk-12`
			const isValidProductKey = await bcript.compare(validateKey, body.productKey)
			if (!isValidProductKey) throw new UnauthorizedException()
		}
		return await this.authService.signUp(body, userType)
	}

	@Post('/signin')
	async signIn(@Body() body: SignInDto) {
		return await this.authService.signIn(body)
	}

	@Post('/key')
	async generateKey(@Body() body: GenerateKeyDto) {
		return await this.authService.generateKey(body)
	}

	@Get('/me')
	async me(@User() user: IUserType) {
		return user
	}
}
