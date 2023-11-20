import { ObjectType, Field } from '@nestjs/graphql';
import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@ObjectType()
export class Ticket {
    @PrimaryGeneratedColumn("uuid")
    @Field()
    id: string;

    @Field()
    @Column()
    title: string;

    @Field()
    @Column()
    description: string;

    @Field()
    @Column()
    priority: string;

    @Field()
    @Column()
    category: string;

    @Field()
    @Column()
    status: string;
}