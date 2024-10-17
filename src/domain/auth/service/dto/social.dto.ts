import { Role } from "src/domain/user/enums/role.type";
import { SocialType } from "src/domain/user/enums/social.type";

export class SocialUserDto {
  constructor(socialProfile: {
    socialId: string;
    name: string;
    socialType: SocialType;
    email: string;
  }) {
    this.socialId = socialProfile.socialId;
    this.email = socialProfile.email;
    this.name = socialProfile.name;
    this.socialType = socialProfile.socialType;
  }
  readonly socialId: string;
  readonly email: string;
  readonly name: string;
  readonly socialType: SocialType;

  toUser(): { email: string; socialId: string; name: string; socialType: SocialType; role: Role } {
    const socialId = this.socialId;
    const name = this.name;
    const socialType = this.socialType;
    const email = this.email;
    return {
      email,
      socialId,
      name,
      socialType,
      role: Role.USER
    };
  }
}
