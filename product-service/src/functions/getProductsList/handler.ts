import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import { productService } from '@libs/services/product-service';
import { stockService } from '@libs/services/stock-service';

export const getProductsList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  try {
    const products = await productService.getAllProducts();

    if (products.length === 0) {
      return formatJSONResponse({ error: "No products found." });
    }

    const stocks = await stockService.getAllItems();
    const stockLookup: Record<string, any> = {};

    if(stocks) {
      for (const stock of stocks) {
        stockLookup[stock.product_id] = {count: stock.count};
      }
    }

    const productsInStock = products
      .filter(product => stockLookup[product.id])
      .map(product => ({
        ...product,
        count: stockLookup[product.id].count,
      }));
    
    if (productsInStock.length === 0) {
      return formatJSONResponse({ error: "Products in stock not found" });
    }

    return formatJSONResponse({ products: productsInStock });
  } catch (error) {
    return formatJSONResponse({ error: 'Internal Server Error' });
  }
};

export const main = middyfy(getProductsList);
