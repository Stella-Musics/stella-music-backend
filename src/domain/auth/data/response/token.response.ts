export class TokenResponse {
  constructor(
    readonly accessToken: string,
    readonly refreshToken: string,
    readonly accessExpiresIn: Date
  ) {}
}
