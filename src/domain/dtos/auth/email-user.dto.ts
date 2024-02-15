import { regularExps } from "../../../config";

export class EmailUserDto {
  private constructor(
    public readonly email: string,
  ) {}

  static create( object: { [key: string]: any }): [string?, EmailUserDto?] {
    const { email } = object;

    if (!email) return ['Missing email'];
    if (email.length < 6) return ['Email must be at least 6 characters'];
    if (!regularExps.email.test(email)) return ['Email is not valid'];

    return [undefined, new EmailUserDto(email)];
  }
}