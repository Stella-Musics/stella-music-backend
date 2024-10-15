import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/domain/user/entity/user.entity";
import { Repository } from "typeorm";
import { SocialUserDto } from "./dto/social.dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async validateSocialUser(socialUserDto: SocialUserDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ email: socialUserDto.email });

    if (user === null) {
      const generatedUser = socialUserDto.toUser();
      return await this.userRepository.save(generatedUser);
    } else if (socialUserDto.socialType !== user.socialType) {
      throw new HttpException("해당 유저가 이미 존재함", HttpStatus.CONFLICT);
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
}
