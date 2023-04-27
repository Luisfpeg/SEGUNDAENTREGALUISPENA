const fs = require('fs');

describe('ProductManager', () => {
  let productManager;

  beforeEach(() => {
    productManager = new ProductManager();
  });

  describe('getProducts', () => {
    it('devuelve un arreglo vacío al principio', () => {
      const expected = [];
      const actual = productManager.getProducts();
      expect(actual).toEqual(expected);

      fs.writeFileSync('Test.json', JSON.stringify({ getProducts: expected === actual ? 'Success' : 'Failed' }));
    });
  });

  describe('addProduct', () => {
    it('agrega un producto satisfactoriamente con un id generado automáticamente', () => {
      const product = {
        title: 'producto prueba',
        description: 'Este es un producto prueba',
        price: 200,
        thumbnail: 'Sin imagen',
        code: 'abc123',
        stock: 25
      };

      const expected = { ...product, id: 1 };
      const actual = productManager.addProduct(product);
      expect(actual).toEqual(expected);

      fs.writeFileSync('Test.json', JSON.stringify({ addProduct: expected === actual ? 'Success' : 'Failed' }));
    });

    it('genera ids únicos para cada producto', () => {
      const product1 = {
        title: 'producto prueba 1',
        description: 'Este es un producto prueba 1',
        price: 100,
        thumbnail: 'Sin imagen 1',
        code: 'P001',
        stock: 50
      };

      const product2 = {
        title: 'producto prueba 2',
        description: 'Este es un producto prueba 2',
        price: 200,
        thumbnail: 'Sin imagen 2',
        code: 'P002',
        stock: 25
      };

      const expected1 = { ...product1, id: 1 };
      const expected2 = { ...product2, id: 2 };
      const actual1 = productManager.addProduct(product1);
      const actual2 = productManager.addProduct(product2);

      expect(actual1).toEqual(expected1);
      expect(actual2).toEqual(expected2);

      fs.writeFileSync('Test.json', JSON.stringify({ addProductUniqueIds: expected1.id !== expected2.id ? 'Success' : 'Failed' }));
    });

    it('arroja un error si se intenta agregar un producto con un código identificador existente', () => {
      const product = {
        title: 'producto prueba',
        description: 'Este es un producto prueba',
        price: 200,
        thumbnail: 'Sin imagen',
        code: 'abc123',
        stock: 25
      };
      productManager.addProduct(product);

      let excep = null;
      try {
        productManager.addProduct(product);
      } catch (e) {
        excep = e;
      }

      expect(excep).not.toBeNull();
      expect(excep.message).toEqual('Ya existe un producto con ese código identificador');

      fs.writeFileSync('Test.json', JSON.stringify({ addProductExistingCode: excep ? 'Success' : 'Failed' }));
    });
  });

  describe('getProductById', () => {
    it('devuelve el producto con el id especificado', () => {
      const product1 = {
        title: 'producto prueba 1',
        description: 'Este es un producto prueba 1',
        price: 100,
        thumbnail: 'Sin imagen 1',
        code: 'P001',
        stock: 50
      };
      const product2 = {
        title: 'producto prueba 2',
        description: 'Este es un producto prueba 2',
        price: 200,
        thumbnail: 'Sin imagen 2',
        code: 'P002',
        stock: 25
      };
      productManager.addProduct(product1);
      const expected = productManager.addProduct(product2);

      const actual = productManager.getProductById(expected.id);
      expect(actual).toEqual(expected);

      fs.writeFileSync('Test.json', JSON.stringify({ getProductById: expected === actual ? 'Success' : 'Failed' }));
    });

    it('arroja un error si el producto no existe', () => {
      let excep = null;
      try {
        productManager.getProductById(1);
      } catch (e) {
        excep = e;
      }

      expect(excep).not.toBeNull();
      expect(excep.message).toEqual('Producto no encontrado');

      fs.writeFileSync('Test.json', JSON.stringify({ getProductByIdNotExist: excep ? 'Success' : 'Failed' }));
    });
  });

  describe('updateProduct', () => {
    it('actualiza un campo de un producto existente sin cambiar su id', () => {
      const product = {
        title: 'producto prueba',
        description: 'Este es un producto prueba',
        price: 200,
        thumbnail: 'Sin imagen',
        code: 'abc123',
        stock: 25
      };
      const newProduct = productManager.addProduct(product);
      const expected = { ...newProduct, price: 250 };

      const actual = productManager.updateProduct(newProduct.id, { price: 250 });

      expect(actual.id).toEqual(newProduct.id);
      expect(actual.price).toEqual(250);
      expect(productManager.getProductById(newProduct.id)).toEqual(expected);

      fs.writeFileSync('Test.json', JSON.stringify({ updateProduct: expected === actual ? 'Success' : 'Failed' }));
    });

    it('arroja un error si el producto no existe', () => {
      let excep = null;
      try {
        productManager.updateProduct(1, { price: 250 });
      } catch (e) {
        excep = e;
      }

      expect(excep).not.toBeNull();
      expect(excep.message).toEqual('Producto no encontrado');

      fs.writeFileSync('Test.json', JSON.stringify({ updateProductNotExist: excep ? 'Success' : 'Failed' }));
    });
  });

  describe('deleteProduct', () => {
    it('elimina un producto existente', () => {
      const product = {
        title: 'producto prueba',
        description: 'Este es un producto prueba',
        price: 200,
        thumbnail: 'Sin imagen',
        code: 'abc123',
        stock: 25
      };
      const newProduct = productManager.addProduct(product);
      const expected = [];

      expect(productManager.getProducts()).toEqual([newProduct]);
      productManager.deleteProduct(newProduct.id);
      expect(productManager.getProducts()).toEqual(expected);

      fs.writeFileSync('Test.json', JSON.stringify({ deleteProduct: expected === productManager.getProducts() ? 'Success' : 'Failed' }));
    });

    it('arroja un error si el producto no existe', () => {
      let excep = null;
      try {
        productManager.deleteProduct(1);
      } catch (e) {
        excep = e;
      }

      expect(excep).not.toBeNull();
      expect(excep.message).toEqual('Producto no encontrado');

      fs.writeFileSync('Test.json', JSON.stringify({ deleteProductNotExist: excep ? 'Success' : 'Failed' }));
    });
  });
});