import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { Artist } from "./domain/artist/entity/artist.entity";
import { ArtistGenerator } from "./domain/artist/generator/artist.generator";
import { Music } from "./domain/music/entity/music.entity";
import { Participant } from "./domain/participant/entity/participant.entity";
import { ChartOfWeek } from "./domain/chart/entity/chart-of-week.entity";
import { ChartOfDay } from "./domain/chart/entity/chart-of-day.entity";
import { ChartOfHour } from "./domain/chart/entity/chart-of-hour.entity";
import { ChartOfMonth } from "./domain/chart/entity/chart-of-month.entity";
import { ChartOfYear } from "./domain/chart/entity/chart-of-year.entity";
import { ViewsOfWeek } from "./domain/music/entity/views-of-week.entity";
import { ViewsOfDay } from "./domain/music/entity/views-of-day.entity";
import { ViewsOfHour } from "./domain/music/entity/views-of-hour.entity";
import { ViewsOfMonth } from "./domain/music/entity/views-of-month.entity";
import { ViewsOfYear } from "./domain/music/entity/views-of-year.entity";
import { YoutubeUtils } from "./global/thridparty/youtube/youtube.util";
import { ScheduleModule } from "@nestjs/schedule";
import { MusicInfoEachDayScheduler } from "./domain/music/util/music-info-each-day.scheduler";
import { MusicInfoEachHourScheduler } from "./domain/music/util/music-info-each-hour.shceduler";
import { MusicInfoEachMonthScheduler } from "./domain/music/util/music-info-each-month.scheduler";
import { MusicInfoEachWeekScheduler } from "./domain/music/util/music-info-each-week.scheduler";
import { MusicInfoEachYearScheduler } from "./domain/music/util/music-info-each-year.scheduler";
import { MusicSchedulerUtil } from "./domain/music/util/music-scheduler.util";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.ENV === "prod" ? ".prod.env" : ".dev.env"
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DATABASE_HOST,
      port: 5432,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [
        Artist,
        Music,
        Participant,
        ChartOfWeek,
        ChartOfDay,
        ChartOfHour,
        ChartOfMonth,
        ChartOfYear,
        ViewsOfWeek,
        ViewsOfDay,
        ViewsOfHour,
        ViewsOfMonth,
        ViewsOfYear
      ],
      synchronize: true,
      ssl: process.env.DATABASE_SSL === "true",
      extra:
        process.env.DATABASE_SSL === "true"
          ? {
              ssl: {
                rejectUnauthorized: false
              }
            }
          : {}
    }),
    TypeOrmModule.forFeature([
      Artist,
      Music,
      Participant,
      ChartOfWeek,
      ChartOfDay,
      ChartOfHour,
      ChartOfMonth,
      ChartOfYear,
      ViewsOfWeek,
      ViewsOfDay,
      ViewsOfHour,
      ViewsOfMonth,
      ViewsOfYear
    ]),
    ScheduleModule.forRoot()
  ],
  controllers: [],
  providers: [
    ArtistGenerator,
    YoutubeUtils,
    MusicInfoEachDayScheduler,
    MusicInfoEachHourScheduler,
    MusicInfoEachMonthScheduler,
    MusicInfoEachWeekScheduler,
    MusicInfoEachYearScheduler,
    MusicSchedulerUtil
  ]
})
export class AppModule {}
