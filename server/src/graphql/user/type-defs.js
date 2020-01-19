const typeDefs = `
  type User {
    _id: ID!
    createdAt: Date!
    email: String!
    password: String!
    name: String
  }

  input UserInput {
    email: String!
    password: String!
    name: String!
  }

  type AuthToken {
    _id: ID!
    token: String!
  }
  
   type UserAuth {
    _id: ID!
    email: String!
    createdAt: String,
    token: String!
  }

  type Query {
    user: User
  }

  type Mutation {
    signup(user: UserInput!): UserAuth!
    login(email: String!, password: String!): AuthToken!
  }
`;

module.exports = typeDefs;
