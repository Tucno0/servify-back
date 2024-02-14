import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { CustomError, LoginUserDto, RegisterUserDto } from "../../domain";

export class AuthController {
  // Inyeccion de Dependencias (DI)
  constructor(
    public readonly authService: AuthService,
  ) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.log(`${error}`);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
  
  public loginUser = async (req: Request, res: Response) => {
    // Se crea una instancia del DTO para validar los datos recibidos que son el email y la contraseña
    const [error, loginUserDto] = LoginUserDto.create(req.body);

    // Se verifica si hay algún error
    if (error) return res.status(400).json({ error });

    return this.authService.loginUser(loginUserDto!)
      .then( user => res.json(user))
      .catch( error => this.handleError(error, res));
  }

  public registerUser = async (req: Request, res: Response) => {
    // Se crea una instancia del DTO para validar los datos recibidos
    const [error, registerDto] = RegisterUserDto.create(req.body);

    // Se verifica si hay algún error
    // Si hay un error se retorna un error 400 con el mensaje del error en formato JSON
    if (error) return res.status(400).json({error});

    return this.authService.registerUser(registerDto!)
      .then( user => res.json(user))
      .catch( error => this.handleError(error, res));
  }

  public validateEmail = (req: Request, res: Response) => {
    // Se obtiene el token de la url para validar el email del usuario
    const { token } = req.params;
    
    this.authService.validateEmail(token)
      .then( () => res.json('Email was validate properly') )
      .catch( error => this.handleError(error, res) );
  }

}