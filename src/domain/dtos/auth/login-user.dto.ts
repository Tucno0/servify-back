import { regularExps } from "../../../config";

export class LoginUserDto {

  private constructor(
    public readonly email: string,
    public readonly password: string,
  ) {}

  static create( object: { [key: string]: any }): [string?, LoginUserDto?] {
    const { email, password } = object;

    // Se hace la validación de los datos recibidos
    if (!email) return ['Missing email'];
    if (!regularExps.email.test(email)) return ['Email is not valid'];
    if (!password) return ['Missing password'];
    if (password.length < 6) return ['Password must be at least 6 characters'];

    // Se retorna un arreglo con los datos validados
    return [undefined, new LoginUserDto(email, password)];
  }

}