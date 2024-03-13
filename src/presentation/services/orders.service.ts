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
          client: true,
          service: true
        },
      });
  
      if (!order) throw CustomError.notFound('Order not found');
  
      return OrderEntity.fromObject(order);
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
  