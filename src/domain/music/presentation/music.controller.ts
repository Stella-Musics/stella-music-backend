import { Controller, Get, ParseEnumPipe, Query } from "@nestjs/common";
import { MusicService } from "../service/music.service";
import { MusicListResponse } from "../data/response/music-list.response";
import { SortBy } from "../enum/sort-by.enum";
import { ChartBy } from "../enum/chart-by.enum";
import { MusicChartListResponse } from "../data/response/music-chart-list.response";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("Musics")
@Controller("musics")
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  @Get()
  @ApiOperation({ summary: "모든 노래 조회" })
  @ApiResponse({
    status: 200,
    description: "성공적으로 조회되었습니다.",
    type: MusicListResponse
  })
  async getMusics(
    @Query("sortBy", new ParseEnumPipe(SortBy)) sortBy: SortBy
  ): Promise<MusicListResponse> {
    return await this.musicService.getMusic(sortBy);
  }

  @Get("chart")
  @ApiOperation({ summary: "노래 차트 조회" })
  @ApiResponse({
    status: 200,
    description: "성공적으로 조회되었습니다.",
    type: MusicChartListResponse
  })
  async getMusicChart(
    @Query("chartBy", new ParseEnumPipe(ChartBy)) chartBy: ChartBy
  ): Promise<MusicChartListResponse> {
    return await this.musicService.getMusicChart(chartBy);
  }

  @Get("new")
  @ApiOperation({ summary: "신규 노래 조회" })
  @ApiResponse({
    status: 200,
    description: "성공적으로 조회되었습니다.",
    type: MusicListResponse
  })
  async getNewestMusic(): Promise<MusicListResponse> {
    return await this.musicService.getNewestMusic();
  }

  @Get("popular")
  @ApiOperation({ summary: "인기 노래 조회" })
  @ApiResponse({
    status: 200,
    description: "성공적으로 조회되었습니다.",
    type: MusicListResponse
  })
  async getPopularMusic(): Promise<MusicListResponse> {
    return await this.musicService.getPopularMusic();
  }
}
