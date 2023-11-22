import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsOptional } from 'class-validator';
import { IsString, Length } from 'class-validator';
import {
  PriorityEnum,
  CategoryEnum,
  StatusEnum,
} from '../infraestructure/ValidationEnum';

@InputType()
export class UpdateTicketInput {
  @Field()
  @IsString()
  id: string;

  @Field({ nullable: true })
  @IsString()
  @Length(2, 30, { message: 'Title Must Be At Least 2 characters' })
  @IsOptional()
  title?: string;

  @Field({ nullable: true })
  @Field()
  @IsString()
  @IsOptional()
  description?: string;

  @Field({ nullable: true })
  @Field()
  @IsString()
  @IsOptional()
  @IsEnum(PriorityEnum, { message: 'Invalid priority value' })
  priority?: string;

  @Field({ nullable: true })
  @Field()
  @IsString()
  @IsOptional()
  @IsEnum(CategoryEnum, { message: 'Invalid category value' })
  category?: string;

  @Field({ nullable: true })
  @Field()
  @IsString()
  @IsOptional()
  @IsEnum(StatusEnum, { message: 'Invalid status value' })
  status?: string;
}
