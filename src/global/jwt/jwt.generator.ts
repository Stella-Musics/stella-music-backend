import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/domain/user/entity/user.entity";

@Injectable()
export class JwtGenerator {
  constructor(
    readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async generateToken(user: User): Promise<{
    accessToken: string;
    refreshToken: string;
    accessExpiresIn: Date;
  }> {
    const payload = { id: user.id, sub: user.socialId };
    const accessExpiresIn = this.configService.get<string>("JWT_ACCESS_TIME");
    const accessExpiresInToInt = parseInt(accessExpiresIn === undefined ? "0" : accessExpiresIn);
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>("JWT_ACCESS_SECRET"),
      expiresIn: accessExpiresIn
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
      expiresIn: this.configService.get<string>("JWT_REFRESH_TIME")
    });

    const currentDate = new Date();
    return {
      accessToken,
      refreshToken,
      accessExpiresIn: new Date(currentDate.getTime() + accessExpiresInToInt)
    };
  }
}
