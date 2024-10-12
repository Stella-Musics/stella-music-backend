import { Controller, Get, UseGuards, Res, Req } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Controller("auth")
export class AuthController {
  @Get("google")
  @UseGuards(AuthGuard("google"))
  async googleLogin(): Promise<void> {}

  @Get("google/redirect")
  @UseGuards(AuthGuard("google"))
  async googleLoginCallback(@Req() req, @Res() res): Promise<void> {
    const jwt: string = req.user.jwt;
    if (jwt) res.redirect("http://localhost:3000/login/success?jwt=" + jwt);
    else res.redirect("http://localhost:3000/login/failure");
  }
}
