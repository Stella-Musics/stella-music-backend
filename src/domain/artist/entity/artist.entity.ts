import { Participant } from "src/domain/participant/entity/participant.entity";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ChannelUrl } from "./channel-url.entity";

@Entity()
export class Artist extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Participant, (participant) => participant.artist)
  participants: Participant[];

  @OneToMany(() => ChannelUrl, (channelUrl) => channelUrl.artist)
  urls: ChannelUrl[];
}
