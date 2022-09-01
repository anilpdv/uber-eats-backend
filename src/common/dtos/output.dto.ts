import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MutationOutput {
  @Field((returns) => String, { nullable: true })
  error?: string;
  @Field((returns) => Boolean)
  ok: boolean;
}
