import { UuidAdapter } from '../../config';
import { prisma } from '../../data/postgres/index';
import { CustomError } from '../../domain';
import { CategoryEntity } from '../../domain/entities/category.entity';

export class CategoryService {
  
  public getAllCategories = async () => {
    const categories = await prisma.category.findMany();
    return categories.map( category => CategoryEntity.fromObject(category));
  }

  public getCategoryById = async (id: string) => {
    // Se valida que el id sea un uuid
    if (!UuidAdapter.validate(id)) throw CustomError.badRequest('Invalid id');

    // Se busca la categoría por id en la base de datos
    const category = await prisma.category.findUnique({ where: { id } });

    // Se valida que la categoría exista en la base de datos
    if (!category) throw CustomError.notFound('Category not found');

    // Se retorna la categoría encontrada si existe
    return CategoryEntity.fromObject(category);
  }

  public createCategory = async (category: any) => {
    return {
      msg: 'createCategory'
    };
  }

  public updateCategory = async (id: string, category: any) => {
    return {
      msg: 'updateCategory'
    };
  }

  public deleteCategory = async (id: string) => {
    return {
      msg: 'deleteCategory'
    };
  }
}