import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "@libs/db/dynamoDBClient";


class StockService {

  constructor(private docClient: DynamoDBDocumentClient) {}

  async getAllItems() {
    const scanCommand = new ScanCommand({ TableName: process.env.STOCKS_TABLE_NAME });
    const response = await this.docClient.send(scanCommand);
    return response.Items;
  }
}

export const stockService = new StockService(docClient);