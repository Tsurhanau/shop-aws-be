import { products } from "@libs/mocks/mockProduct";

class ProductService {
 
    public getProductById = (productId: string) => {
        const data = products.find(({ id }) => id === productId);
      
        return Promise.resolve(data);
    };

    public getProducts = () => {
        return Promise.resolve(products);
    }
}

const productService = new ProductService();

export default productService;
