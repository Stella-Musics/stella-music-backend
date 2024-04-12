import { Music } from "src/domain/music/entity/music.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ChartOfHour {
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
