import { CustomError } from "../errors/custom.error";

export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly password: string,
    public readonly emailValidated: boolean,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly image?: string,
  ) {}

  static fromObject(object: { [key: string]: any }): UserEntity {
    const { id, name, lastName, email, password, emailValidated, isActive, createdAt, updatedAt, image } = object;

    if (!id) throw CustomError.badRequest('Missing id');
    if (!name) throw CustomError.badRequest('Missing name');
    if (!lastName) throw CustomError.badRequest('Missing lastName');
    if (!email) throw CustomError.badRequest('Missing email');
    if (!password) throw CustomError.badRequest('Missing password');
    if (emailValidated === undefined) throw CustomError.badRequest('Missing emailValidated');
    if (isActive === undefined) throw CustomError.badRequest('Missing isActive');
    if (!createdAt) throw CustomError.badRequest('Missing createdAt');
    if (!updatedAt) throw CustomError.badRequest('Missing updatedAt');


    return new UserEntity(
      id,
      name,
      lastName,
      email,
      password,
      emailValidated,
      isActive,
      createdAt,
      updatedAt,
      image,
    );
  }
}