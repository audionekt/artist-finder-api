import { User } from "../models/user.entity";
import { Resolver, Query, Mutation, Arg, Ctx } from "type-graphql";
import { UserInput } from "./inputs/user.input";
import { getConnection } from "typeorm";
import argon2 from "argon2";
import { validate_register_dto } from "../utils/register.validation";
import { UserResponse } from "../types/type-graphql/userResponse.type";
import { MyContext } from "../types/context.type";
import { v4 as uuid_v4 } from "uuid";
import { Band } from "../models/band.entity";

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
      if (err.code === "23505") {
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

    ctx.session.userId = user.id;

    return {
      user,
    };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { ctx }: any) {
    return new Promise((resolve) => {
      ctx.session = null;
      resolve(true);
    });
  }

  @Mutation(() => UserResponse)
  async followUser(
    @Arg("userId") userId: string,
    @Ctx() { ctx }: any
  ): Promise<UserResponse> {
    const me = await User.findOne({ id: ctx.session.userId });
    const userToFollow = await User.findOne({ id: userId });

    if (!me) {
      return {
        errors: [
          {
            field: "id",
            message: "you need to be logged in to follow people",
          },
        ],
      };
    }
    
    if (!userToFollow) {
      return {
        errors: [
          {
            field: "id",
            message: "the user you're trying to follow doesn't exist",
          },
        ],
      };
    }

    if (me.id === userId) {
      return {
        errors: [
          {
            field: "id",
            message: "you can't follow yourself",
          },
        ],
      };
    }

    me.following = Promise.resolve([...(await me.following), userToFollow]);
    await User.save(me);

    return {
      user: me,
    };
  }

  @Mutation(() => UserResponse)
  async followBand(
    @Arg("bandId") bandId: string,
    @Ctx() { ctx }: any
  ): Promise<UserResponse> {
    const me = await User.findOne({ id: ctx.session.userId });
    const bandToFollow = await Band.findOneOrFail({ id: bandId });

    if (!me) {
      return {
        errors: [
          {
            field: "id",
            message: "you need to be logged in to follow bands",
          },
        ],
      };
    }

    me.bands_following = Promise.resolve([
      ...(await me.bands_following),
      bandToFollow,
    ]);
    await User.save(me);

    return {
      user: me,
    };
  }
}
