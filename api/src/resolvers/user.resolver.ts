import { User } from "../models/user.entity";
import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { UserInput } from "./inputs/user.input";
import { getConnection } from "typeorm";
import argon2 from "argon2";
import { validate_register_dto } from "../utils/register.validation";
import { v4 as uuid_v4 } from "uuid";
import { UserResponse } from "../types/userResponse.type";

@Resolver()
export class UserResolver {
  @Query(() => [User])
  async users(): Promise<User[]> {
    return await User.find();
  }

  @Query(() => User)
  async user(@Arg("id") id: string): Promise<User> {
    return await User.findOneOrFail(id);
  }

  @Mutation(() => UserResponse)
  async register(@Arg("options") options: UserInput): Promise<UserResponse> {
    const errors = validate_register_dto(options);
    if (errors) {
      return { errors };
    }

    const hashedPassword = await argon2.hash(options.password);
    let user;
    try {
      const result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({
          id: uuid_v4(),
          email: options.email,
          username: options.username,
          firstName: options.firstName,
          lastName: options.lastName,
          password: hashedPassword,
        })
        .returning("*")
        .execute();
      user = result.raw[0];
    } catch (err) {
      if (err.code === "23505" || err.detail.includes("already exists")) {
        return {
          errors: [
            {
              field: "email",
              message: "that email is already taken.",
            },
          ],
        };
      }
    }
    return { user };
  }
}
