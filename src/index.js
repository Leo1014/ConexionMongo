const { ApolloServer, gql } = require('apollo-server');
const dotenv=require("dotenv")
dotenv.config();
const { MongoClient } = require('mongodb');
const {DB_URI, DB_NAME} =process.env;
const bcrypt = require("bcryptjs")

const resolvers = {
    Query: {
        misProyectos:()=>[]
    },

Mutation:{
    signUp:async(root, {input}, {db} )=>{
        const hashedPassword= bcrypt.hashSync(input.password)
        const newUser= {
            ...input,
            password:hashedPassword
        }
    const result= await db.collection("user").insertOne(newUser);
    const user=result.ops[0]
    return {
        user,
        token:"token",
    }
    
}
},
user:{
  id:(root)=>{
      return root.id;
  }
}
}


const typeDefs = gql`

type Query {
    misProyectos:[proyectos!]!
}
    

type user{
    id:ID!
    mail:String!
    identification:String!
    name:String!
    password:String!
    rol:String!

}

type proyectos{
    id:ID!
    nombre:String!
    objGeneral:String!
    objEspecificos: String!
    presupuesto: String!
    fechInicio: String!
    fecchFinal: String!
    user:[user!]!
}

type Mutation{
 signUp(input:SignUpInput):AuthUser!   
}

input SignUpInput{
    mail:String!
    identification:String!
    name:String!
    password:String!
    rol:String!
}

type AuthUser{
    user:user!
    token:String!
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
