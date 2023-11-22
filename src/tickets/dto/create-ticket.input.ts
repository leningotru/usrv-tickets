import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsString, Length } from 'class-validator';
import {
  CategoryEnum,
  PriorityEnum,
  StatusEnum,
} from '../infraestructure/ValidationEnum';

@InputType()
export class CreateTicketInput {
  @IsString()
  @Field()
  @Length(2, 60, { message: 'Title Must Be At Least 2 characters' })
  title: string;

  @IsString()
  @Field()
  description: string;

  @IsString()
  @Field()
  @IsEnum(PriorityEnum, { message: 'Invalid priority value' })
  priority: string;

  @IsString()
  @Field()
  @IsEnum(CategoryEnum, { message: 'Invalid category value' })
  category: string;

  @IsString()
  @Field()
  @IsEnum(StatusEnum, { message: 'Invalid status value' })
  status: string;
}
