import { Controller, Get, Param } from "@nestjs/common";
import { ArtistService } from "../service/artist.service";
import { ArtistByGenerationResponse } from "../data/response/artists-by-generation.response";
import { MusicListResponse } from "src/domain/music/data/response/music-list.response";
import { MusicService } from "src/domain/music/service/music.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("Artists")
@Controller("artists")
export class ArtistController {
  constructor(
    private readonly artistService: ArtistService,
    private readonly musicService: MusicService
  ) {}

  @Get()
  @ApiOperation({ summary: "모든 스텔라 조회" })
  @ApiResponse({
    status: 200,
    description: "성공적으로 조회되었습니다.",
    type: ArtistByGenerationResponse
  })
  async getArtists(): Promise<ArtistByGenerationResponse> {
    return await this.artistService.getArtist();
  }

  @Get(":artistId/musics")
  @ApiOperation({ summary: "특정 스텔라의 노래 조회" })
  @ApiResponse({
    status: 200,
    description: "성공적으로 조회되었습니다.",
    type: MusicListResponse
  })
  async getMusicByArtist(@Param("artistId") artistId: number): Promise<MusicListResponse> {
    return await this.musicService.getMusicByArtist(artistId);
  }
}
