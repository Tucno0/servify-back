import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";
import { EmailUserDto } from "../../domain/dtos/auth/email-user.dto";

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

  public isEmailAvailable = (req: Request, res: Response) => {
    // Se crea una instancia del DTO para validar los datos recibidos
    const [error, isEmailAvailableDto] = EmailUserDto.create(req.body);

    // Se verifica si hay algún error
    if (error) return res.status(400).json({ error });

    return this.authService.isEmailAvailable(isEmailAvailableDto!)
      .then( isAvailable => res.json( isAvailable ))
      .catch( error => this.handleError(error, res));
  }

  public recoveryPassword = (req: Request, res: Response) => {
    // Se crea una instancia del DTO para validar los datos recibidos
    const [error, emailDto] = EmailUserDto.create(req.body);

    // Se verifica si hay algún error
    if (error) return res.status(400).json({ error });

    return this.authService.recoveryPassword(emailDto!)
      .then( (token) => res.json({ token }) )
      .catch( error => this.handleError(error, res));
  }

  public changePassword = (req: Request, res: Response) => {
    const { token, newPassword } = req.body;

    if (!token) return res.status(400).json({ error: 'Missing token' });
    if (!newPassword) return res.status(400).json({ error: 'Missing password' });
    if (newPassword.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });

    return this.authService.changePassword(token, newPassword)
      .then( message => res.json( message ))
      .catch( error => this.handleError(error, res));
  }

  public refreshToken = (req: Request, res: Response) => {

    const user: UserEntity = req.body.user;

    return this.authService.refreshToken(user)
      .then( resp => res.json( resp ))
      .catch( error => this.handleError(error, res));
  }
}