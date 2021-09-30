import { InputType, Field } from "type-graphql";

@InputType()
export class BandOptionsInput {
  @Field()
  id: string;
}
