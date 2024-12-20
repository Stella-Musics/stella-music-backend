import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/domain/user/entity/user.entity";
import { Repository } from "typeorm";
import { SocialUserDto } from "./dto/social.dto";
import { SocialType } from "src/domain/user/enums/social.type";
import axios from "axios";
import { JwtGenerator } from "src/global/jwt/jwt.generator";
import { TokenResponse } from "../data/response/token.response";
import { TokenValidator } from "../util/token.validator";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtGenerator: JwtGenerator,
    private readonly tokenValidator: TokenValidator
  ) {}

  async validateSocialUser(socialUserDto: SocialUserDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ email: socialUserDto.email });

    if (user === null) {
      const generatedUser = socialUserDto.toUser();
      return await this.userRepository.save(generatedUser);
    } else if (socialUserDto.socialType !== user.socialType) {
      throw new HttpException("이미 다른 소셜 계정으로 가입된 유저입니다.", HttpStatus.CONFLICT);
    }

    socialUserDto.name = socialUserDto.name ?? user.name;
    const updatedData = socialUserDto.toUser();
    const updatedUser = await this.userRepository.create({
      ...user,
      email: updatedData.email,
      name: updatedData.name,
      socialId: updatedData.socialId,
      socialType: updatedData.socialType,
      role: updatedData.role
    });
    return await this.userRepository.save(updatedUser);
  }

  async signIn(
    socialType: SocialType,
    accessToken: string | null,
    userName: string | null = null
  ): Promise<TokenResponse> {
    if (!accessToken) throw new HttpException("올바르지 않은 요청입니다.", HttpStatus.BAD_REQUEST);

    let user: User;
    if (socialType === SocialType.GOOGLE) {
      user = await this.signInWithGoogle(accessToken);
    } else if (socialType === SocialType.APPLE) {
      user = await this.signInWithApple(accessToken, userName);
    } else {
      throw new HttpException("지원되지 않는 소셜 로그인입니다.", HttpStatus.BAD_REQUEST);
    }

    const token = await this.jwtGenerator.generateToken(user);
    const tokenResponse = new TokenResponse(
      token.accessToken,
      token.refreshToken,
      token.accessExpiresIn
    );
    return tokenResponse;
  }

  private async signInWithGoogle(accessToken: string): Promise<User> {
    let response;
    try {
      response = await axios.get("https://www.googleapis.com/userinfo/v2/me", {
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      throw new HttpException("구글 로그인 중 오류가 발생했습니다.", HttpStatus.UNAUTHORIZED);
    }

    const { name, id, email } = response.data;

    if (!id || !name || !email)
      throw new HttpException("유효하지 않은 프로필 정보입니다.", HttpStatus.BAD_REQUEST);

    const socialUserDto = new SocialUserDto({
      socialId: id,
      email: email,
      name: name,
      socialType: SocialType.GOOGLE
    });

    return await this.validateSocialUser(socialUserDto);
  }

  private async signInWithApple(identityToken: string, userName: string | null): Promise<User> {
    const { sub, email } = await this.tokenValidator.verifyAppleIdentityToken(identityToken);
    if (!sub || !email) {
      throw new HttpException("유효하지 않은 idToken입니다.", HttpStatus.BAD_REQUEST);
    }
    const socialUserDto = new SocialUserDto({
      socialId: sub,
      email: email,
      name: userName,
      socialType: SocialType.APPLE
    });

    return await this.validateSocialUser(socialUserDto);
  }
}
