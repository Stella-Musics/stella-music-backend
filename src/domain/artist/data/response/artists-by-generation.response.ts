import { ArtistResponse } from "./artist.response";

export class ArtistByGenerationResponse {
  artists: { [key: number]: ArtistResponse[] };

  constructor(artists: Map<number, ArtistResponse[]>) {
    this.artists = Object.fromEntries(artists);
  }
}
