import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import axios from "axios";
import * as jwkToPem from "jwk-to-pem";
import * as jwt from "jsonwebtoken";

@Injectable()
export class TokenValidator {
  async verifyAppleIdentityToken(identityToken: string) {
    const decodedToken = jwt.decode(identityToken, { complete: true });

    if (!decodedToken || !decodedToken.header || !decodedToken.header.kid) {
      throw new Error("Invalid identity token");
    }

    // Apple의 공개 키로 검증
    const applePublicKey = await this.getApplePublicKey(decodedToken.header.kid || ""); // Apple의 공개 키를 가져오는 함수
    const verifiedToken = jwt.verify(identityToken, applePublicKey, {
      algorithms: ["RS256"]
    });

    return verifiedToken as jwt.JwtPayload;
  }

  private async getApplePublicKey(kid: string): Promise<string> {
    let keys;
    try {
      // Apple의 공개 키 목록을 가져옴
      const response = await axios.get("https://appleid.apple.com/auth/keys");
      keys = response.data.keys;
    } catch (error) {
      throw new HttpException(
        "애플 퍼블릭 키를 가져오는 중 에러",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    // 해당 kid에 맞는 공개 키 찾기
    const key = keys.find((key) => key.kid === kid);

    if (!key) {
      throw new HttpException("퍼블릭 키를 찾을 수 없음", HttpStatus.NOT_FOUND);
    }

    // JWK를 PEM 형식으로 변환
    const pem = jwkToPem(key);
    return pem;
  }
}
