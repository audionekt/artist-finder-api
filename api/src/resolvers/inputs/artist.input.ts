import { InputType, Field } from "type-graphql";

@InputType()
export class ArtistInput {
  @Field()
  email: string;
  @Field()
  bio: string;
  @Field()
  username: string;
  @Field()
  firstName: string;
  @Field()
  lastName: string;
  @Field()
  password: string;
}
