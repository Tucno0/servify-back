import { CustomError } from '../errors/custom.error';

export class CategoryEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
  ) {}

  static fromObject(object: { [key: string]: any }): CategoryEntity {
    const {
      id,
      name,
      description,
    } = object;

    if (!id) throw CustomError.badRequest('Missing category id');
    if (!name) throw CustomError.badRequest('Missing category name');
    if (!description) throw CustomError.badRequest('Missing category description');

    return new CategoryEntity(
      id,
      name,
      description,
    );
  }
}
