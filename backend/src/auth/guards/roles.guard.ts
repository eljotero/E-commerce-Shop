import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserRoles } from "../enums/user-roles";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {

        const requiredRoles = this.reflector.getAllAndOverride<UserRoles[]>('roles', [context.getHandler(), context.getClass()]);

        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }

        console.log(context.switchToHttp().getRequest());
        const { session } = context.switchToHttp().getRequest();

        return requiredRoles.some((role) => session.user.roles.includes(role));
    }

}