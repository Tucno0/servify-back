import { Router } from "express";
import { AuthController } from "./controller";
import { envs } from "../../config";
import { EmailService, AuthService } from "../services";
import { AuthMiddleware } from "../middlewares";

export class AuthRoutes {

  static get routes() {
    const router = Router();

    // Se crea una instancia del servicio de correo electrónico para inyectarla en el servicio de autenticacion (AuthService) 
    const emailService: EmailService = new EmailService(
      envs.MAILER_SERVICE,
      envs.MAILER_EMAIL,
      envs.MAILER_SECRET_KEY,
      envs.SEND_EMAIL,
    );

    // Se crea una instancia del servicio de autenticacion para inyectarla en el controlador
    // Se inyecta el servicio de correo electrónico en el servicio de autenticacion
    const authService: AuthService = new AuthService(emailService);

    // Se crea una instancia del controlador para inyectarla en las rutas
    const controller = new AuthController(authService);

    //* /api/auth/login
    router.post('/login', controller.loginUser);

    //* /api/auth/register
    router.post('/register', controller.registerUser);

    //* /api/auth/refresh-token
    router.post('/refresh-token', [ AuthMiddleware.validateJWT ], controller.refreshToken)

    //* /api/auth/validate-email/:token
    router.get('/validate-email/:token', controller.validateEmail);

    //* /api/auth/is-email-available
    router.post('/is-email-available', controller.isEmailAvailable);

    //* /api/auth/recovery
    router.post('/recovery', controller.recoveryPassword);

    //* /api/auth/change-password
    router.post('/change-password', controller.changePassword);

    return router;
  }
}