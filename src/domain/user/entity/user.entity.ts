import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { SocialType } from "../enums/social.type";
import { Role } from "../enums/role.type";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  readonly id: number;
  @Column()
  readonly name: string;
  @Column()
  readonly socialId: string;
  @Column({ unique: true })
  readonly email: string;
  @Column({
    type: "enum",
    enum: SocialType
  })
  readonly socialType: SocialType;
  @Column({
    type: "enum",
    enum: Role
  })
  readonly role: Role;
}
