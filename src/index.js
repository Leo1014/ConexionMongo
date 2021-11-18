const { ApolloServer, gql } = require('apollo-server');
const dotenv=require("dotenv")
dotenv.config();
const { MongoClient } = require('mongodb');
const {DB_URI, DB_NAME} =process.env;

const resolvers = {
    Query: {
        misProyectos:()=>[]
    },
}



const typeDefs = gql`

type Query {
    misProyectos:[proyectos!]!
}
    

type user{
    id:ID!
    rol:String!
    user: [user!]!
}

type proyectos{
    id:ID!
    presupuesto: String!
    user:[user!]!
}

`;

  
const start= async()=>{
    const client = new MongoClient(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const db = client.db(DB_NAME)  
    
    const context = {
        db,
    }

const server = new ApolloServer({ typeDefs, resolvers, context  });

    server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
    });
}

start();
