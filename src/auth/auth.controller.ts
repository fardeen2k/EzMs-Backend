import {
    Body,
    Controller,
    HttpCode,
    HttpException,
    HttpStatus,
    Post,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
import { PublicRoute } from "./auth/auth.decorator";

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post("signup")
    signup(@Body() dto: AuthDto) {
        try {
            return this.authService.signup(dto);
        } catch (error) {
            throw new HttpException(
                "INTERNAL SERVER ERROR",
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Post("signin")
    @HttpCode(HttpStatus.OK)
    signin(@Body() dto: AuthDto) {
        try {
            return this.authService.signin(dto);
        } catch (Error) {
            throw new HttpException(
                "INTERNAL SERVER ERROR",
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
