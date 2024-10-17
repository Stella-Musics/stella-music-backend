import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/domain/user/entity/user.entity";

@Injectable()
export class JwtGenerator {
  constructor(
    readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}
  private createToken(
    payload: any,
    secretKey: string | undefined,
    expiresIn: string | undefined
  ): string {
    if (!payload || !secretKey || !expiresIn)
      throw new HttpException("서버 값 에러 입니다.", HttpStatus.INTERNAL_SERVER_ERROR);

    return this.jwtService.sign(payload, {
      secret: secretKey,
      expiresIn
    });
  }

  async generateToken(user: User): Promise<{
    accessToken: string;
    refreshToken: string;
    accessExpiresIn: Date;
  }> {
    const payload = { id: user.id, sub: user.socialId };
    const accessExpiresIn = this.configService.get<string>("JWT_ACCESS_TIME");
    const accessExpiresInToInt = parseInt(accessExpiresIn || "0");
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>("JWT_ACCESS_SECRET"),
      expiresIn: accessExpiresIn
    });
    const refreshToken = this.createToken(
      payload,
      this.configService.get<string>("JWT_REFRESH_SECRET"),
      this.configService.get<string>("JWT_REFRESH_TIME")
    );

    const currentDate = new Date();
    return {
      accessToken,
      refreshToken,
      accessExpiresIn: new Date(currentDate.getTime() + accessExpiresInToInt)
    };
  }
}
