import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import * as JWT from "jsonwebtoken";
import { Observable } from "rxjs";

export class UserInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, handler: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
		const request = context.switchToHttp().getRequest()
		const token = request?.headers?.authorization?.split('Bearer ')[1]

		const user = JWT.decode(token)

		request.user = user
		return handler.handle()
	}
	
}