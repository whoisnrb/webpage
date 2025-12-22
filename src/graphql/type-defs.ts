import { gql } from "graphql-tag"

export const typeDefs = gql`
  type ProductPrices {
    personal: Float
    commercial: Float
    developer: Float
  }

  type Product {
    id: ID!
    title: String!
    description: String!
    longDescription: String
    price: Float!
    category: String!
    slug: String!
    image: String!
    features: [String]
    prices: ProductPrices
    createdAt: String
    updatedAt: String
  }

  type BlogPost {
    id: ID!
    title: String!
    excerpt: String!
    content: String!
    slug: String!
    coverImage: String
    author: String!
    createdAt: String!
    updatedAt: String!
    tags: [String]
    published: Boolean
    featured: Boolean
  }

  type Query {
    products: [Product]
    product(slug: String!): Product
    posts: [BlogPost]
    post(slug: String!): BlogPost
  }
`
