import express from "express";
import { graphqlHTTP } from "express-graphql";
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLID,
} from "graphql";
const authors = [
  { id: 1, name: "J. K. Rowling" },
  { id: 2, name: "J. R. R. Tolkien" },
  { id: 3, name: "Brent Weeks" },
];

const books = [
  { id: 1, name: "Harry Potter and the Chamber of Secrets", authorId: 1 },
  { id: 2, name: "Harry Potter and the Prisoner of Azkaban", authorId: 1 },
  { id: 3, name: "Harry Potter and the Goblet of Fire", authorId: 1 },
  { id: 4, name: "The Fellowship of the Ring", authorId: 2 },
  { id: 5, name: "The Two Towers", authorId: 2 },
  { id: 6, name: "The Return of the King", authorId: 2 },
  { id: 7, name: "The Way of Shadows", authorId: 3 },
  { id: 8, name: "Beyond the Shadows", authorId: 3 },
];
const app = express();

const AuthorType = new GraphQLObjectType({
  name: "authors",
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    book: {
      type: new GraphQLNonNull(new GraphQLList(BookType)),
      resolve: (authors) => {
        return books.filter((book) => authors.id === book.authorId);
      },
    },
  }),
});

const BookType = new GraphQLObjectType({
  name: "books",
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    authorId: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    author: {
      type: new GraphQLNonNull(AuthorType),
      resolve: (books) => {
        return authors.find((author) => author.id === books.authorId);
      },
    },
  }),
});

const rootQueryType = new GraphQLObjectType({
  name: "Query",
  fields: () => ({
    books: {
      type: new GraphQLList(BookType),
      resolve: () => books,
    },
    book: {
      type: BookType,
      args: {
        id: {
          type: GraphQLInt,
        },
      },
      resolve: (parent, args) => {
        return books.find((book) => book.id === args.id);
      },
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve: () => authors,
    },
    author: {
      type: AuthorType,
      args: {
        id: {
          type: GraphQLInt,
        },
      },
      resolve: (parent, args) => {
        return authors.find((author) => author.id === args.id);
      },
    },
  }),
});

const rootMutationType = new GraphQLObjectType({
  name: "mutation",
  fields: () => ({
    addBook: {
      type: BookType,
      args: {
        name: { type: GraphQLString },
        authorId: { type: GraphQLInt },
      },
      resolve: (parent, args) => {
        const newBook = {
          id: books.length + 1,
          name: args.name,
          authorId: args.author,
        };
        books.push(newBook);
        console.log(newBook);
        return newBook;
      },
    },
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: GraphQLString },
      },
      resolve: (parent, args) => {
        const newAuthor = {
          id: authors.length + 1,
          name: args.name,
        };
        authors.push(newAuthor);
        return newAuthor;
      },
    },
  }),
});

const schema = new GraphQLSchema({
  query: rootQueryType,
  mutation: rootMutationType,
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);
app.listen(4000, () => console.log("Now browse to localhost:4000/graphql"));
