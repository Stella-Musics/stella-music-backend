import { Artist } from "src/domain/artist/entity/artist.entity";
import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";

@Entity()
export class Music {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  youtubeId: string;

  @Column()
  views: number;

  @Column()
  uploadedDate: Date;

  @Column()
  TJKaraokeCode: number;

  @Column()
  KYKaraokeCode: number;

  @ManyToOne(() => Artist)
  artist: Artist;
}
