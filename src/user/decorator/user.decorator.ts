import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export interface IUserType {
	userId: number,
	email: string,
	iat: number,
	exp: number
}

export const User = createParamDecorator((data, context: ExecutionContext) => {
	const request = context.switchToHttp().getRequest()
	return request.user
})