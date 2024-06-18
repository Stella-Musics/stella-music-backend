import { MusicResponse } from "./music.response";

export class MusicListResponse {
  constructor(readonly list: MusicResponse[]) {}
}
