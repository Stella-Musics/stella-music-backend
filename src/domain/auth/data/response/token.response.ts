import { ApiProperty } from "@nestjs/swagger";

export class TokenResponse {
  constructor(accessToken: string, refreshToken: string, accessExpiresIn: Date) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.accessExpiresIn = accessExpiresIn;
  }

  @ApiProperty({ description: "엑세스 토큰" })
  readonly accessToken: string;
  @ApiProperty({ description: "리프레시 토큰" })
  readonly refreshToken: string;
  @ApiProperty({ description: "엑세스 토큰 만료 기간" })
  readonly accessExpiresIn: Date;
}
