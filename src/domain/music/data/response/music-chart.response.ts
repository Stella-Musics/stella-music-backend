import { ParticipantInfo } from "src/domain/participant/data/response/participant-info.response";

export class MusicChartResponse {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly youtubeId: string,
    readonly views: number,
    readonly uploadedDate: Date,
    readonly TJKaraokeCode: number,
    readonly KYKaraokeCode: number,
    readonly rise: number,
    readonly participantInfos: ParticipantInfo[]
  ) {}
}
