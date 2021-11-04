import { Factory, Seeder } from "typeorm-seeding";
import { Artist } from "../models/artist.entity";

export default class CreateArtists implements Seeder {
  public async run(factory: Factory): Promise<void> {
    await factory(Artist)({ roles: [] }).createMany(10);
  }
}
