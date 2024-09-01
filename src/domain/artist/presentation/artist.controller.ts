import { Controller, Get, Param } from "@nestjs/common";
import { ArtistService } from "../service/artist.service";
import { ArtistByGenerationResponse } from "../data/response/artists-by-generation.response";
import { MusicListResponse } from "src/domain/music/data/response/music-list.response";
import { MusicService } from "src/domain/music/service/music.service";

@Controller("artists")
export class ArtistController {
  constructor(
    private readonly artistService: ArtistService,
    private readonly musicService: MusicService
  ) {}

  @Get()
  async getArtists(): Promise<ArtistByGenerationResponse> {
    return await this.artistService.getArtist();
  }

  @Get(":artistId/musics")
  async getMusicByArtist(@Param("artistId") artistId: number): Promise<MusicListResponse> {
    return await this.musicService.getMusicByArtist(artistId);
  }
}
