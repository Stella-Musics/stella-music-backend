import { ApiProperty } from "@nestjs/swagger";

export class ArtistResponse {
  constructor(id: number, name: string, urls: { name: string; url: string }[]) {
    this.id = id;
    this.name = name;
    this.urls = urls;
  }

  @ApiProperty({ description: "스텔라 아이디" })
  readonly id: number;
  @ApiProperty({ description: "스텔라 이름" })
  readonly name: string;
  @ApiProperty({ description: "스텔라 채널 url" })
  readonly urls: { name: string; url: string }[];
}
