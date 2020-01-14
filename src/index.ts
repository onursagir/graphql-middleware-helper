import minimatch from 'minimatch';

type Resolver = Record<string, Object>

type NestedResolver = Resolver | Record<string, Resolver>

interface Arguments {
  resolvers: NestedResolver | NestedResolver[],
  middleware: Function,
}

interface ArgumentsWithExclude extends Arguments {
  include?: string[];
  exclude?: never;
}

interface ArgumentsWithInclude extends Arguments {
  include?: never;
  exclude?: string[];
}

type MiddlewareHelperArguments = ArgumentsWithExclude | ArgumentsWithInclude

interface MakeMiddleWareArguments extends Omit<MiddlewareHelperArguments, 'resolvers'> {
  path: string[]
  resolver: Object
}

interface MakeMiddleWare {
  (args: MakeMiddleWareArguments): Object
}

interface MiddlewareHelper {
  (args: MiddlewareHelperArguments): Object
}

const makeMiddleware: MakeMiddleWare = (args) => {
  const {
    resolver, path, middleware, include, exclude,
  } = args;

  return Object.entries(resolver).reduce((acc, [key, value]) => {
    let shouldApplyMiddleware = false;
    const currentPath = [...path, key].join('/');
    // Neither the include or exclude option is set so we apply middleware to everything
    if (!exclude && !include) {
      shouldApplyMiddleware = true;
    } else {
      shouldApplyMiddleware = exclude
        ? exclude?.every((pattern) => !minimatch(currentPath, pattern))
        : !!include?.some((pattern) => minimatch(currentPath, pattern));
    }

    if (!shouldApplyMiddleware) return acc;

    return {
      ...acc,
      [key]: typeof value === 'object' ? makeMiddleware({ ...args, resolver: value, path: [...path, key] }) : middleware,
    };
  }, {});
};

const middlewareHelper: MiddlewareHelper = (args) => {
  const resolversArray = Array.isArray(args.resolvers) ? args.resolvers : [args.resolvers];

  return resolversArray.reduce((accA, resolver) => {
    const resolverWithMiddleware = Object.entries(resolver).reduce((accB, [key, value]) => ({
      ...accB,
      [key]: makeMiddleware({ ...args, resolver: value, path: [key] }),
    }), {});

    return {
      ...accA,
      ...resolverWithMiddleware,
    };
  }, {});
};

export default middlewareHelper;
