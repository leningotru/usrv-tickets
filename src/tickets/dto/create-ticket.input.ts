import { InputType, Field } from '@nestjs/graphql';
import { IsString, Length } from "class-validator";

@InputType()
export class CreateTicketInput {
    @IsString()
    @Field()
    @Length(2, 30, { message: "Title Must Be At Least 2 characters" })
    title: string;

    @IsString()
    @Field()
    description: string;

    @IsString()
    @Field()
    priority: string;

    @IsString()
    @Field()
    category: string;

    @IsString()
    @Field()
    status: string;
}
