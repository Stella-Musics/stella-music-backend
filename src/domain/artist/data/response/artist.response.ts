export class AritstResponse {
  constructor(
    readonly id: number,
    readonly name: string,
    readonly urls: { name: string; url: string }[]
  ) {}
}
