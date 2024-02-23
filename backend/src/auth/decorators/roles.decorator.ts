import { SetMetadata } from "@nestjs/common";
import { UserRoles } from "../enums/user-roles";

export const Roles = (...roles: UserRoles[]) => SetMetadata('roles', roles);