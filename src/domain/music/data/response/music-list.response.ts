import { ApiProperty } from "@nestjs/swagger";
import { MusicResponse } from "./music.response";

export class MusicListResponse {
  constructor(list: MusicResponse[]) {
    this.list = list;
  }

  @ApiProperty({ description: "노래 목록", type: [MusicResponse] })
  readonly list: MusicResponse[];
}
