import { gql } from "apollo-server-koa";

export const UsersTypeDef = gql`
  type User {
    id: String
    firstName: String
    lastName: String
    email: String
    password: String
  }
  type Query {
    users: [User]
  }
`;
