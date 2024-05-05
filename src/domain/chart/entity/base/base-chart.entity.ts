import { Music } from "src/domain/music/entity/music.entity";
import { Column, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

export abstract class BaseChartEntity {
  @PrimaryGeneratedColumn()
  readonly id: number;
  @OneToOne(() => Music)
  @JoinColumn()
  readonly music: Music;
  @Column()
  readonly views: number;
  @Column()
  readonly ranking: number;
  @Column()
  readonly rise: number;
  @Column()
  readonly createdAt: Date;
}
