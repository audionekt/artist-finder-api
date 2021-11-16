import { Artist } from "../models/artist.entity";
import { define } from "typeorm-seeding";
import * as Faker from "faker";
import { randomNumber } from "../utils/random-number";
import { Point } from "geojson";

function getRandomInRange(from: any, to: any, fixed: any) {
  return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
}

define(Artist, (faker: typeof Faker) => {
  const firstName = faker.name.firstName().toLowerCase();
  const lastName = faker.name.lastName().toLowerCase();
  const username = `${firstName}.${lastName}${randomNumber(
    1,
    100
  )}`.toLowerCase();
  const bio = `Check out my newest track! follow me @${username}, you won't be dissapointed. Feel free to reach out!`;
  const email = faker.internet.email(firstName, lastName, "audionekt.com");
  const artist = new Artist();
  const location: Point = {
    type: "Point",
    coordinates: [
      getRandomInRange(-180, 180, 3),
      getRandomInRange(-180, 180, 3),
    ],
  };
  artist.firstName = firstName;
  artist.bio = bio;
  artist.lastName = lastName;
  artist.email = email;
  artist.username = username;
  artist.geometry = location;
  artist.password = "password";
  return artist;
});
