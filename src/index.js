const { ApolloServer, gql } = require('apollo-server');
const { MongoClient, ObjectId } = require('mongodb');
const dotenv=require("dotenv")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
dotenv.config();

const {DB_URI, DB_NAME, JWT_SECRET} =process.env;
const getToken=(user)=>jwt.sign({id:user.id}, JWT_SECRET, {expiresIn:"30 days"});
const getUserFromToken= async(token, db)=>{
    
    //if(!token){return "Ok"}
    
    const tokenData= jwt.verify(token, JWT_SECRET);
    return await db.collection("user").findOne({_id:ObjectId(tokenData.id)});
}


const resolvers = {
    
    Query:{
        myProjectList: async (_, __, {db, user}) =>{
            if(!user){console.log("No esta autenticado please start sesion")}
            return await db.collection("ProjectList")
                                        .find({userIds: user._id})
                                        .toArray();
        },
    },

  
//mutaciones
Mutation:{
    signUp:async(root, {input}, {db} )=>{
        const hashedPassword= bcrypt.hashSync(input.password)
        const newUser= {
            ...input,
            password:hashedPassword
        }
    const result= await db.collection("user").insertOne(newUser);
    
    return {
        user:newUser,
        token:getToken(newUser),
    }
      
},

signIn:async(root, {input}, {db} )=>{
        const user= await db.collection("user").findOne({mail:input.mail});
        const isPasswordCorrect = user && bcrypt.compareSync(input.password, user.password)
        
        if (!user || !isPasswordCorrect){
            throw new Error("cerdenciales incorrectas");
        }
        
        return {  
        user,
        token:getToken(user),
        }
    },

createProjectList: async(root, {title}, {db,user})=>{
    if(!user){console.log("No esta autentica please start sesion")}

    const newProjectList = {
        title,
        createdAt: new Date().toISOString(),
        userIds: [user._id]
    }
    const result=await db.collection("ProjectList").insertOne(newProjectList);
    return newProjectList
},

updateProjectList: async(_, {id, title}, {db, user}) =>{
    if(!user){console.log("no esta autenticado")}

    const resul=await db.collection("ProjectList")
                        .updateOne({_id:ObjectId(id)},
                    {
                        $set:{title}
                    }                    
    )
return await db.collection("ProjectList").findOne({_id:ObjectId(id)})
},

deleteProjectList: async(_, {id}, {db, user}) =>{
    if(!user){console.log("no esta autenticado")}
    await db.collection("ProjectList").remove({_id:ObjectId(id)})
    return true;       
}
},



//parametro inmutable
user:{
  id:(root)=>{
      return root._id;
  }
 },

 ProjectList:{
    id:(root)=>{
        return root._id;
    },
    progress:()=>30,
   
   users: async ({userIds}, _, {db})=>Promise.all(
            userIds.map((userId) =>(
                db.collection("user").findOne({_id:userId}))
        )
    
    ),
},
}


const typeDefs = gql`

type Query {
    myProjectList:[projects!]!
}

type ProjectList{
    id:ID!
    createdAt:String!
    title: String!
    progress: Float!
    users:[user!]!
    todos:[ToDO!]!
}

type ToDO{
    id:ID!
    content: String!
    isCompleted: Boolean!
    projectList:ProjectList

}


type user{
    id:ID!
    mail:String!
    identification:String!
    name:String!
    password:String!
    rol:String!

}

type projects{
    id:ID!
    title:String!
    name:String!
    objGeneral:String!
    objEspecificos: String!
    presupuesto: String!
    fechInicio: String!
    fecchFinal: String!
    user:[user!]!
}

type Mutation{
 signUp(input:SignUpInput):AuthUser!   
 signIn(input:SignInInput):AuthUser!
 createProjectList(title:String!):ProjectList!
 updateProjectList(id:ID!, title:String!):ProjectList!
 deleteProjectList(id:ID!):Boolean!
}

input SignUpInput{
    mail:String!
    identification:String!
    name:String!
    password:String!
    rol:String!
}

input SignInInput{
    mail:String!
    password:String!
    
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
    
    

const server = new ApolloServer({ 
    typeDefs, 
    resolvers, 
    context:async({req})=> {
        const user= await getUserFromToken(req.headers.authorization, db);
        console.log(user)
        return{
            db, 
            user,
        }
      },

     });
    
     server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
    });
  }

start();
