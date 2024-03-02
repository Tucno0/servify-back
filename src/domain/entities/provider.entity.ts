import { CustomError } from '../errors/custom.error';
import { UserEntity } from './user.entity';

export class ProviderEntity {
  constructor(
    public readonly id: string,
    public readonly user: UserEntity,
    public readonly phone: string,
    public readonly description: string,
    public readonly rating: number,
    public readonly content: string,
  ) {}

  static fromObject(object: { [key: string]: any }): ProviderEntity {
    let {
      id,
      user,
      phone,
      description,
      rating,
      content,
    } = object;

    if (!id) throw CustomError.badRequest('Missing provider id');
    if (!user) throw CustomError.badRequest('Missing provider user');

    user = UserEntity.fromObject(user);

    if (!phone) throw CustomError.badRequest('Missing provider phone');
    if (!description) throw CustomError.badRequest('Missing provider description');
    if (!rating) throw CustomError.badRequest('Missing provider raiting');    
    
    // si rating es un string devuelve un error
    if (typeof rating === 'string') throw CustomError.badRequest('Invalid provider rating');

    return new ProviderEntity(
      id,
      user,
      phone,
      description,
      rating,
      content,
    );
  }
}
