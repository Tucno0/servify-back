import { CustomError } from '../errors/custom.error';
import { CategoryEntity } from './category.entity';

export class ServiceEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly content: number,
    public readonly priceByHour: number,
    public readonly category: CategoryEntity,
  ) {}

  static fromObject(object: { [key: string]: any }): ServiceEntity {
    const {
      id,
      name,
      description,
      content,
      price_by_hour,
      category,
    } = object;

    if (!id) throw CustomError.badRequest('Missing service id');
    if (!name) throw CustomError.badRequest('Missing service name');
    if (!description) throw CustomError.badRequest('Missing service description');
    if (!content) throw CustomError.badRequest('Missing service content');
    if (!price_by_hour) throw CustomError.badRequest('Missing service price_by_hour');
    if (!category) throw CustomError.badRequest('Missing service category');

    return new ServiceEntity(
      id,
      name,
      description,
      content,
      price_by_hour,
      CategoryEntity.fromObject(object.category),
    );
  }
}
