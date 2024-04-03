import { Column, Entity, PrimaryColumn } from "typeorm";

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
}
