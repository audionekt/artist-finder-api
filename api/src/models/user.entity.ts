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
  bands?: Band[];

  @BeforeInsert()
  addId() {
    this.id = uuid_v4();
  }
}
