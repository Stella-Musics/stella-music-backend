import { Controller, Get, ParseEnumPipe, Query } from "@nestjs/common";
import { MusicService } from "../service/music.service";
import { MusicListResponse } from "../data/response/music-list.response";
import { SortBy } from "../enum/sort-by.enum";
import { ChartBy } from "../enum/chart-by.enum";
import { MusicChartListResponse } from "../data/response/music-chart-list.response";

@Controller("musics")
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  @Get()
  async getMusics(
    @Query("sortBy", new ParseEnumPipe(SortBy)) sortBy: SortBy
  ): Promise<MusicListResponse> {
    return await this.musicService.getMusic(sortBy);
  }

  @Get("chart")
  async getMusicChart(
    @Query("chartBy", new ParseEnumPipe(ChartBy)) chartBy: ChartBy
  ): Promise<MusicChartListResponse> {
    return await this.musicService.getMusicChart(chartBy);
  }
}
