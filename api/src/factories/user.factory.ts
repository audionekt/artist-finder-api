import { User } from "../models/user.entity";
import { define } from "typeorm-seeding";
import * as Faker from "faker";
import { randomNumber } from "../utils/random-number";

define(User, (faker: typeof Faker) => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const username = `${firstName}.${lastName}${randomNumber(
    1,
    100
  )}`.toLowerCase();
  const email = faker.internet.email(firstName, lastName, "audionekt.com");

  const user = new User();
  user.firstName = firstName;
  user.lastName = lastName;
  user.email = email;
  user.username = username;
  user.password = "password";
  return user;
});
