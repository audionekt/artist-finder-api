import { Band } from "../models/band.entity";
import { define } from "typeorm-seeding";
import * as Faker from "faker";
import { randomNumber } from "../utils/random-number";

define(Band, (faker: typeof Faker) => {
  const name = (faker.commerce.color() + faker.random.word())
    .split(" ")
    .join("")
    .toLowerCase();
  const username = name + randomNumber(0, 100);

  const band = new Band();
  band.name = name;
  band.username = username;
  band.password = "password";
  return band;
});
