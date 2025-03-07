import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    private logger = new Logger("HTTP");

    use(request: Request, response: Response, next: NextFunction): void {
        const { hostname, method, originalUrl, body } = request;
        const userAgent = request.get("user-agent") || "";

        response.on("finish", () => {
            const { statusCode } = response;

            let logMsg = `${method} ${originalUrl} ${statusCode} - ${userAgent} - ${hostname} `;
            if (method !== "GET") {
                logMsg += `- ${JSON.stringify(body)} `;
            }
            this.logger.debug(logMsg);
        });

        next();
    }
}
