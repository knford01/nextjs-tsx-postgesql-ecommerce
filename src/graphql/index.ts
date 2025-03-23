import { mergeTypeDefs } from '@graphql-tools/merge';
import { mergeResolvers } from '@graphql-tools/merge';

import { typeDefs as inventoryTypeDefs } from './inventory/schema';
import { resolvers as inventoryResolvers } from './inventory/resolvers';

export const typeDefs = mergeTypeDefs([inventoryTypeDefs]);
export const resolvers = mergeResolvers([inventoryResolvers]);
