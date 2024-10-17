import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-google-oauth20";
import { SocialType } from "src/domain/user/enums/social.type";
import { SocialUserDto } from "../service/dto/social.dto";
import { AuthService } from "../service/auth.service";
import { JwtGenerator } from "src/global/jwt/jwt.generator";
import { Profile } from "passport-google-oauth20";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly jwtGenerator: JwtGenerator
  ) {
    const clientID = configService.get<string>("GOOGLE_CLIENT_ID");
    const clientSecret = configService.get<string>("GOOGLE_CLIENT_SECRET");
    const callbackURL = configService.get<string>("GOOGLE_CLIENT_REDIRECT_URL");

    if (!clientID || !clientSecret || !callbackURL) {
      throw new Error("Google OAuth 설정이 누락되었습니다.");
    }

    super({
      clientID,
      clientSecret,
      callbackURL,
      passReqToCallback: true,
      scope: ["profile", "email"] // 가져올 정보들
    });
  }

  authorizationParams(): { [key: string]: string } {
    return {
      access_type: "offline",
      prompt: "select_account"
    };
  }

  async validate(
    request: Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: any, user?: any) => void
  ) {
    try {
      const socialUserDto = this.createSocialUserDto(profile);
      const user = await this.authService.validateSocialUser(socialUserDto);
      const tokenResponse = await this.jwtGenerator.generateToken(user);
      done(null, tokenResponse);
    } catch (error) {
      done(error, false);
    }
  }

  private createSocialUserDto(profile: Profile): SocialUserDto {
    const { id, name, emails } = profile;

    if (!id || !name || !emails || emails.length === 0) {
      throw new HttpException("유효하지 않은 프로필 정보입니다.", HttpStatus.BAD_REQUEST);
    }

    const fullName = this.checkName(name.familyName, name.givenName);
    const email = emails[0].value;

    return new SocialUserDto({
      socialId: id,
      email: email,
      name: fullName,
      socialType: SocialType.GOOGLE
    });
  }

  private checkName(familyName: string = "", givenName: string = ""): string {
    return familyName + givenName;
  }
}
