
import { InputType, Field } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { IsString, Length } from "class-validator";

@InputType()
export class UpdateTicketInput {

  @Field()
  @IsString()
  id: string;

  @Field()
  @IsString()
  @Length(2, 30, { message: "Title Must Be At Least 2 characters" })
  @IsOptional()
  title?: string;

  @Field()
  @IsString()
  @IsOptional()
  description?: string;

  @Field()
  @IsString()
  @IsOptional()
  priority?: string;

  @Field()
  @IsString()
  @IsOptional()
  category?: string;

  @Field()
  @IsString()
  @IsOptional()
  status?: string;
}
