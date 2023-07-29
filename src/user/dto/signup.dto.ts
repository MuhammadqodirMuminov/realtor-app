import { UserType } from "@prisma/client";
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from "class-validator";

export class SignUpDto {
	@IsString()
	@IsOptional()
	id: string;

	@IsString()
	@IsNotEmpty()
	name: string;

	@Matches(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/, { message: "Phone number must be match with pattern" })
	phone: string;

	@IsEmail()
	email: string;

	@IsString()
	@MinLength(5)
	password: string;

	@IsString()
	@IsNotEmpty()
	@IsOptional()
	productKey: string;
}

export class SignInDto {
	@IsEmail()
	email: string;

	@IsString()
	@MinLength(5)
	password: string;
}

export class GenerateKeyDto {
	@IsEmail()
	email: string;

	@IsString()
	@IsNotEmpty()
	userType: UserType
}