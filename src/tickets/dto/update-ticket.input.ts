
import { InputType, Field } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { IsString, Length } from "class-validator";

@InputType()
export class UpdateTicketInput {

  @Field()
  @IsString()
  id: string;

  @Field({nullable:true})
  @IsString()
  @Length(2, 30, { message: "Title Must Be At Least 2 characters" })
  @IsOptional()
  title?: string;

  @Field({nullable:true})
  @Field()
  @IsString()
  @IsOptional()
  description?: string;

  @Field({nullable:true})
  @Field()
  @IsString()
  @IsOptional()
  priority?: string;

  @Field({nullable:true})
  @Field()
  @IsString()
  @IsOptional()
  category?: string;

  @Field({nullable:true})
  @Field()
  @IsString()
  @IsOptional()
  status?: string;
}
