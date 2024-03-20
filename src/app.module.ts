import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";  
import { Artist } from "./domain/artist/entity/artist.entity";
import { ArtistGenerator } from "./domain/artist/generator/artist.generator";
import { Repository } from "typeorm";

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
      entities: [Artist],
      synchronize: true
    }),
    TypeOrmModule.forFeature([
      Artist
    ])
  ],
  controllers: [AppController],
  providers: [AppService, ArtistGenerator, Repository]
})
export class AppModule {}
