/* 
    these are common fields shared between entities.
    extend these classes to avoid duplicate code:
 */

import { v4 as uuid_v4 } from "uuid";
import argon2 from "argon2";
import { BaseEntity, BeforeInsert, Column, PrimaryColumn } from "typeorm";

export abstract class User extends BaseEntity {
  @PrimaryColumn("uuid")
  id: string;

  @Column("varchar", { length: 255, unique: true })
  username: string;

  @Column("text") password: string;

  @Column("varchar", { length: 255, unique: true })
  email: string;

  @Column("varchar", { length: 150 })
  bio: string;

  @BeforeInsert()
  async alterArtistInstance() {
    this.id = uuid_v4();
    this.password = await argon2.hash("password").then((hash) => hash);
  }
}
