import { InputType, Field } from "type-graphql";

@InputType()
export class UserInput {
  @Field()
  email: string;
  @Field()
  firstName: string;
  @Field()
  lastName: string;
  @Field()
  password: string;
}
