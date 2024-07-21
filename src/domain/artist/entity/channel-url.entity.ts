import { Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Artist } from "./artist.entity";

@Entity()
export class ChannelUrl {
  readonly name: string;
  @PrimaryColumn()
  readonly url: string;
  @ManyToOne(() => Artist)
  readonly artist: Artist;
}
