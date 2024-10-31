import { ApiProperty } from "@nestjs/swagger";
import { MusicChartResponse } from "./music-chart.response";

export class MusicChartListResponse {
  constructor(list: MusicChartResponse[]) {
    this.list = list;
  }
  @ApiProperty({ description: "음악 차트 리스트" })
  readonly list: MusicChartResponse[];
}
