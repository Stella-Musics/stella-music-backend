import { Participant } from "src/domain/participant/entity/participant.entity";
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";

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

  @Column({ type: "integer", nullable: true })
  TJKaraokeCode: number | null;

  @Column({ type: "integer", nullable: true })
  KYKaraokeCode: number | null;

  @OneToMany(() => Participant, (participant) => participant.music)
  participants: Participant[];
}
