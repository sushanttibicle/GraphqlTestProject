// server.js
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');
// Replace these with your PostgreSQL database credentials
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'graphqlTest',
  password: '112233',
  port: 5432, // default PostgreSQL port
});

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
  }

  type Query {
    hello: String
  }

  type Mutation {
    signup(username: String!, email: String!, password: String!): User
  }
`;

const resolvers = {
    Query: {
      hello: () => 'Hello, GraphQL!',
    },
    Mutation: {
      signup: async (parent, args) => {
        const client = await pool.connect();
        try {
          // In a real-world scenario, you would hash the password and insert into the database
          const result = await client.query(
            'INSERT INTO users(username, email, password, id) VALUES($1, $2, $3, $4) RETURNING *',
            [args.username, args.email, args.password, uuidv4()] // Using uuidv4() for generating a unique ID
          );
  
          // For simplicity, we're just returning the inserted user
          return result.rows[0];
        } finally {
          client.release();
        }
      },
    },
  };

async function startApolloServer() {
  const server = new ApolloServer({ typeDefs, resolvers });

  await server.start();

  const app = express();
  server.applyMiddleware({ app });

  const PORT = 8000;
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startApolloServer();
