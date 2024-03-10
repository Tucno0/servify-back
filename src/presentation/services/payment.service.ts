import { envs } from '../../config';
import { prisma } from '../../data/postgres/index';
import { CustomError, CreateOrderDto } from '../../domain';

export class PaymentService {

  constructor(
    private orderTemp: CreateOrderDto | null = null,
  ) {}

  public createOrder = async ( createOrderDto: CreateOrderDto ) => {
    const order = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: crypto.randomUUID(),
          amount: {
            currency_code: 'USD',
            value: createOrderDto.price,
          },
          shipping: {
            address: {
              address_line_1: createOrderDto.address,
              address_line_2: 'Apt 2',
              admin_area_2: createOrderDto.city,
              postal_code: createOrderDto.zip_code,
              country_code: 'PE'
            }
          },
        },
      ],
      payment_source: {
        paypal: {
          experience_context: {
            payment_method_preference: 'IMMEDIATE_PAYMENT_REQUIRED',
            brand_name: 'Servify Corp',
            landing_page: 'NO_PREFERENCE',
            shipping_preference: 'SET_PROVIDED_ADDRESS',
            user_action: 'PAY_NOW',
            return_url: `${envs.WEBSERVICE_URL}/dashboard/confirm-order`,
            cancel_url: `${envs.WEBSERVICE_URL}/book?serviceId=${createOrderDto.service_id}`,
          },
        },
      },
    }

    try {
      //-- Creamos el parámetro para obtener el token de acceso
      const params = new URLSearchParams();
      params.append('grant_type', 'client_credentials');
  
      //* Obtenemos el token de acceso para hacer la petición
      const authResponse = await fetch(`${envs.PAYPAL_API}/v1/oauth2/token`, {
        method: 'POST',
        body: params,
        headers: {
          'Authorization': `Basic ${Buffer.from(`${envs.PAYPAL_CLIENT_ID}:${envs.PAYPAL_SECRET_KEY}`).toString('base64')}`
        }
      });
  
      const { access_token } = await authResponse.json();
  
      //* Creamos la orden de pago
      const resp = await fetch(`${envs.PAYPAL_API}/v2/checkout/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'PayPal-Request-Id': crypto.randomUUID(),
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify(order),
      });
  
      const data = await resp.json();
      // console.log(data);
      this.orderTemp = createOrderDto;
      
      return data;

    } catch (error) {
      throw CustomError.internalServer(`Error creating order: ${error}`);
    }
  };

  public captureOrder = async (token: string) => {

    const response = await fetch(`${envs.PAYPAL_API}/v2/checkout/orders/${token}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'PayPal-Request-Id': crypto.randomUUID(),
        'Authorization': `Basic ${Buffer.from(`${envs.PAYPAL_CLIENT_ID}:${envs.PAYPAL_SECRET_KEY}`).toString('base64')}`
      },
      body: JSON.stringify({})
    });

    const data = await response.json();
    // console.log(data);

    try {
      const order = await prisma.order.create({
        data: {
          client_id: this.orderTemp!.client_id,
          service_id: this.orderTemp!.service_id,
          address: this.orderTemp!.address,
          location: this.orderTemp!.location,
          city: this.orderTemp!.city,
          zip_code: this.orderTemp!.zip_code,
          start_date: this.orderTemp!.start_date,
          end_date: this.orderTemp!.end_date,
          price: this.orderTemp!.price,
        }
      });

      console.log(order);

      this.orderTemp = null;
      
      return data;
      
    } catch (error) {
      throw CustomError.internalServer(`Error capturing order: ${error}`);
    }
  };

  public cancelOrder = async (id: string) => {
    return {
      msg: 'cancelOrder',
    };
  };
}
