import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Artist } from "../entity/artist.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { ArtistResponse } from "../data/response/artist.response";
import { ArtistListResponse } from "../data/response/artist-list.response";

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist)
    readonly artistRepository: Repository<Artist>
  ) {}

  async getArtist(): Promise<ArtistListResponse> {
    const artistList = await this.artistRepository.find({ relations: ["urls"] });

    const aristsResponseList = artistList.map((artist) => {
      const urlList = artist.urls.map((urlEntity) => {
        return {
          name: urlEntity.name,
          url: urlEntity.url
        };
      });

      return new ArtistResponse(artist.id, artist.name, urlList);
    });

    return new ArtistListResponse(aristsResponseList);
  }
}
