import 'reflect-metadata';
import 'module-alias/register';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { buildSchema } from 'type-graphql';
import { dbConnect, createUser } from '@config/index';
import { RecipeResolver } from '@resolver/index';
import http from 'http';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';

const start = async () => {
  const app = express();

  const httpServer = http.createServer(app);

  const schema = await buildSchema({ resolvers: [RecipeResolver] });

  const apolloServer = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({ app });

  await dbConnect();

  // await createUser();

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:4000${apolloServer.graphqlPath}`);
};
start();
