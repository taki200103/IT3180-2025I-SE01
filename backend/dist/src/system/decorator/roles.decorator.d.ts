export declare enum Role {
    ADMIN = "ADMIN",
    RESIDENT = "RESIDENT",
    MANAGER = "MANAGER"
}
export declare const ROLES_KEY = "roles";
export declare const Roles: (...roles: Role[]) => import("@nestjs/common").CustomDecorator<string>;
