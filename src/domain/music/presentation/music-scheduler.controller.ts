import { Controller, Post } from "@nestjs/common";
import { MusicInfoEachDayScheduler } from "../util/music-info-each-day.scheduler";
import { MusicInfoEachHourScheduler } from "../util/music-info-each-hour.shceduler";
import { MusicInfoEachMonthScheduler } from "../util/music-info-each-month.scheduler";
import { MusicInfoEachWeekScheduler } from "../util/music-info-each-week.scheduler";
import { MusicInfoEachYearScheduler } from "../util/music-info-each-year.scheduler";

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
  getMusicInfoEachDay() {
    this.musicInfoEachDayScheduler.getMusicInfoEachDay();
  }

  @Post("hour")
  getMusicInfoEachHour() {
    this.musicInfoEachHourScheduler.getMusicInfoEachHour();
  }

  @Post("month")
  getMusicInfoEachMonth() {
    this.musicInfoEachMonthScheduler.getMusicInfoEachMonth();
  }

  @Post("week")
  getMusicInfoEachWeek() {
    this.musicInfoEachWeekScheduler.getMusicInfoEachWeek();
  }

  @Post("year")
  getMusicInfoEachYear() {
    this.musicInfoEachYearScheduler.getMusicInfoEachYear();
  }
}
