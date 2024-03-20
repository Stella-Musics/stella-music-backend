import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Artist extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    static async existsByName(name: string): Promise<boolean> {
        return await this.existsBy({name: name})
    }
}