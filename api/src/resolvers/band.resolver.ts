import { Band } from "../models/band.entity";
import { Resolver, Query } from "type-graphql";

@Resolver()
export class BandResolver {
  @Query(() => [Band])
  async bands(): Promise<Band[]> {
    return await Band.find();
  }
}
