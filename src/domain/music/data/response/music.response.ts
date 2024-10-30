import { ApiProperty } from "@nestjs/swagger";
import { ParticipantInfo } from "src/domain/participant/data/response/participant-info.response";

export class MusicResponse {
  constructor(
    id: string,
    name: string,
    youtubeId: string,
    views: number,
    uploadedDate: Date,
    TJKaraokeCode: number | null,
    KYKaraokeCode: number | null,
    participantInfos: ParticipantInfo[]
  ) {
    this.id = id;
    this.name = name;
    this.youtubeId = youtubeId;
    this.views = views;
    this.uploadedDate = uploadedDate;
    this.TJKaraokeCode = TJKaraokeCode;
    this.KYKaraokeCode = KYKaraokeCode;
    this.participantInfos = participantInfos;
  }

  @ApiProperty({ description: "노래 아이디" })
  readonly id: string;
  @ApiProperty({ description: "노래 제목" })
  readonly name: string;
  @ApiProperty({ description: "노래 유튜브 아이디" })
  readonly youtubeId: string;
  @ApiProperty({ description: "노래 조회수" })
  readonly views: number;
  @ApiProperty({ description: "노래 업로드 일자" })
  readonly uploadedDate: Date;
  @ApiProperty({ description: "TJ 노래방 코드", type: Number })
  readonly TJKaraokeCode: number | null;
  @ApiProperty({ description: "금영 노래방 코드", type: Number })
  readonly KYKaraokeCode: number | null;
  @ApiProperty({ description: "참여자 목록", type: ParticipantInfo })
  readonly participantInfos: ParticipantInfo[];
}
