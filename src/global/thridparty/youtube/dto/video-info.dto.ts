export class VideoInfoDto {
  constructor(
    readonly videoId: string,
    readonly title: string,
    readonly viewCount: string,
    readonly uploadedDate: Date
  ) {}
}
