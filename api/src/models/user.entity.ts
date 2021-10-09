import { Field, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryColumn,
  Column,
  BeforeInsert,
  BaseEntity,
  ManyToMany,
} from "typeorm";
import { v4 as uuid_v4 } from "uuid";
import { Band } from "./band.entity";
import argon2 from "argon2";

@ObjectType()
@Entity("users")
export class User extends BaseEntity {
  @Field(() => String)
  @PrimaryColumn("uuid")
  id: string;

  @Field(() => String)
  @Column("varchar", { length: 255 })
  firstName: string;

  @Field(() => String)
  @Column("varchar", { length: 255 })
  lastName: string;

  @Field(() => String)
  @Column("varchar", { length: 255, unique: true })
  email: string;

  @Field(() => String)
  @Column("varchar", { length: 255, unique: true })
  username: string;

  @Column("text") password: string;

  @Field(() => [Band])
  @ManyToMany(() => Band, (band) => band.users)
  bands: Promise<Band[]>;

  @BeforeInsert()
  async alterUserInstance() {
    this.id = uuid_v4();
    this.password = await argon2.hash("password").then((hash) => hash);
  }
}
