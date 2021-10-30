import { User } from "../../models/user.entity";
import { Field, ObjectType } from "type-graphql";
import { FieldError } from "./fieldError.type";

@ObjectType()
export class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}
