import { Injectable, OnModuleInit } from "@nestjs/common";
import { Artist } from "../entity/artist.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

class ArtistInfo {
  constructor(
    readonly name: string,
    readonly period: number | null
  ) {}
}

@Injectable()
export class ArtistGenerator implements OnModuleInit {
  constructor(
    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>
  ) {}

  async onModuleInit() {
    const artistInfos = [
      new ArtistInfo("스텔라이브", null),
      new ArtistInfo("아야츠노 유니", 1),
      new ArtistInfo("아이리 칸나", 1),
      new ArtistInfo("시라유키 히나", 2),
      new ArtistInfo("아라하시 타비", 2),
      new ArtistInfo("네네코 마시로", 2),
      new ArtistInfo("아카네 리제", 2),
      new ArtistInfo("텐코 시부키", 3),
      new ArtistInfo("아오쿠모 린", 3),
      new ArtistInfo("하나코 나나", 3),
      new ArtistInfo("유즈하 리코", 3)
    ];

    artistInfos.forEach(async (artistInfo) => {
      const isExist = await this.artistRepository.existsBy({ name: artistInfo.name });
      if (!isExist)
        await this.artistRepository.save({ name: artistInfo.name, period: artistInfo.period });
    });
  }
}
