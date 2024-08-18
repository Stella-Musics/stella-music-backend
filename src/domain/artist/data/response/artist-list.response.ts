import { ArtistResponse } from "./artist.response";

export class ArtistListResponse {
  constructor(readonly list: ArtistResponse[]) {}
}
