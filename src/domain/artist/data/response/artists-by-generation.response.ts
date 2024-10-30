import { ApiProperty } from "@nestjs/swagger";
import { ArtistResponse } from "./artist.response";

export class ArtistByGenerationResponse {
  @ApiProperty({ description: "'기수: 아티스트 리스트' 형식으로 응답", type: ArtistResponse })
  artists: { [key: number]: ArtistResponse[] };

  constructor(artists: Map<number, ArtistResponse[]>) {
    this.artists = Object.fromEntries(artists);
  }
}
