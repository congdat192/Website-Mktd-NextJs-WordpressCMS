import { gql } from 'graphql-request';

export const GET_PRODUCT_CATEGORIES = gql`
  query GetProductCategories($first: Int = 100) {
    productCategories(first: $first) {
      nodes {
        id
        databaseId
        name
        slug
        count
        description
        parent {
          node {
            id
            slug
          }
        }
      }
    }
  }
`;

export const GET_PRODUCT_CATEGORY_BY_SLUG = gql`
  query GetProductCategoryBySlug($slug: ID!) {
    productCategory(id: $slug, idType: SLUG) {
      id
      databaseId
      name
      slug
      count
      description
      parent {
        node {
          id
          slug
        }
      }
    }
  }
`;

export const GET_POST_CATEGORIES = gql`
  query GetPostCategories($first: Int = 100) {
    categories(first: $first) {
      nodes {
        id
        databaseId
        name
        slug
        count
        description
        parent {
          node {
            id
            slug
          }
        }
      }
    }
  }
`;

export const GET_POST_CATEGORY_BY_SLUG = gql`
  query GetPostCategoryBySlug($slug: ID!) {
    category(id: $slug, idType: SLUG) {
      id
      databaseId
      name
      slug
      count
      description
      parent {
        node {
          id
          slug
        }
      }
    }
  }
`;
