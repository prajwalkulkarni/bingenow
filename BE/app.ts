import express from 'express';
import {Request,Response} from 'express'
const app = express();



if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const expressGraphQL = require('express-graphql').graphqlHTTP;
const mongoose = require('mongoose');
const User = require('./models/user');
const cors = require('cors');

const PORT_NO = 3000;


const { GraphQLObjectType, 
    GraphQLList, 
    GraphQLSchema,
    GraphQLInt,
    GraphQLString } = require('graphql');


    
const MediaType = new GraphQLObjectType({
    name: 'MediaType',
    fields: {
        id: { type: GraphQLString },
        imdbId: { type: GraphQLString },
        title: { type: GraphQLString },
        image: { type: GraphQLString },
        overview: { type: GraphQLString },
        runtime: { type: GraphQLString },
        year: { type: GraphQLString },
    }
})

const UserType = new GraphQLObjectType({
    name: 'UserType',
    fields: ()=>({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        watchlist: { type: new GraphQLList(MediaType) },
    })
})


const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields:()=>({
        watchlist: {
            type:  new GraphQLList(MediaType),
            args:{
                id: { type: GraphQLString }
            },
            resolve: async(parent:any, args:any)=>{
                const res = await User.findOne({id: args.id}).project({watchlist: 1})
                return res
            }
        }
    })
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
        createUser: {
            type: UserType,
            args: {
                name: { type: GraphQLString },
                email: { type: GraphQLString },
            },
            resolve: async(parent:any, args:any) => {
                const newUser = {
                    name: args.name,
                    email: args.email,
                    watchlist: []
                }
                const user = new User(newUser);
                const user_id = await user.save();
                return {
                    id: user_id._id,
                    name: args.name,
                    email: args.email
                };
            }
        }
    })
})

const schema = new GraphQLSchema({
    query: RootQuery,
    mutation:Mutation
});

app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.use((req:Request,res:Response,next:Function)=>{

    // res.setHeader('Access-Control-Allow-Origin','https://www.eduwall.in')
    res.setHeader('Access-Control-Allow-Origin','*')
    res.setHeader('Access-Control-Allow-Headers','Origin, X-Request-With, Content-Type, Accept, Authorization')
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PATCH,PUT,DELETE,OPTIONS')

    next()
})

app.options('/graphql', cors())
app.use('/graphql', expressGraphQL({
    graphiql: true,
    schema,
    mutation: Mutation,
}));




mongoose
.connect(`mongodb+srv://${process.env.DB_USR}:${process.env.DB_PASS}@cluster0.gmn6g.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
.then(()=>{
    app.listen(process.env.PORT || PORT_NO)
    console.log("Connection successful!")
}).catch((err:Error)=>{
    console.log("Error connecting to database: ",err)
})

module.exports = app;