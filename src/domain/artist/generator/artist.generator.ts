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
    if (!await this.artistRepository.existsBy({name: '스텔라이브'}))
        await Artist.save({name: '스텔라이브'});

    if (!await this.artistRepository.existsBy({name: '아야츠노 유니'}))
        await Artist.save({name: '아야츠노 유니'});

    if (!await this.artistRepository.existsBy({name: '아이리 칸나'}))
        await Artist.save({name: '아이리 칸나'});

    if (!await this.artistRepository.existsBy({name: '시라유키 히나'}))
        await Artist.save({name: '시라유키 히나'});

    if (!await this.artistRepository.existsBy({name: '아라하시 타비'}))
        await Artist.save({name: '아라하시 타비'});

    if (!await this.artistRepository.existsBy({name: '네네코 마시로'}))
        await Artist.save({name: '네네코 마시로'});

    if (!await this.artistRepository.existsBy({name: '아카네 리제'}))
        await Artist.save({name: '아카네 리제'});
  }
}