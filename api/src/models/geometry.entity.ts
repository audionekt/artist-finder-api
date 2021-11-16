import { Field, Float, ObjectType } from "type-graphql";

@ObjectType()
export class Geometry {
  @Field(() => String)
  type: string;

  @Field(() => [Float])
  coordinates: number[];
}
