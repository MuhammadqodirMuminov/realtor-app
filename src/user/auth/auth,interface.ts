import { UserType } from "@prisma/client";

export interface ISignUpBody {
	name: string;
	email: string;
	password: string;
	phone: string;
}

export interface ISignInBody {
	email: string;
	password: string;
}

export interface IGenerateKey {
	email: string;
	userType: UserType;
}