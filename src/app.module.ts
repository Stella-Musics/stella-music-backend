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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.ENV === "prod" ? ".prod.env" : ".dev.env"
    }),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DATABASE_HOST,
      port: 3306,
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
      synchronize: true
    }),
    TypeOrmModule.forFeature([Artist])
  ],
  controllers: [],
  providers: [ArtistGenerator, YoutubeUtils]
})
export class AppModule {}
