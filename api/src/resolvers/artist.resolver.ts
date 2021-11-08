import { Artist } from "../models/artist.entity";
import { Resolver, Query, Mutation, Arg, Ctx } from "type-graphql";
import { ArtistInput } from "./inputs/artist.input";
import { getConnection } from "typeorm";
import argon2 from "argon2";
import { validate_register_dto } from "../utils/register.validation";
import { ArtistResponse } from "../types/type-graphql/artist-response.type";
import { MyContext } from "../types/context.type";
import { v4 as uuid_v4 } from "uuid";
import { Band } from "../models/band.entity";

@Resolver()
export class ArtistResolver {
  @Query(() => [Artist])
  async artists(): Promise<Artist[]> {
    return await Artist.find();
  }

  @Query(() => Artist)
  async artist(@Arg("id") id: string): Promise<Artist> {
    return await Artist.findOneOrFail(id);
  }

  @Query(() => Artist, { nullable: true })
  me(@Ctx() { ctx }: MyContext) {
    return Artist.findOne({ id: ctx.session.artistId });
  }

  @Mutation(() => ArtistResponse)
  async register(
    @Arg("options") options: ArtistInput
  ): Promise<ArtistResponse> {
    const errors = validate_register_dto(options);
    if (errors) {
      return { errors };
    }

    const hashedPassword = await argon2.hash(options.password);
    let artist;
    try {
      const result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Artist)
        .values({
          id: uuid_v4(),
          bio: options.bio,
          email: options.email,
          username: options.username,
          firstName: options.firstName,
          lastName: options.lastName,
          password: hashedPassword,
        })
        .returning("*")
        .execute();
      artist = result.raw[0];
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
    return { artist };
  }

  @Mutation(() => ArtistResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { ctx }: MyContext
  ): Promise<ArtistResponse> {
    const artist = await Artist.findOne(
      usernameOrEmail.includes("@")
        ? { where: { email: usernameOrEmail } }
        : { where: { username: usernameOrEmail } }
    );
    if (!artist) {
      return {
        errors: [
          {
            field: "usernameOrEmail",
            message: "username doesn't exist",
          },
        ],
      };
    }
    const valid = await argon2.verify(artist.password, password);
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

    ctx.session.artistId = artist.id;

    return {
      artist,
    };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { ctx }: any) {
    return new Promise((resolve) => {
      ctx.session = null;
      resolve(true);
    });
  }

  @Mutation(() => ArtistResponse)
  async followArtist(
    @Arg("artistId") artistId: string,
    @Ctx() { ctx }: any
  ): Promise<ArtistResponse> {
    const me = await Artist.findOne({ id: ctx.session.artistId });
    const artistToFollow = await Artist.findOne({ id: artistId });

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

    if (!artistToFollow) {
      return {
        errors: [
          {
            field: "id",
            message: "the artist you're trying to follow doesn't exist",
          },
        ],
      };
    }

    if (me.id === artistId) {
      return {
        errors: [
          {
            field: "id",
            message: "you can't follow yourself",
          },
        ],
      };
    }

    me.following = Promise.resolve([...(await me.following), artistToFollow]);
    await Artist.save(me);

    return {
      artist: me,
    };
  }

  @Mutation(() => ArtistResponse)
  async followBand(
    @Arg("bandId") bandId: string,
    @Ctx() { ctx }: any
  ): Promise<ArtistResponse> {
    const me = await Artist.findOne({ id: ctx.session.artistId });
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
    await Artist.save(me);

    return {
      artist: me,
    };
  }
}
