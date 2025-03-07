import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { userEmailDto } from "../../shared/dto";
import { PasswordService } from "src/api/auth/pwd.service";

@Injectable()
export class UserService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly pwd: PasswordService,
    ) {}

    async VerifyUser(dto: userEmailDto) {
        const roleRes = await this.prisma.CheckUserRole(
            dto.email,
            "unverified",
        );

        if (!roleRes) {
            throw new HttpException(
                "User Already Verified",
                HttpStatus.CONFLICT,
            );
        }
        const verifyRes = await this.prisma.VerifyUser(dto.email);

        if (!verifyRes) {
            throw new HttpException(
                "Something Went Wrong",
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
        return { message: "User Verified Successfully", data: verifyRes };
    }

    async CreateUser(dto: userEmailDto) {
        const USER = await this.prisma.user.findUnique({
            where: { email: dto.email },
            select: { email: true },
        });

        if (USER) {
            throw new HttpException(`User already exists`, HttpStatus.CONFLICT);
        }

        const PWD = await this.pwd.generateRandomPassword();
        const createUserRes = await this.prisma.CreateUser({
            email: dto.email,
            password: PWD,
            name: dto.email.split("@")[0] || "No Name",
        });

        if (!createUserRes) {
            throw new HttpException(
                "Something Went Wrong",
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }

        return {
            message: "User Verified Successfully",
            data: createUserRes,
            pwd: PWD,
        };
    }
}
