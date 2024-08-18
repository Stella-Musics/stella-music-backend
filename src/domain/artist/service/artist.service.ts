import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Artist } from "../entity/artist.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { ArtistResponse } from "../data/response/artist.response";
import { ArtistByGenerationResponse } from "../data/response/artists-by-period.response";

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist)
    readonly artistRepository: Repository<Artist>
  ) {}

  async getArtist(): Promise<ArtistByGenerationResponse> {
    const artistList = await this.artistRepository.find({ relations: ["urls"] });

    const artistMap = new Map<number, ArtistResponse[]>();
    artistList.forEach((artist) => {
      const urlList = artist.urls.map((urlEntity) => {
        return {
          name: urlEntity.name,
          url: urlEntity.url
        };
      });

      if (artistMap.has(artist.generation ?? 0))
        artistMap
          .get(artist.generation ?? 0)
          ?.push(new ArtistResponse(artist.id, artist.name, urlList));
      else
        artistMap.set(artist.generation ?? 0, [
          new ArtistResponse(artist.id, artist.name, urlList)
        ]);
    });

    return new ArtistByGenerationResponse(artistMap);
  }
}
