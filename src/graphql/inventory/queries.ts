import { gql } from '@apollo/client';

export const GET_FILTERED_INVENTORY = gql`
  query GetFilteredInventory($warehouseID: Int, $locationID: Int, $customerID: Int) {
    getFilteredInventory(warehouseID: $warehouseID, locationID: $locationID, customerID: $customerID) {
      id
      name
      description
      item_number
      avatar
      customer_name
      available
      receiving
      received
      on_order
      picked
      adjusted
    }
  }
`;
