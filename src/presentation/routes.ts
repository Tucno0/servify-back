import { Router } from "express";
import { AuthRoutes } from "./auth/routes";

export class AppRoutes {
  static get routes() {
    const router = Router();

    //* Ruta de autenticacion
    router.use('/api/auth', AuthRoutes.routes)

    return router;
  }
}