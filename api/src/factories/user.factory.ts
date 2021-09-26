import { User } from "../models/user.entity";
import { define } from "typeorm-seeding";
import * as Faker from "faker";

define(User, (faker: typeof Faker) => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const email = faker.internet.email(firstName, lastName, "audionekt.com");

  const user = new User();
  user.firstName = firstName;
  user.lastName = lastName;
  user.email = email;
  user.password = "password";
  return user;
});
