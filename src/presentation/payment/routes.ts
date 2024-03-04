import { Router } from "express";
import { PaymentController } from "./controller";
import { PaymentService } from '../services/payment.service';

export class PaymentRoutes {

  static get routes() {
    const router = Router();

    const paymentService = new PaymentService();
    const controller = new PaymentController(paymentService);

    // Crea lo que tiene que pagar
    //* /api/payment/create-order
    router.post('/create-order', controller.createOrder);

    // Acepta el pago
    //* /api/payment/capture-order
    router.get('/capture-order', controller.captureOrder);

    // Cancela el pago
    //* /api/payment/cancel-order
    router.get('/cancel-order', controller.cancelOrder);

    return router;
  }
}
