import { Controller, Get, UseGuards, Res, Req } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthGuard } from "@nestjs/passport";

@Controller("auth")
export class AuthController {
  constructor(private readonly configService: ConfigService) {}

  @Get("google")
  @UseGuards(AuthGuard("google"))
  async googleLogin(): Promise<void> {}

  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  async googleLoginCallback(@Req() req, @Res() res): Promise<void> {
    const accessToken: string = req.user.accessToken;
    if (accessToken)
      res.redirect(this.configService.get<string>("GOOGLE_SUCCESS_URL") + "?token=" + accessToken);
    else
      res.redirect(
        this.configService.get<string>("GOOGLE_FAILURE_URL") + "?message=" + req.err.message
      );
  }
}
