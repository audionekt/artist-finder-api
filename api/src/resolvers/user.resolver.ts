import { User } from "../models/user.entity";
import { Resolver, Query, Mutation, Arg, Ctx } from "type-graphql";
import { UserInput } from "./inputs/user.input";
import { getConnection } from "typeorm";
import argon2 from "argon2";
import { validate_register_dto } from "../utils/register.validation";
import { UserResponse } from "../types/type-graphql/userResponse.type";
import { MyContext } from "../types/context.type";

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

  @Query(() => User, { nullable: true })
  me(@Ctx() { ctx }: MyContext) {
    // console.log("redis", redis);

    return User.findOne({ id: ctx.session.userId });
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

  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { ctx }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne(
      usernameOrEmail.includes("@")
        ? { where: { email: usernameOrEmail } }
        : { where: { username: usernameOrEmail } }
    );
    if (!user) {
      return {
        errors: [
          {
            field: "usernameOrEmail",
            message: "username doesn't exist",
          },
        ],
      };
    }
    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "password incorrect",
          },
        ],
      };
    }

    ctx.session.userId = user.id

    return {
      user,
    };
  }
}
