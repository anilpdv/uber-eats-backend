import { Field, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsString, Length } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn()
  @Field((is) => Number)
  id: number;

  @Field((is) => String)
  @Column()
  @IsString()
  @Length(5)
  name: string;

  @Field((is) => Boolean)
  @Column()
  @IsBoolean()
  isVegan: boolean;

  @Field((is) => String)
  @Column()
  @IsString()
  address: string;

  @Field((is) => String)
  @Column()
  @IsString()
  ownerName: string;
}
