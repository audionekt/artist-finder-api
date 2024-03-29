import { Field, ObjectType } from "type-graphql";
import { Entity, ManyToMany, JoinTable } from "typeorm";
import { Artist } from "./artist.entity";
import { User } from "./common.entity";

@ObjectType()
@Entity("band")
export class Band extends User {
  /* Extended */
  @Field(() => String)
  id: string;
  @Field(() => String)
  username: string;
  @Field(() => String)
  email: string;
  @Field(() => String)
  bio: string;

  /* References */
  @Field(() => [Artist])
  @ManyToMany(() => Artist, (artist) => artist.bands, {
    cascade: true,
  })
  @JoinTable({ name: "band_members" })
  members: Promise<Artist[]>;

  @Field(() => [Artist])
  @ManyToMany(() => Artist, (artist) => artist.bands_following, {
    cascade: true,
  })
  @JoinTable({ name: "band_fans" })
  fans: Promise<Artist[]>;
}
