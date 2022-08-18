import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn()
  @Field((is) => Number)
  id: number;

  @Field((is) => String)
  @Column()
  name: string;

  @Field((is) => Boolean)
  @Column()
  isVegan: boolean;

  @Field((is) => String)
  @Column()
  address: string;

  @Field((is) => String)
  @Column()
  ownerName: string;
}
