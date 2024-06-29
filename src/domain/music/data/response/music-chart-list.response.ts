import { MusicChartResponse } from "./music-chart.response";

export class MusicChartListResponse {
  constructor(readonly list: MusicChartResponse[]) {}
}
