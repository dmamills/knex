/* eslint no-console:0 */

const {
  isFunction,
  isUndefined,
  isPlainObject,
  isArray,
  isTypedArray,
} = require('lodash');
const { CLIENT_ALIASES } = require('./constants');

// Check if the first argument is an array, otherwise uses all arguments as an
// array.

function normalizeArr() {
  const args = new Array(arguments.length);
  for (let i = 0; i < args.length; i++) {
    args[i] = arguments[i];
  }
  if (Array.isArray(args[0])) {
    return args[0];
  }
  return args;
}

function containsUndefined(mixed) {
  let argContainsUndefined = false;

  if (isTypedArray(mixed)) return false;

  if (mixed && isFunction(mixed.toSQL)) {
    //Any QueryBuilder or Raw will automatically be validated during compile.
    return argContainsUndefined;
  }

  if (isArray(mixed)) {
    for (let i = 0; i < mixed.length; i++) {
      if (argContainsUndefined) break;
      argContainsUndefined = this.containsUndefined(mixed[i]);
    }
  } else if (isPlainObject(mixed)) {
    Object.keys(mixed).forEach((key) => {
      if (!argContainsUndefined) {
        argContainsUndefined = this.containsUndefined(mixed[key]);
      }
    });
  } else {
    argContainsUndefined = isUndefined(mixed);
  }

  return argContainsUndefined;
}

function addQueryContext(Target) {
  // Stores or returns (if called with no arguments) context passed to
  // wrapIdentifier and postProcessResponse hooks
  Target.prototype.queryContext = function(context) {
    if (isUndefined(context)) {
      return this._queryContext;
    }
    this._queryContext = context;
    return this;
  };
}

function resolveClientNameWithAliases(clientName) {
  return CLIENT_ALIASES[clientName] || clientName;
}

module.exports = {
  addQueryContext,
  containsUndefined,
  normalizeArr,
  resolveClientNameWithAliases,
};
