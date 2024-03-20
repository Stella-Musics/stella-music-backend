import { Injectable, OnModuleInit } from "@nestjs/common";
import { Artist } from "../entity/artist.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class ArtistGenerator implements OnModuleInit {
  constructor(
    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>
  ) {}

  async onModuleInit() {
    const artists = ['스텔라이브', '아야츠노 유니', '아이리 칸나', '시라유키 히나', '아라하시 타비', '네네코 마시로', '아카네 리제'];

    artists.forEach(async artist => {
        if (!await this.artistRepository.existsBy({name: artist}))
            await this.artistRepository.save({name: artist})
    })
  }
}