import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type InventoryItem {
    id: ID!
    name: String
    description: String
    name_description: String
    item_number: String
    avatar: String
    customer_name: String
    available: String
    receiving: String
    received: String
    on_order: String
    picked: String
    adjusted: String
  }

  type Query {
    getFilteredInventory(
      warehouseID: Int
      locationID: Int
      customerID: Int
    ): [InventoryItem]
  }
`;
