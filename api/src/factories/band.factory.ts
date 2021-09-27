import { Band } from "../models/band.entity";
import { define } from "typeorm-seeding";
import * as Faker from "faker";

define(Band, (faker: typeof Faker) => {
  const name = (faker.commerce.color() + faker.random.word())
    .split(" ")
    .join("");
  const username = name + faker.random.number(420);

  const band = new Band();
  band.name = name;
  band.username = username;
  band.password = "password";
  return band;
});
