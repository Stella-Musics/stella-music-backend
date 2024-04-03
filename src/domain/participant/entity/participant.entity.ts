import { Artist } from "src/domain/artist/entity/artist.entity";
import { Music } from "src/domain/music/entity/music.entity";
import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Participant {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @ManyToOne(() => Artist)
  readonly artist: Artist;

  @ManyToOne(() => Music)
  readonly music: Music;
}
