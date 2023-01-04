import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { BooksDataSource } from './datasources.js';
// Here we import the automatically generated Book type, so we can use it in our
// context typing.
import { Book } from './__generated__/resolvers-types';
import resolvers from './resolvers/index.js';
import { readFileSync } from 'fs';

// Note: this only works locally because it relies on `npm` routing
// from the root directory of the project.
const typeDefs = readFileSync('./src/schema/schema.graphql', { encoding: 'utf-8' });

console.log("trtt", typeDefs)
export interface MyContext {
  dataSources: {
    booksAPI: BooksDataSource;
  };
}

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer<MyContext>({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  context: async () => {
    return {
      // We are using a static data set for this example, but normally
      // this would be where you'd add your data source connections
      // or your REST API classes.
      dataSources: {
        booksAPI: new BooksDataSource(),
      },
    };
  },
});

console.log(`🚀 Server listening at: ${url}`);
