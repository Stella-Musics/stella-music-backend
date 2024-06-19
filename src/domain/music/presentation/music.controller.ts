import { Controller, Get, ParseEnumPipe, Query } from "@nestjs/common";
import { MusicService } from "../service/music.service";
import { MusicListResponse } from "../data/response/music-list.response";
import { SortBy } from "../enum/sort-by.enum";

@Controller("musics")
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  @Get()
  async getMusics(
    @Query("sortBy", new ParseEnumPipe(SortBy)) sortBy: SortBy
  ): Promise<MusicListResponse> {
    return await this.musicService.getMusic(sortBy);
  }
}
