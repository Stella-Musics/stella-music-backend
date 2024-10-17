import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/domain/user/entity/user.entity";
import { Repository } from "typeorm";
import { SocialUserDto } from "./dto/social.dto";
import { SocialType } from "src/domain/user/enums/social.type";
import axios from "axios";
import { JwtGenerator } from "src/global/jwt/jwt.generator";
import { TokenResponse } from "../data/response/token.response";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtGenerator: JwtGenerator
  ) {}

  async validateSocialUser(socialUserDto: SocialUserDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ email: socialUserDto.email });

    if (user === null) {
      const generatedUser = socialUserDto.toUser();
      return await this.userRepository.save(generatedUser);
    } else if (socialUserDto.socialType !== user.socialType) {
      throw new HttpException("이미 다른 소셜 계정으로 가입된 유저입니다.", HttpStatus.CONFLICT);
    }

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

  async signIn(socialType: SocialType, accessToken: string | null): Promise<TokenResponse> {
    if (!accessToken) throw new HttpException("올바르지 않은 요청입니다.", HttpStatus.BAD_REQUEST);

    if (socialType === SocialType.GOOGLE) {
      const user = await this.signInWithGoogle(accessToken);
      const token = await this.jwtGenerator.generateToken(user);

      const tokenResponse = new TokenResponse(
        token.accessToken,
        token.refreshToken,
        token.accessExpiresIn
      );
      return tokenResponse;
    } else {
      throw new HttpException("지원되지 않는 소셜 로그인입니다.", HttpStatus.BAD_REQUEST);
    }
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
}
