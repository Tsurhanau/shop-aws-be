import { DynamoDBDocumentClient, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "@libs/db/dynamoDBClient";


class StockService {

  constructor(private docClient: DynamoDBDocumentClient) {}

  async getAllItems() {
    const scanCommand = new ScanCommand({ TableName: process.env.STOCKS_TABLE_NAME });
    const response = await this.docClient.send(scanCommand);
    return response.Items;
  }

  async createStock(productId, count) {
    const stock = {
      product_id: productId,
      count,
    };
    const params = {
      TableName: process.env.STOCKS_TABLE_NAME,
      Item: stock,
    };
    await this.docClient.send(new PutCommand(params));
    
    return stock;
  }
}

export const stockService = new StockService(docClient);