import { Controller, Post, UseGuards } from "@nestjs/common";
import { MusicInfoEachDayScheduler } from "../util/music-info-each-day.scheduler";
import { MusicInfoEachHourScheduler } from "../util/music-info-each-hour.shceduler";
import { MusicInfoEachMonthScheduler } from "../util/music-info-each-month.scheduler";
import { MusicInfoEachWeekScheduler } from "../util/music-info-each-week.scheduler";
import { MusicInfoEachYearScheduler } from "../util/music-info-each-year.scheduler";
import { ApiKeyGuard } from "src/global/api/api-key.guard";
import { ApiKey } from "src/global/api/api-key.decorator";

@Controller("music-schedulers")
export class MusicSchedulersController {
  constructor(
    private readonly musicInfoEachDayScheduler: MusicInfoEachDayScheduler,
    private readonly musicInfoEachHourScheduler: MusicInfoEachHourScheduler,
    private readonly musicInfoEachMonthScheduler: MusicInfoEachMonthScheduler,
    private readonly musicInfoEachWeekScheduler: MusicInfoEachWeekScheduler,
    private readonly musicInfoEachYearScheduler: MusicInfoEachYearScheduler
  ) {}

  @Post("day")
  @UseGuards(ApiKeyGuard)
  @ApiKey(process.env.MUSIC_INFO_EACH_DAY_API_KEY)
  async getMusicInfoEachDay() {
    await this.musicInfoEachDayScheduler.getMusicInfoEachDay();
  }

  @Post("hour")
  @UseGuards(ApiKeyGuard)
  @ApiKey(process.env.MUSIC_INFO_EACH_HOUR_API_KEY)
  async getMusicInfoEachHour() {
    await this.musicInfoEachHourScheduler.getMusicInfoEachHour();
  }

  @Post("month")
  @UseGuards(ApiKeyGuard)
  @ApiKey(process.env.MUSIC_INFO_EACH_MONTH_API_KEY)
  async getMusicInfoEachMonth() {
    await this.musicInfoEachMonthScheduler.getMusicInfoEachMonth();
  }

  @Post("week")
  @UseGuards(ApiKeyGuard)
  @ApiKey(process.env.MUSIC_INFO_EACH_WEEK_API_KEY)
  async getMusicInfoEachWeek() {
    await this.musicInfoEachWeekScheduler.getMusicInfoEachWeek();
  }

  @Post("year")
  @UseGuards(ApiKeyGuard)
  @ApiKey(process.env.MUSIC_INFO_EACH_YEAR_API_KEY)
  async getMusicInfoEachYear() {
    await this.musicInfoEachYearScheduler.getMusicInfoEachYear();
  }
}
