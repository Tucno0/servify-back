import { Router } from "express";
import { AuthRoutes } from "./auth/routes";
import { CategoryRoutes } from "./category/routes";
import { ServiceRoutes } from "./service/routes";
import { ProviderRoutes } from "./provider/routes";

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

    return router;
  }
}