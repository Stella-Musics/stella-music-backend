import { Controller, Get } from "@nestjs/common";
import { ArtistService } from "../service/artist.service";
import { ArtistByPeriodResponse } from "../data/response/artists-by-period.response";

@Controller("artists")
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  async getArtists(): Promise<ArtistByPeriodResponse> {
    return await this.artistService.getArtist();
  }
}
