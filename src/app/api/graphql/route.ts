import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { typeDefs, resolvers } from '@/graphql';
import { NextRequest } from 'next/server';

interface MyContext { }

const server = new ApolloServer<MyContext>({
    typeDefs,
    resolvers,
});

const handler = startServerAndCreateNextHandler<NextRequest, MyContext>(server);

export async function GET(request: NextRequest) {
    return handler(request);
}

export async function POST(request: NextRequest) {
    return handler(request);
}
