import { middyfy } from '@libs/lambda';
import { importService } from '@libs/services/import-service';
import { S3Event } from 'aws-lambda';

// @ts-ignore
export const importFileParser: S3Handler = async (event: S3Event) => {

  console.log(`Received event: ${JSON.stringify(event)}`);

  try {
    for (const record of event.Records) {
      console.log(`Processing record: ${JSON.stringify(record)}`);
      await importService.importFileParser(record);
    }
  } catch (error) {
      console.log('Error reading and processing file', error);
      throw new Error(`Error reading and processing file: ${error.message}`);
  }
}
export const main = middyfy(importFileParser);
