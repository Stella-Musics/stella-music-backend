import { Artist } from "src/domain/artist/entity/artist.entity";
import { Music } from "src/domain/music/entity/music.entity";
import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Participant {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @ManyToOne(() => Artist, (artist) => artist.participants)
  readonly artist: Artist;

  @ManyToOne(() => Music, (music) => music.participants)
  readonly music: Music;
}
