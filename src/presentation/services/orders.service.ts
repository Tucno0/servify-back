import { UuidAdapter } from "../../config";
import { prisma } from '../../data/postgres/index';
import { OrderEntity, CustomError } from '../../domain';

export class OrdersService {
  
  public getAllOrders = async () => {
    const orders = await prisma.order.findMany({
      include: {
        client: {
          include: {
            user: true
          }
        },
        service: {
          include: {
            category: true,
            service_images: true
          }
        }
      }
    });

    // console.log(orders);

    return orders.map( order => OrderEntity.fromObject(order));
  }

  public getOrderById = async (id: string) => {
    if (!UuidAdapter.validate(id)) throw CustomError.badRequest('Invalid id');

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        client: {
          include: {
            user: true
          }
        },
        service: {
          include: {
            category: true,
            service_images: true
          }
        }
      },
    });

    if (!order) throw CustomError.notFound('Order not found');

    return OrderEntity.fromObject(order);
  }

  public getOrdersByClientId = async (clientId: string) => {
    if (!UuidAdapter.validate(clientId)) throw CustomError.badRequest('Invalid id');

    const orders = await prisma.order.findMany({
      where: { client_id: clientId},
      include: {
        client: {
          include: {
            user: true
          }
        },
        service: {
          include: {
            category: true,
            service_images: true
          }
        }
      },
    });

    // console.log(orders);

    if (!orders) throw CustomError.notFound('Orders not found');

    return orders.map( order => OrderEntity.fromObject(order));
  }

  public getOrdersByServiceId = async (serviceId: string) => {
    if (!UuidAdapter.validate(serviceId)) throw CustomError.badRequest('Invalid id');

    const orders = await prisma.order.findMany({
      where: { service_id: serviceId},
      include: {
        client: true,
        service: true
      },
    });

    if (!orders) throw CustomError.notFound('Orders not found');

    return orders.map( order => OrderEntity.fromObject(order));
  }

  public getOrdersByProviderId = async (providerId: string) => {
    if (!UuidAdapter.validate(providerId)) throw CustomError.badRequest('Invalid id');

    const data = await prisma.service_provider.findMany({
      where: { provider_id: providerId},
      include: {
        service: {
          include:{
            orders: {
              include: {
                client: {
                  include: {
                    user: true
                  }
                },
                service: {
                  include: {
                    category: true,
                    service_images: true
                  }
                }
              },
            }
          }
        }
      },
    });

    // console.log(orders);

    if (!data) throw CustomError.notFound('Order data not found');

    return data.map( item => {
      if ( item != null && item.service != null && item.service.orders != null) {
        return item.service.orders.map( order => OrderEntity.fromObject(order));
      }
    }).flat();
  }

  public createOrder = async (order: any) => {
    return {
      msg: 'Order created'
    };
  }

  public updateOrder = async (id: string, order: any) => {
    return {
      msg: 'Order updated'
    };
  }

  public deleteOrder = async (id: string) => {
    return {
      msg: 'Order deleted'
    };
  }
}
  