import { Injectable } from "@nestjs/common";
import axios from "axios";
import * as jwkToPem from "jwk-to-pem";
import * as jwt from "jsonwebtoken";

@Injectable()
export class TokenValidator {
  async verifyAppleIdentityToken(identityToken: string) {
    const decodedToken = jwt.decode(identityToken, { complete: true });

    if (!decodedToken) {
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
    // Apple의 공개 키 목록을 가져옴
    const response = await axios.get("https://appleid.apple.com/auth/keys");
    const keys = response.data.keys;

    // 해당 kid에 맞는 공개 키 찾기
    const key = keys.find((key) => key.kid === kid);

    if (!key) {
      throw new Error("Public key not found");
    }

    // JWK를 PEM 형식으로 변환
    const pem = jwkToPem(key);
    return pem;
  }
}