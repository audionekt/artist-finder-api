import { Band } from "../models/band.entity";
import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { User } from "../models/user.entity";
import { UserResponse } from "../types/type-graphql/userResponse.type";

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

  @Mutation(() => UserResponse)
  async addUserToBand(
    @Arg("userId") userId: string,
    @Arg("bandId") bandId: string
  ): Promise<UserResponse> {
    let user = await User.findOne({ id: userId });
    let band = await Band.findOneOrFail({ id: bandId });

    if (!user) {
      return {
        errors: [
          {
            field: "id",
            message:
              "something's up, check both id's and make sure the instances exist.",
          },
        ],
      };
    }

    user.bands = Promise.resolve([...(await user.bands), band]);
    await User.save(user);

    return {
      user,
    };
  }
}
