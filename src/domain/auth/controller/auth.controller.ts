import { Controller, Get, UseGuards, Res, Req, Post, Param, Headers, Body } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthGuard } from "@nestjs/passport";
import { SocialType } from "src/domain/user/enums/social.type";
import { AuthService } from "../service/auth.service";
import { TokenResponse } from "../data/response/token.response";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService
  ) {}

  @Get("google")
  @UseGuards(AuthGuard("google"))
  @ApiOperation({ summary: "구글 OAuth UI 조회" })
  @ApiResponse({ status: 302, description: "성공적으로 조회되었습니다." })
  async googleLogin(): Promise<void> {}

  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  @ApiOperation({ summary: "구글 OAuth 콜백 API" })
  @ApiResponse({ description: "성공적으로 로그인 되었습니다." })
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
  @ApiOperation({ summary: "소셜 로그인 API" })
  @ApiResponse({ description: "성공적으로 로그인 되었습니다.", type: TokenResponse })
  async loginSocial(
    @Param("socialType") socialType: SocialType,
    @Headers("authorization") accessToken: string,
    @Body("userName") userName: string | null = null
  ): Promise<TokenResponse> {
    return await this.authService.signIn(socialType, accessToken, userName);
  }
}
