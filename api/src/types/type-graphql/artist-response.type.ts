import { Artist } from "../../models/artist.entity";
import { Field, ObjectType } from "type-graphql";
import { FieldError } from "./fieldError.type";

@ObjectType()
export class ArtistResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Artist, { nullable: true })
  artist?: Artist;
}
