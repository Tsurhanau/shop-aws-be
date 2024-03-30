import { DynamoDBDocumentClient, GetCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "@libs/db/dynamoDBClient";

class ProductService {
    
  constructor(private docClient: DynamoDBDocumentClient) {}

  async getAllProducts() {
    const scanCommand = new ScanCommand({ TableName: process.env.PRODUCTS_TABLE_NAME  });
    const response = await this.docClient.send(scanCommand);
    return response.Items;
  }

  async getProductById(productId: string) {
    const params = {
      TableName: process.env.PRODUCTS_TABLE_NAME,
      Key: {
        id: productId
      }
    };

    const command = new GetCommand(params);
    const result = await this.docClient.send(command);
    return result.Item;
  };

}

export const productService = new ProductService(docClient);
