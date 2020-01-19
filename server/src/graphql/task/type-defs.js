const typeDefs = `
  type Task {
    _id: ID!
    title: String!
    priority: Int!
    userId: ID!
    expiresAt: String!
    createdAt: String!
  }

  input TaskInput {
    title: String!
    priority: Int!
    expiresAt: String!
  }

  type Query {
    tasks: [Task]
  }

  type Mutation {
    createTask(task: TaskInput!): Task!
  }
`;

module.exports = typeDefs;
