import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Artist } from "../entity/artist.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { AritstResponse } from "../data/response/artist.response";
import { AritstListResponse } from "../data/response/artist-list.response";

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist)
    readonly artistRepository: Repository<Artist>
  ) {}

  async getArtist(): Promise<AritstListResponse> {
    const artistList = await this.artistRepository.find();

    const aristsResponseList = artistList.map((artist) => {
      return new AritstResponse(
        artist.id,
        artist.name,
        artist.chzzkUrl,
        artist.youtubeUrl,
        artist.youtueMusicUrl
      );
    });

    return new AritstListResponse(aristsResponseList);
  }
}
