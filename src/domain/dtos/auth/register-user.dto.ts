import { regularExps } from "../../../config";

export class RegisterUserDto {

  private constructor(
    public readonly name: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly password: string,
    public readonly role: string,
  ){}

  static create( object: { [key: string]: any } ): [string?, RegisterUserDto?] {
    const { name, lastName, email, password, role } = object;

    // Se hace la validación de los datos recibidos
    if (!name) return ['Missing name'];
    if (!lastName) return ['Missing last name'];
    if (!email) return ['Missing email'];
    if (!regularExps.email.test(email)) return ['Email is not valid'];
    if (!password) return ['Missing password'];
    if (password.length < 6) return ['Password must be at least 6 characters'];

    if (!role) return ['Missing role'];

    // Se retorna un arreglo con los datos validados
    return [undefined, new RegisterUserDto(name, lastName, email, password, role)];
  }
}