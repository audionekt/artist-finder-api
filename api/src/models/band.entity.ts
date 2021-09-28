import { Field, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryColumn,
  Column,
  BeforeInsert,
  BaseEntity,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { v4 as uuid_v4 } from "uuid";
import { User } from "./user.entity";

@ObjectType()
@Entity("bands")
export class Band extends BaseEntity {
  @Field(() => String)
  @PrimaryColumn("uuid")
  id: string;

  @Field(() => String)
  @Column("varchar", { length: 255 })
  name: string;

  @Field(() => String)
  @Column("varchar", { length: 255, unique: true })
  username: string;

  @Column("text") password: string;

  @Field(() => [User])
  @ManyToMany(() => User, (user) => user.bands, { cascade: true })
  @JoinTable({ name: "bands-users" })
  users: User[];

  @BeforeInsert()
  addId() {
    this.id = uuid_v4();
  }
}
