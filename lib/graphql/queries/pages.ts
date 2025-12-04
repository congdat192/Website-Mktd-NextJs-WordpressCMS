import { gql } from 'graphql-request';

export const GET_PAGES = gql`
  query GetPages($first: Int = 100) {
    pages(first: $first) {
      nodes {
        id
        databaseId
        title
        slug
        content
        date
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`;

export const GET_PAGE_BY_SLUG = gql`
  query GetPageBySlug($slug: ID!) {
    page(id: $slug, idType: URI) {
      id
      databaseId
      title
      slug
      content
      date
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
    }
  }
`;
