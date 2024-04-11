import { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "@libs/db/dynamoDBClient";
import { v4 as uuid } from "uuid";

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

  async createProduct(product) {
    const saveProduct = {
      id: uuid(),
      title: product.title,
      description: product.description,
      price: product.price
    };

    const params = {
      TableName: process.env.PRODUCTS_TABLE_NAME,
      Item: saveProduct,
    };
    
    await this.docClient.send(new PutCommand(params));
    
    return saveProduct;
  }

}

export const productService = new ProductService(docClient);
