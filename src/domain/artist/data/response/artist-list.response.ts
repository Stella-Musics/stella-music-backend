import { AritstResponse } from "./artist.response";

export class AritstListResponse {
  constructor(readonly list: AritstResponse[]) {}
}
