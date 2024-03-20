import { Injectable, OnModuleInit } from "@nestjs/common";
import { Artist } from "../entity/artist.entity";

@Injectable()
export class ArtistGenerator implements OnModuleInit {

  async onModuleInit() {
    if (!await Artist.existsByName('스텔라이브'))
        await Artist.save({name: '스텔라이브'});

    if (!await Artist.existsByName('아야츠노 유니'))
        await Artist.save({name: '아야츠노 유니'});

    if (!await Artist.existsByName('아이리 칸나'))
        await Artist.save({name: '아이리 칸나'});

    if (!await Artist.existsByName('시라유키 히나'))
        await Artist.save({name: '시라유키 히나'});

    if (!await Artist.existsByName('아라하시 타비'))
        await Artist.save({name: '아라하시 타비'});

    if (!await Artist.existsByName('네네코 마시로'))
        await Artist.save({name: '네네코 마시로'});

    if (!await Artist.existsByName('아카네 리제'))
        await Artist.save({name: '아카네 리제'});
  }
}