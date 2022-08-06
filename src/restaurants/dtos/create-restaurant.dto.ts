import { ArgsType, Field } from '@nestjs/graphql';
import { IsBoolean, IsString, Length } from 'class-validator';

@ArgsType()
export class CreateRestaurantDto {
  @Field((is) => String)
  @IsString()
  @Length(5, 10)
  name: string;

  @Field((is) => Boolean)
  @IsBoolean()
  isVegan: boolean;

  @Field((is) => String)
  @IsString()
  address: string;

  @Field((is) => String)
  @IsString()
  ownerName: string;
}
