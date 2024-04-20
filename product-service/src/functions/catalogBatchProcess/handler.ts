
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import { productService } from '@libs/services/product-service';
import { stockService } from '@libs/services/stock-service';
import middy from '@middy/core';
import { Handler, SQSEvent } from 'aws-lambda';

const catalogBatchProcess: Handler = async (event: SQSEvent) => {

  const sns = new SNSClient({ region: process.env.AWS_REGION });

  for (const record of event.Records) {
    const product = JSON.parse(record.body);
    console.log(product)
    const createdProduct = await productService.createProduct(product);

    await stockService.createStock(createdProduct.id, 5);

    const message = `Product created: ${createdProduct.id} ${createdProduct.title}`;

    const params = {
      Message: message,
      Subject: 'Product Created',
      TopicArn: process.env.CREATE_PRODUCT_TOPIC_ARN,
    };
    await sns.send(new PublishCommand(params));
  }
};

export const main = middy(catalogBatchProcess);