import { Band } from "../models/band.entity";
import { define } from "typeorm-seeding";
import * as Faker from "faker";
import { randomNumber } from "../utils/random-number";

define(Band, (faker: typeof Faker) => {
  const username =
    (faker.commerce.color() + faker.random.word())
      .split(" ")
      .join("")
      .toLowerCase() + randomNumber(0, 100);
  const email = faker.internet.email(username, "audionekt.com");
  const band = new Band();
  band.bio = `Hey! Just a cool band lookin to make friends in the area :)`
  band.username = username;
  band.email = email;
  band.password = "password";
  return band;
});
