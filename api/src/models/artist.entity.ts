import { Field, ObjectType } from "type-graphql";
import { Entity, Column, ManyToMany, JoinTable } from "typeorm";
import { Band } from "./band.entity";
import { User } from "./common.entity";

@ObjectType()
@Entity("artist")
export class Artist extends User {
  @Field(() => String)
  id: string;

  @Field(() => String)
  username: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  @Column("varchar", { length: 255 })
  firstName: string;

  @Field(() => String)
  @Column("varchar", { length: 255 })
  lastName: string;

  @Field(() => [Band])
  @ManyToMany(() => Band, (band) => band.members)
  bands: Promise<Band[]>;

  @Field(() => [Band])
  @ManyToMany(() => Band, (band) => band.fans)
  bands_following: Promise<Band[]>;

  @Field(() => [Artist])
  @ManyToMany(() => Artist, (artist) => artist.following)
  @JoinTable({ name: "artist-followers" })
  followers: Promise<Artist[]>;

  @Field(() => [Artist])
  @ManyToMany(() => Artist, (artist) => artist.followers)
  following: Promise<Artist[]>;
}
