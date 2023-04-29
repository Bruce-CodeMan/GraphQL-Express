const graphql = require('graphql');
const axios = require('axios');
const res = require('express/lib/response');

const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
    GraphQLInt,
    GraphQLList
} = graphql;

const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        users: {
            type: new GraphQLList(UserType),
            resolve(parentValue, _) {
                return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
                        .then(resp => resp.data)
            }
        }
    })
})

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        company: {
            type: CompanyType,
            resolve(parentValue, _) {
                return axios.get(`http://localhost:3000/companies/${parentValue.id}`)
                        .then(resp => resp.data)
            }
        }
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLString } },
            resolve(_, args) {
                return axios.get(`http://localhost:3000/users/${args.id}`)
                        .then(resp => resp.data);
            }
        },
        company: {
            type: CompanyType,
            args: { id: { type: GraphQLString } },
            resolve(_, args) {
                return axios.get(`http://localhost:3000/companies/${args.id}`)
                        .then(resp => resp.data);
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
})