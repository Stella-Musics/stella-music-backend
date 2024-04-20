export class VideoInfoDto {
  constructor(
    readonly videoId: string,
    readonly title: string,
    readonly description: string,
    readonly viewCount: string,
    readonly uploadedDate: Date
  ) {}
}
