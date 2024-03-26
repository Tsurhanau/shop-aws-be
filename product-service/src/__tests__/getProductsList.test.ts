import productService from "@libs/services/product-service";
import { getProductsList } from "../functions/getProductsList/handler"
import { products } from "@libs/mocks/mockProduct";
import { mockContext } from "@libs/mocks/mockContext";

jest.mock("@libs/services/product-service");

describe('getProductsList', () => {
  it('should return products when products are found', async () => {
    const mockProducts = products;
    productService.getProducts = jest.fn().mockResolvedValue(mockProducts);
    const mockEvent = {
      body: JSON.stringify({ name: 'test' }),
    }; 
    const response = await getProductsList(mockEvent as any, mockContext, () => {});

    expect(response).toEqual({
      statusCode: 200,
      body: JSON.stringify({ products: mockProducts }),
    });
    expect(productService.getProducts).toHaveBeenCalledTimes(1);
  });

  it('should return an Internal Server Error when productService.getProducts() rejects', async () => {
    productService.getProducts = jest.fn().mockRejectedValue(new Error('Something went wrong'));
    const mockEvent = {
      body: JSON.stringify({ name: 'test' }),
    };
    const response = await getProductsList(mockEvent as any, mockContext, () => {});
  
    expect(response).toEqual({
      statusCode: 200,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    });
    expect(productService.getProducts).toHaveBeenCalledTimes(1);
  });

  it('should return "Products not found" when no products are found', async () => {
    productService.getProducts = jest.fn().mockResolvedValue(undefined); 
    const mockEvent = {
      body: JSON.stringify({ name: 'test' }),
    };
    
    const response = await getProductsList(mockEvent as any, mockContext, () => {});
  
    expect(response).toEqual({
      statusCode: 200,
      body: JSON.stringify({ error: "Products not found" }), 
    });
    expect(productService.getProducts).toHaveBeenCalledTimes(1);
  });
});
