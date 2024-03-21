import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import { Product } from '@libs/models/product';
import productService from '@libs/services/product-service';

export const getProductsList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {

  try {
    const products: Product[] = await productService.getProducts();

    if (!products) {
      return formatJSONResponse({ error: "Products not found" });
    }

    return formatJSONResponse({ products });

  } catch (error) {
    return formatJSONResponse({ error: 'Internal Server Error' });
  }
};

export const main = middyfy(getProductsList);
