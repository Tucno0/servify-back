import { Router } from "express";
import { AuthRoutes } from "./auth/routes";
import { CategoryRoutes } from "./category/routes";
import { ServiceRoutes } from "./service/routes";
import { ProviderRoutes } from "./provider/routes";
import { PaymentRoutes } from './payment/routes';
import { ClientRoutes } from "./client/routes";

export class AppRoutes {
  static get routes() {
    const router = Router();

    //* Ruta de autenticacion
    router.use('/api/auth', AuthRoutes.routes)

    //* Ruta de categorias
    router.use('/api/categories', CategoryRoutes.routes)

    //* Ruta de servicios
    router.use('/api/services', ServiceRoutes.routes)

    //* Ruta de proveedores
    router.use('/api/providers', ProviderRoutes.routes)

    //* Ruta de clientes
    router.use('/api/clients', ClientRoutes.routes)

    //* Ruta de pagos
    router.use('/api/payment', PaymentRoutes.routes)

    return router;
  }
}