import { Router } from "express";
import { OrderController } from "./controller";
import { OrdersService } from "../services";

export class OrderRoutes {
  
    static get routes() {
      const router = Router();
  
      const ordersService = new OrdersService();
      const controller = new OrderController(ordersService);

      //* /api/orders
      router.get('/', controller.getAllOrders);

      //* /api/orders/:id
      router.get('/:id', controller.getOrderById);

      //* /api/orders/client/:id
      router.get('/client/:id', controller.getOrdersByClientId);

      //* /api/orders/provider/:id
      router.get('/provider/:id', controller.getOrdersByProviderId);

      //* /api/orders
      router.post('/', controller.createOrder);

      //* /api/orders/:id
      router.put('/:id', controller.updateOrder);

      //* /api/orders/:id
      router.delete('/:id', controller.deleteOrder);

      return router;
    }
}

