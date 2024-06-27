import { ParticipantInfo } from "src/domain/participant/data/response/participant-info.response";

export class MusicResponse {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly youtubeId: string,
    readonly views: number,
    readonly uploadedDate: Date,
    readonly TJKaraokeCode: number | null,
    readonly KYKaraokeCode: number | null,
    readonly participantInfos: ParticipantInfo[]
  ) {}
}
