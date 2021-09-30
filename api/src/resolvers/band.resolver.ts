import { Band } from "../models/band.entity";
import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { UserOptionsInput } from "./inputs/user-id.input";
import { BandOptionsInput } from "./inputs/band-id.input";
import { User } from "../models/user.entity";

@Resolver()
export class BandResolver {
  @Query(() => [Band])
  async bands(): Promise<Band[]> {
    return await Band.find();
  }

  @Query(() => Band)
  async band(@Arg("id") id: string): Promise<Band> {
    return await Band.findOneOrFail(id);
  }

  @Mutation(() => User)
  async addUserToBand(
    @Arg("userOptions") userOptions: UserOptionsInput,
    @Arg("bandOptions") bandOptions: BandOptionsInput
  ): Promise<User | string> {
    let user = await User.findOneOrFail(userOptions);
    let band = await Band.findOneOrFail(bandOptions);

    if (user) {
      user.bands = Promise.resolve([...(await user.bands), band]);
      await User.save(user);
      return user;
    }

    return "failed to run query";
  }
}
