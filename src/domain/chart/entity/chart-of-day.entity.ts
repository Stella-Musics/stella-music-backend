import { Music } from "src/domain/music/entity/music.entity";
import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ChartOfHour {
  @PrimaryGeneratedColumn()
  readonly id: number;
  @ManyToOne(() => Music)
  readonly music: Music;
  readonly views: number;
  readonly ranking: number;
  readonly createdAt: Date;
}
