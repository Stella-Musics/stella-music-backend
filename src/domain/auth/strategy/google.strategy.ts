import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-google-oauth20";
import { SocialType } from "src/domain/user/enums/social.type";
import { SocialUserDto } from "../service/dto/social.dto";
import { AuthService } from "../service/auth.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(
    configService: ConfigService,
    private readonly authService: AuthService
  ) {
    super({
      clientID: configService.get<string>("GOOGLE_CLIENT_ID"),
      clientSecret: configService.get<string>("GOOGLE_CLIENT_PASSWORD"),
      callbackURL: configService.get<string>("GOOGLE_CLIENT_REDIRECT_URL"),
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

  async validate(request: any, accessToken: string, refreshToken: string, profile, done: any) {
    const { name, id, emails } = profile;

    const fullName = this.checkName(name.familyName, name.givenName);

    const email = emails[0].value;

    const socialType = SocialType.GOOGLE;

    const socialUserDto = new SocialUserDto({
      socialId: id,
      email: email,
      name: fullName,
      socialType: socialType
    });

    this.authService.validateSocialUser(socialUserDto);

    try {
      const jwt = "";
      const user = {
        jwt
      };
      done(null, user);
    } catch (err) {
      done(err, false);
    }
  }

  private checkName(familyName: string, givenName: string): string {
    if (familyName === undefined) {
      familyName = "";
    }
    if (givenName === undefined) {
      givenName = "";
    }

    return familyName + givenName;
  }
}
