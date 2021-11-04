import { Artist } from "../models/artist.entity";
import { define } from "typeorm-seeding";
import * as Faker from "faker";
import { randomNumber } from "../utils/random-number";

define(Artist, (faker: typeof Faker) => {
  const firstName = faker.name.firstName().toLowerCase();
  const lastName = faker.name.lastName().toLowerCase();
  const username = `${firstName}.${lastName}${randomNumber(
    1,
    100
  )}`.toLowerCase();
  const email = faker.internet.email(firstName, lastName, "audionekt.com");
  const artist = new Artist();
  artist.firstName = firstName;
  artist.lastName = lastName;
  artist.email = email;
  artist.username = username;
  artist.password = "password";
  return artist;
});
