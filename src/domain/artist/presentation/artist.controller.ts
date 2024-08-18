import { Controller, Get } from "@nestjs/common";
import { ArtistService } from "../service/artist.service";
import { ArtistByGenerationResponse } from "../data/response/artists-by-period.response";

@Controller("artists")
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  async getArtists(): Promise<ArtistByGenerationResponse> {
    return await this.artistService.getArtist();
  }
}
