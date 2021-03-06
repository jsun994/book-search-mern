const express = require('express');
const {ApolloServer} = require('apollo-server-express');
const path = require('path');
const mongoose = require("mongoose");
const db = require('./config/connection');
const {typeDefs, resolvers} = require('./schemas');
const {authMiddleware} = require('./utils/auth');

const PORT = process.env.PORT || 3001;
const app = express();

const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware
  });
  await server.start();
  server.applyMiddleware({ app });
  console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
};

mongoose.connection.dropDatabase();

startServer()

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//serve up static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});