import { CustomError } from '../errors/custom.error';

export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly password: string,
    public readonly emailValidated: boolean,
    public readonly isActive: boolean,
    public readonly role: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly image?: string,
  ) {}

  static fromObject(object: { [key: string]: any }): UserEntity {
    const {
      id,
      name,
      last_name,
      email,
      password,
      email_validated,
      is_active,
      role,
      created_at,
      updated_at,
      image,
    } = object;

    if (!id) throw CustomError.badRequest('Missing id');
    if (!name) throw CustomError.badRequest('Missing name');
    if (!last_name) throw CustomError.badRequest('Missing lastName');
    if (!email) throw CustomError.badRequest('Missing email');
    if (!password) throw CustomError.badRequest('Missing password');
    if (email_validated === undefined) throw CustomError.badRequest('Missing emailValidated');
    if (is_active === undefined) throw CustomError.badRequest('Missing isActive');
    if (!role) throw CustomError.badRequest('Missing role');
    if (!created_at) throw CustomError.badRequest('Missing createdAt');
    if (!updated_at) throw CustomError.badRequest('Missing updatedAt');

    return new UserEntity(
      id,
      name,
      last_name,
      email,
      password,
      email_validated,
      is_active,
      role,
      created_at,
      updated_at,
      image,
    );
  }
}
