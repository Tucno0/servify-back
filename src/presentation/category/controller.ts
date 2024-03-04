import { Request, Response } from "express";
import { handleError } from "../../domain";
import { CategoryService } from "../services/categories.service";

export class CategoryController {
  constructor(
    public readonly categoryService: CategoryService,
  ) {}

  public getAllCategories = async (req: Request, res: Response) => {
    return this.categoryService.getAllCategories()
      .then( categories => res.json(categories))
      .catch( error => handleError(error, res));
  }

  public getCategoryById = async (req: Request, res: Response) => {
    const { id } = req.params;

    return this.categoryService.getCategoryById(id)
      .then( category => res.json(category))
      .catch( error => handleError(error, res));
  }

  public createCategory = (req: Request, res: Response) => {
    // const [error, categoryDto] = CreateCategoryDto.create(req.body);

    // if (error) return res.status(400).json({ error });

    // return this.categoryService.createCategory(categoryDto!)
    //   .then( category => res.json(category))
    //   .catch( error => this.handleError(error, res));
  }

  public updateCategory = (req: Request, res: Response) => {
    // const { id } = req.params;
    // const [error, categoryDto] = UpdateCategoryDto.create(req.body);

    // if (error) return res.status(400).json({ error });

    // return this.categoryService.updateCategory(id, categoryDto!)
    //   .then( category => res.json(category))
    //   .catch( error => this.handleError(error, res));
  }

  public deleteCategory = (req: Request, res: Response) => {
    // const { id } = req.params;
    // return this.categoryService.deleteCategory(id)
    //   .then( category => res.json(category))
    //   .catch( error => this.handleError(error, res));
  }
}