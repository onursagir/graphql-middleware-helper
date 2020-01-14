# graphQL-middleware-helper

A small helper that prevents you from having to type this

```js
const authMiddleWare = {
  Query: {
    books: isAuthed,
    todos: isAuthed,
    someOtherResolver: isAuthed,
  },
  Me: isAuthed,
}
```

And instead lets u do this

```js
// Will apply middleware to all resolvers
const authMiddleWare = middlewareHelper({ resolvers: yourResolvers, middleware: () => {} })

// Will apply middleware to all resolvers except all Mutation resolvers
const authMiddleWare = middlewareHelper({ resolvers: yourResolvers, middleware: () => {}, exclude: ['Mutation/*'] })

// Will only apple middleware to the Query -> book and Query -> todos resolvers
const authMiddleWare = middlewareHelper({ resolvers: yourResolvers, middleware: () => {}, include: ['Query/books', 'Query/todos'] })
```

## Install

```sh
yarn add graphql-middleware-helper
```
```sh
npm install --save graphql-middleware-helper
```