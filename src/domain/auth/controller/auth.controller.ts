import { Controller, Get, UseGuards, Res, Req, Post, Param, Headers } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthGuard } from "@nestjs/passport";
import { SocialType } from "src/domain/user/enums/social.type";
import { AuthService } from "../service/auth.service";
import { TokenResponse } from "../data/response/token.response";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService
  ) {}

  @Get("google")
  @UseGuards(AuthGuard("google"))
  async googleLogin(): Promise<void> {}

  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  async googleLoginCallback(@Req() req, @Res() res): Promise<void> {
    const accessToken: string = req.user.accessToken;
    if (accessToken)
      res.redirect(this.configService.get<string>("GOOGLE_SUCCESS_URL") + "?token=" + accessToken);
    else {
      const errorMessage = req.err ? req.err.message : "Unknown error";
      res.redirect(
        this.configService.get<string>("GOOGLE_FAILURE_URL") + "?message=" + errorMessage
      );
    }
  }

  @Post(":socialType")
  async loginSocial(
    @Param("socialType") socialType: SocialType,
    @Headers("authorization") accessToken: string
  ): Promise<TokenResponse> {
    return await this.authService.signIn(socialType, accessToken);
  }
}
