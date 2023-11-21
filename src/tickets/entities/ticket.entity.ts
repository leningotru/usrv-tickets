import { ObjectType, Field } from '@nestjs/graphql';
import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@ObjectType()
export class Ticket {
    @PrimaryGeneratedColumn("uuid")
    @Field( () => String, {description: 'Ticket Identificator'})
    id: string;

    @Field( () => String, {description: 'Ticket Title'} )
    @Column()
    title: string;

    @Field(() => String, {description: 'Ticket Description'})
    @Column()
    description: string;

    @Field(() => String, {description: 'Ticket Pryority: high|medium|low'})
    @Column()
    priority: string;

    @Field(() => String, {description: 'Tickect Category: incident|support|error'})
    @Column()
    category: string;

    @Field(() => String, {description: 'Tickect Status: pending|verified|approved|rejected'})
    @Column()
    status: string;
}