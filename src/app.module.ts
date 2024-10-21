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
import { MusicSchedulersController } from "./domain/music/presentation/music-scheduler.controller";
import { MusicService } from "./domain/music/service/music.service";
import { MusicController } from "./domain/music/presentation/music.controller";
import { GetChartUtil } from "./domain/chart/util/get-chart.util";
import { ArtistService } from "./domain/artist/service/artist.service";
import { ArtistController } from "./domain/artist/presentation/artist.controller";
import { ChannelUrl } from "./domain/artist/entity/channel-url.entity";
import { User } from "./domain/user/entity/user.entity";
import { AuthController } from "./domain/auth/controller/auth.controller";
import { GoogleStrategy } from "./domain/auth/strategy/google.strategy";
import { AuthService } from "./domain/auth/service/auth.service";
import { JwtGenerator } from "./global/jwt/jwt.generator";
import { JwtService } from "@nestjs/jwt";
import { TokenValidator } from "./domain/auth/util/token.validator";

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
        ViewsOfYear,
        ChannelUrl,
        User
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
      ViewsOfYear,
      User
    ]),
    ScheduleModule.forRoot()
  ],
  controllers: [MusicSchedulersController, MusicController, ArtistController, AuthController],
  providers: [
    ArtistGenerator,
    YoutubeUtils,
    MusicInfoEachDayScheduler,
    MusicInfoEachHourScheduler,
    MusicInfoEachMonthScheduler,
    MusicInfoEachWeekScheduler,
    MusicInfoEachYearScheduler,
    MusicSchedulerUtil,
    MusicService,
    GetChartUtil,
    ArtistService,
    GoogleStrategy,
    AuthService,
    JwtGenerator,
    JwtService,
    TokenValidator
  ]
})
export class AppModule {}
