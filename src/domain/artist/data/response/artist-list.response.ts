import { ApiProperty } from "@nestjs/swagger";
import { ArtistResponse } from "./artist.response";

export class ArtistListResponse {
  constructor(list: ArtistResponse[]) {
    this.list = list;
  }

  @ApiProperty({ type: ArtistResponse, description: "스텔라 조회 목록" })
  readonly list: ArtistResponse[];
}
