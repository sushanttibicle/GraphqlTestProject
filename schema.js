// schema.js
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLSchema, GraphQLNonNull } = require('graphql');

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLID },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
  },
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    // Add a placeholder query
    hello: {
      type: GraphQLString,
      resolve() {
        return 'Hello, GraphQL!';
      },
    },
    login:{
        type: GraphQLString,
        resolve() {
          return 'Login Success';
        }, 
    }
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    signup: {
      type: UserType,
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        // In a real-world scenario, you would handle the signup logic here
        // For simplicity, we're just returning the input as a new user
        return {
          id: '1',
          username: args.username,
          email: args.email,
        };
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
