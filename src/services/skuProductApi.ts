
import { apiInstance } from '../api/services/api';

// Fetch SKU products for dropdown/selection
export const skuProductService = {
  getProducts: async () => {
    try {
      const resp = await apiInstance.get('/sku-matrices/products');
      // Ensure we return an array, even if the API response is malformed.
      if (resp && resp.data && Array.isArray(resp.data.products)) {
        return resp.data.products;
      }
      return [];
    } catch (error) {
      // In case of any error (network, 404, etc.), return an empty array.
      console.error("Failed to fetch SKU products:", error);
      return [];
    }
  }
};
