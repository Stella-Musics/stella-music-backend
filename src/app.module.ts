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
      entities: [Artist, Music, Participant, ChartOfWeek, ChartOfDay, ChartOfHour],
      synchronize: true
    }),
    TypeOrmModule.forFeature([Artist])
  ],
  controllers: [],
  providers: [ArtistGenerator]
})
export class AppModule {}
