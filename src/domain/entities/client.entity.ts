import { CustomError } from '../errors/custom.error';
import { UserEntity } from './user.entity';

export class ClientEntity {
  constructor(
    public readonly id: string,
    public readonly user: UserEntity,
    public readonly phone: string,
    public readonly address: string,
    public readonly zipCode: number,
  ) {}

  static fromObject(object: { [key: string]: any }): ClientEntity {
    let {
      id,
      user,
      phone,
      address,
      zip_code,
    } = object;

    if (!id) throw CustomError.badRequest('Missing client id');
    if (!user) throw CustomError.badRequest('Missing client user');

    user = UserEntity.fromObject(user);

    if (!phone) throw CustomError.badRequest('Missing client phone');
    if (!address) throw CustomError.badRequest('Missing client address');
    if (!zip_code) throw CustomError.badRequest('Missing client zip_code');    
    

    return new ClientEntity(
      id,
      user,
      phone,
      address,
      zip_code,
    );
  }
}
