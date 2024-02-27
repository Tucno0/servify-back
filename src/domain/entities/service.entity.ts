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
    public readonly images: string[],
  ) {}

  static fromObject(object: { [key: string]: any }): ServiceEntity {
    const {
      id,
      name,
      description,
      content,
      price_by_hour,
      category,
      service_images,
    } = object;

    if (!id) throw CustomError.badRequest('Missing service id');
    if (!name) throw CustomError.badRequest('Missing service name');
    if (!description) throw CustomError.badRequest('Missing service description');
    if (!content) throw CustomError.badRequest('Missing service content');
    if (!price_by_hour) throw CustomError.badRequest('Missing service price_by_hour');
    if (!category) throw CustomError.badRequest('Missing service category');

    let images: string[] = [];
    if( service_images ) {
      images = service_images.map((image: { [key: string]: any }) => image.url);
    }

    return new ServiceEntity(
      id,
      name,
      description,
      content,
      price_by_hour,
      CategoryEntity.fromObject(object.category),
      images,
    );
  }
}
