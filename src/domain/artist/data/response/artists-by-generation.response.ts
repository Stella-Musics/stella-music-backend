import { ApiProperty } from "@nestjs/swagger";
import { ArtistResponse } from "./artist.response";

export class ArtistByGenerationResponse {
  @ApiProperty({
    description: "'기수: 아티스트 리스트' 형식으로 응답",
    example: {
      1: [
        {
          id: 1,
          name: "아야츠노 유니",
          urls: [
            { name: "치지직", url: "https://chzzk.naver.com/45e71a76e949e16a34764deb962f9d9f" }
          ]
        },
        {
          id: 2,
          name: "아이리 칸나",
          urls: [
            { name: "치지직", url: "https://chzzk.naver.com/f722959d1b8e651bd56209b343932c01" }
          ]
        }
      ]
    }
  })
  readonly artists: { [key: number]: ArtistResponse[] };

  constructor(artists: Map<number, ArtistResponse[]>) {
    this.artists = Object.fromEntries(artists);
  }
}
