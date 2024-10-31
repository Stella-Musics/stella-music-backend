import { ApiProperty } from "@nestjs/swagger";

export class ParticipantInfo {
  constructor(artistId: number, artistName: string) {
    this.artistId = artistId;
    this.artistName = artistName;
  }

  @ApiProperty({ description: "스텔라 아이디" })
  readonly artistId: number;
  @ApiProperty({ description: "스텔라 이름" })
  readonly artistName: string;
}
