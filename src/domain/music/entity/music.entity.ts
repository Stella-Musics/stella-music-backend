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
  viewsOfWeek: number;

  @Column()
  viewsOfDay: number;

  @Column()
  viewsOfTime: number;

  @Column()
  uploadedDate: Date;

  @Column()
  karaokeCode: number;

  @ManyToOne(() => Artist)
  artist: Artist;
}
