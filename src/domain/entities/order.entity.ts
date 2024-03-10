import { CustomError } from '../errors/custom.error';
import { ClientEntity } from './client.entity';
import { ServiceEntity } from './service.entity';

export class OrderEntity {
  constructor(
    public readonly id: string,
    public readonly client: ClientEntity,
    public readonly service: ServiceEntity,
    public readonly address: string,
    public readonly location: string,
    public readonly city: string,
    public readonly zipCode: string,
    public readonly startDate: string,
    public readonly endDate: string,
    public readonly price: number,
    public readonly hours: number,
    public readonly status: string,
    public readonly createdAt: string,
    public readonly updatedAt: string,
  ) {}

  static fromObject(object: { [key: string]: any }): OrderEntity {
    let {
      id,
      client,
      service,
      address,
      location,
      city,
      zip_code,
      start_date,
      end_date,
      price,
      hours,
      status,
      created_at,
      updated_at,
    } = object;

    if (!id) throw CustomError.badRequest('Missing order id');

    if (!client) throw CustomError.badRequest('Missing order client id');
    client = ClientEntity.fromObject(client);

    if (!service) throw CustomError.badRequest('Missing order service id');
    service = ServiceEntity.fromObject(service);

    if (!address) throw CustomError.badRequest('Missing order address');
    if (!location) throw CustomError.badRequest('Missing order location');
    if (!city) throw CustomError.badRequest('Missing order city');
    if (!zip_code) throw CustomError.badRequest('Missing order zip code');
    if (!start_date) throw CustomError.badRequest('Missing order start date');
    if (!end_date) throw CustomError.badRequest('Missing order end date');
    if (!price) throw CustomError.badRequest('Missing order price');
    if (!hours) throw CustomError.badRequest('Missing order hours');
    if (!status) throw CustomError.badRequest('Missing order status');
    if (!created_at) throw CustomError.badRequest('Missing order created at');
    if (!updated_at) throw CustomError.badRequest('Missing order updated at');

    return new OrderEntity(
      id,
      client,
      service,
      address,
      location,
      city,
      zip_code,
      start_date,
      end_date,
      price,
      hours,
      status,
      created_at,
      updated_at,
    );
  }
}
