import { Music } from "src/domain/music/entity/music.entity";
import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ChartOfDay {
  @PrimaryGeneratedColumn()
  readonly id: number;
  @OneToOne(() => Music)
  @JoinColumn()
  readonly music: Music;
  readonly views: number;
  readonly ranking: number;
  readonly rise: number;
  readonly createdAt: Date;
}
