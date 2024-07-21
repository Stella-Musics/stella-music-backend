import { Controller } from "@nestjs/common";
import { ArtistService } from "../service/artist.service";

@Controller("artists")
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}
}
