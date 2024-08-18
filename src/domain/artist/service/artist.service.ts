import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Artist } from "../entity/artist.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { ArtistResponse } from "../data/response/artist.response";
import { ArtistByPeriodResponse } from "../data/response/artists-by-period.response";

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist)
    readonly artistRepository: Repository<Artist>
  ) {}

  async getArtist(): Promise<ArtistByPeriodResponse> {
    const artistList = await this.artistRepository.find({ relations: ["urls"] });

    const artistMap = new Map<number, ArtistResponse[]>();
    artistList.forEach((artist) => {
      const urlList = artist.urls.map((urlEntity) => {
        return {
          name: urlEntity.name,
          url: urlEntity.url
        };
      });

      if (artistMap.has(artist.period ?? 0))
        artistMap
          .get(artist.period ?? 0)
          ?.push(new ArtistResponse(artist.id, artist.name, urlList));
      else artistMap.set(artist.period ?? 0, [new ArtistResponse(artist.id, artist.name, urlList)]);
    });

    return new ArtistByPeriodResponse(artistMap);
  }
}
