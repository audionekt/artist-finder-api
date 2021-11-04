import { InputType, Field } from "type-graphql";

@InputType()
export class ArtistOptionsInput {
  @Field()
  id: string;
}
