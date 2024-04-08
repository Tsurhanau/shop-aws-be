import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { importService } from '@libs/services/import-service';

import schema from './schema';


const importProductsFile: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {

  console.log('importProductsFile triggered', { event });

  const fileName = event.pathParameters && event.pathParameters.name;

  if (!fileName) {
    return formatJSONResponse(400, { error: 'Missing name query parameter' });
  }

  console.log('Filename', fileName);

  try {
    const url = await importService.importProductsFile(fileName);

    console.log('Generated URL', url);

    return formatJSONResponse(200, { url: url });
  } catch(error) {
    console.error(`Error occurred while trying to generate signed URL for filename: ${fileName}. Error: ${error}`);
    
    return formatJSONResponse(500, { error: 'An error occurred while generating the signed URL' })
  }
};

export const main = middyfy(importProductsFile);
