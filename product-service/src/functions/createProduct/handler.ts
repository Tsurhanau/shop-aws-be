import { ValidatedEventAPIGatewayProxyEvent, formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import { productService } from '@libs/services/product-service';
import { stockService } from '@libs/services/stock-service';
import { CreateProductSchema } from '@libs/validators/productSchemas';
import schema from './schema';

export const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event: any
) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  const productData = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;

  const { error } = CreateProductSchema.validate(productData);

  if (error) {
    console.error('Validation error:', error.details);
    return formatJSONResponse({ error: "Invalid request body" });
  }

  console.log('Parsed and validated product data:', productData);

  try {
    console.log('Attempting to create product...');
    const newProduct = await productService.createProduct(productData);
    console.log('Product created successfully', newProduct);

    console.log('Attempting to create stock...');
    await stockService.createStock(newProduct.id, productData.count);
    console.log('Stock created successfully');

    console.log('Sending response back to client...');
    return formatJSONResponse({ product: newProduct });
  } catch (error) {
    console.log('Internal Server Error:', error);
    return formatJSONResponse({ error: 'Internal Server Error' });
  }
};

export const main = middyfy(createProduct);