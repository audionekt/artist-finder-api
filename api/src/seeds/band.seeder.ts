import { Factory, Seeder } from "typeorm-seeding";
import { Band } from "../models/band.entity";

export default class CreateBands implements Seeder {
  public async run(factory: Factory): Promise<void> {
    await factory(Band)({ roles: [] }).createMany(10);
  }
}
