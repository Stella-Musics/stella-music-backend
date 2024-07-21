import { Controller, Get } from "@nestjs/common";
import { ArtistService } from "../service/artist.service";
import { AritstListResponse } from "../data/response/artist-list.response";

@Controller("artists")
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  async getArtists(): Promise<AritstListResponse> {
    return await this.artistService.getArtist();
  }
}
