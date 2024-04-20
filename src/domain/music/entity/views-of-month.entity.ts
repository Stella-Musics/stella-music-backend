import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Music } from "./music.entity";

@Entity()
export class ViewsOfMonth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  views: number;

  @ManyToOne(() => Music)
  music: Music;

  @CreateDateColumn()
  readonly createdAt: Date;
}