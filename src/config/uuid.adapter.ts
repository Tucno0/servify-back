import { v4 as uuidv4 } from 'uuid';
import { validate as uuidValidate } from 'uuid';

export class UuidAdapter {
  static generate(): string {
    return uuidv4();
  }

  static validate(uuid: string): boolean {
    return uuidValidate(uuid);
  }
}