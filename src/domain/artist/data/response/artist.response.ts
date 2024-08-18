export class ArtistResponse {
  constructor(
    readonly id: number,
    readonly name: string,
    readonly urls: { name: string; url: string }[]
  ) {}
}
