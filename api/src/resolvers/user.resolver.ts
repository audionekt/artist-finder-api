import { User } from "../models/user.entity";
import { Resolver, Query } from "type-graphql";

@Resolver()
export class UserResolver {
  @Query(() => [User])
  async users(): Promise<User[]> {
    return await User.find();
  }
}
