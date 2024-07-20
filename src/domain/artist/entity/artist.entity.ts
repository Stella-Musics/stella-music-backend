import { Participant } from "src/domain/participant/entity/participant.entity";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Artist extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  chzzkUrl: string;

  @Column()
  youtubeUrl: string;

  @Column()
  youtueMusicUrl: string | null;

  @OneToMany(() => Participant, (participant) => participant.artist)
  participants: Participant[];
}
