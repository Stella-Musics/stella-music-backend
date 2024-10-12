import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-google-oauth20";
import { SocialType } from "src/domain/user/enums/social.type";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(private readonly configService: ConfigService) {
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
    const { name, emails } = profile;

    const fullName = this.checkName(name.familyName, name.givenName);
    console.log(fullName);

    const email = emails[0].value;
    console.log(email);

    const socialType = SocialType.GOOGLE;
    console.log(socialType);
    try {
      const jwt = "";
      const user = {
        jwt
      };
      done(null, user);
    } catch (err) {
      console.error(err);
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
