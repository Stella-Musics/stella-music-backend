import { Column, CreateDateColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Music } from "../music.entity";

export abstract class BaseViewsEntity {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column()
  readonly views: number;

  @ManyToOne(() => Music)
  readonly music: Music;

  @CreateDateColumn()
  readonly createdAt: Date;

  constructor(views: number, music: Music, createdDate: Date) {
    this.views = views;
    this.music = music;
    this.createdAt = createdDate;
  }
}
