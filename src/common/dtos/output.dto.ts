import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CoreOutput {
  @Field((returns) => String, { nullable: true })
  error?: string;
  @Field((returns) => Boolean)
  ok: boolean;
}
