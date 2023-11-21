
import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString, Min, Validate } from 'class-validator';



@InputType()
export class SearchTicketInput {

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    priority?: string;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    category?: string;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    status?: string;

    @Field(() => Int, { nullable: true })
    @IsNumber()
    @IsOptional()
    @Min(0)
    skip?: number;


    @Field(() => Int, { nullable: true })
    @IsNumber()
    @IsOptional()
    @Min(0)
    limit?: number;
}
