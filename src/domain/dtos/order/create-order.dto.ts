import { UuidAdapter } from '../../../config/uuid.adapter';

export class CreateOrderDto {
  private constructor(
    public readonly client_id: string,
    public readonly service_id: string,
    public readonly name: string,
    public readonly last_name: string,
    public readonly address: string,
    public readonly city: string,
    public readonly zip_code: string,
    public readonly phone: string,
    public readonly start_date: string,
    public readonly end_date: string,
    public readonly status: string,
    public readonly price: string,
  ) {}

  static create(object: { [key: string]: any }): [string?, CreateOrderDto?] {
    const {
      client_id,
      service_id,
      name,
      last_name,
      address,
      city,
      zip_code,
      phone,
      start_date,
      end_date,
      status,
      price,
    } = object;

    if (!client_id) return ['Missing client id'];
    if (!UuidAdapter.validate(client_id)) return ['Client id is not valid'];

    if (!service_id) return ['Missing service id'];
    if (!UuidAdapter.validate(service_id)) return ['Service id is not valid'];

    if (!name) return ['Missing name'];
    if (!last_name) return ['Missing last name'];
    if (!address) return ['Missing address'];
    if (!city) return ['Missing city'];
    if (!zip_code) return ['Missing zip code'];

    if (!phone) return ['Missing phone'];
    if (phone.length < 9) return ['Phone must be at least 9 characters'];
    
    if (!start_date) return ['Missing start date'];
    if (!end_date) return ['Missing end date'];
    if (!status) return ['Missing status'];
    if (!price) return ['Missing price'];

    return [
      undefined,
      new CreateOrderDto(
        client_id,
        service_id,
        name,
        last_name,
        address,
        city,
        zip_code,
        phone,
        start_date,
        end_date,
        status,
        price,
      ),
    ];
  }
}
