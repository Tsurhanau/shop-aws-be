import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { Product } from '@libs/models/product';
import productService from '@libs/services/product-service';

const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event: Pick<APIGatewayProxyEvent, 'pathParameters'>) => {
  const id = event.pathParameters?.productId;

  if (!id) {
    return formatJSONResponse({ error: "Missing id" });
  }

  try {
    const product: Product = await productService.getProductById(id);

    if (!product) {
      return formatJSONResponse({ error: "Product not found" });
    }

    return formatJSONResponse({ product });

  } catch (error) {
    return formatJSONResponse({ error: 'Internal Server Error' });
  }
};

export const main = middyfy(getProductsById);
