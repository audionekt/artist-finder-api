import { User } from "../models/user.entity";

export const UsersResolver = {
  Query: {
    users: () => User.find(),
  },
};
