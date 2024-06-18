export class MusicResponse {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly youtubeId: string,
    readonly views: number,
    readonly uploadedDate: Date,
    readonly TJKaraokeCode: number,
    readonly KYKaraokeCode: number
  ) {}
}
