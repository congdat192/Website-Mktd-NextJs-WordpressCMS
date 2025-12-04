import { gql } from 'graphql-request';

export const GET_PRODUCTS = gql`
  query GetProducts(
    $first: Int = 12
    $after: String
    $categorySlug: String
    $minPrice: Float
    $maxPrice: Float
    $orderBy: ProductsOrderByEnum = DATE
    $order: OrderEnum = DESC
  ) {
    products(
      first: $first
      after: $after
      where: {
        category: $categorySlug
        minPrice: $minPrice
        maxPrice: $maxPrice
        orderby: [{ field: $orderBy, order: $order }]
      }
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        cursor
        node {
          id
          databaseId
          name
          slug
          type
          image {
            sourceUrl
            altText
          }
          ... on SimpleProduct {
            date
            price
            regularPrice
            salePrice
            onSale
            stockStatus
            averageRating
            reviewCount
            productCategories {
              nodes {
                id
                name
                slug
              }
            }
          }
          ... on VariableProduct {
            date
            price
            regularPrice
            salePrice
            onSale
            stockStatus
            averageRating
            reviewCount
            productCategories {
              nodes {
                id
                name
                slug
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_PRODUCT_BY_SLUG = gql`
  query GetProductBySlug($slug: ID!) {
    product(id: $slug, idType: SLUG) {
      id
      databaseId
      name
      slug
      description
      shortDescription
      type
      ... on SimpleProduct {
        price
        regularPrice
        salePrice
        onSale
        stockStatus
        stockQuantity
        averageRating
        reviewCount
      }
      ... on VariableProduct {
        price
        regularPrice
        salePrice
        onSale
        stockStatus
        averageRating
        reviewCount
        variations {
          nodes {
            id
            databaseId
            name
            price
            regularPrice
            salePrice
            stockStatus
            stockQuantity
            image {
              sourceUrl
              altText
            }
            attributes {
              nodes {
                name
                value
              }
            }
          }
        }
      }
      image {
        sourceUrl
        altText
      }
      galleryImages {
        nodes {
          sourceUrl
          altText
        }
      }
      productCategories {
        nodes {
          id
          name
          slug
        }
      }
      attributes {
        nodes {
          name
          options
        }
      }
      related {
        nodes {
          id
          databaseId
          name
          slug
          ... on SimpleProduct {
            price
            onSale
          }
          ... on VariableProduct {
            price
            onSale
          }
          image {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`;

export const GET_PRODUCT_CATEGORIES = gql`
  query GetProductCategories {
    productCategories(first: 100) {
      nodes {
        id
        databaseId
        name
        slug
        count
        description
      }
    }
  }
`;
