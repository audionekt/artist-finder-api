import { Band } from "../models/band.entity";
import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { Artist } from "../models/artist.entity";
import { ArtistResponse } from "../types/type-graphql/artist-response.type";

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

  @Mutation(() => ArtistResponse)
  async addArtistToBand(
    @Arg("artistId") artistId: string,
    @Arg("bandId") bandId: string
  ): Promise<ArtistResponse> {
    let artist = await Artist.findOne({ id: artistId });
    let band = await Band.findOneOrFail({ id: bandId });

    if (!artist) {
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

    artist.bands = Promise.resolve([...(await artist.bands), band]);
    await Artist.save(artist);

    return {
      artist,
    };
  }
}
