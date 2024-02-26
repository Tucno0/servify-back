import { Router } from "express";
import { CategoryController } from "./contoller";
import { CategoryService } from '../services/categories.service';

export class CategoryRoutes {

  static get routes() {
    const router = Router();

    const categoryService = new CategoryService();
    const controller = new CategoryController(categoryService);

    //* /api/category
    router.get('/', controller.getAllCategories);

    //* /api/category/:id
    router.get('/:id', controller.getCategoryById);

    //* /api/category
    // router.post('/', controller.createCategory);

    //* /api/category/:id
    // router.put('/:id', controller.updateCategory);

    //* /api/category/:id
    // router.delete('/:id', controller.deleteCategory);

    return router;
  }
}