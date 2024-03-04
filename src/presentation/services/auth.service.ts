import { JwtAdapter, bcryptAdapter, envs } from '../../config';
import { prisma } from '../../data/postgres';
import { CustomError, EmailUserDto, LoginUserDto, RegisterUserDto, UserEntity } from '../../domain';
import { EmailService } from './email.service';

export class AuthService {
  constructor(
    private readonly emailService: EmailService,
  ) {}

  public async loginUser(loginUserDto: LoginUserDto) {
    // Se verifica si el email existe en la base de datos de postgres
    const user = await prisma.user.findUnique({
      where: { email: loginUserDto.email },
    });

    // Si no existe se retorna un bad request
    if (!user) throw CustomError.badRequest('Email not exists');

    // Se verifica si la contraseña es correcta con bcrypt
    const isCorrectPassword = bcryptAdapter.compare(loginUserDto.password, user.password);

    // Si la contraseña es incorrecta se retorna un bad request
    if (!isCorrectPassword) throw CustomError.badRequest('Password is incorrect');
    // console.log(user);
    // Transformar el objeto de tipo UserModel a UserEntity para retornarlo
    const { password, ...userEntity } = UserEntity.fromObject(user);

    // Generar JWT para mantener la autenticación del usuario con el id del usuario como payload
    const token = await JwtAdapter.generateToken({ id: userEntity.id });

    // Si no se pudo generar el token se retorna un error 500
    if (!token) throw CustomError.internalServer('Error while generating token');

    return {
      user: userEntity,
      token,
    };
  }

  public async registerUser(registerUserDto: RegisterUserDto) {
    // Se verifica si el email ya existe en la base de datos de postgres
    const existUser = await prisma.user.findUnique({
      where: { email: registerUserDto.email },
    });

    // Si ya existe se retorna un error
    if (existUser) throw CustomError.badRequest('Email already exists');

    try {
      // Encryptar la contraseña del usuario con bcrypt
      const passwordEncripted = bcryptAdapter.hash(registerUserDto.password);

      // Se crea un nuevo usuario en la base de datos de postgres
      const user = await prisma.user.create({
        data: {
          name: registerUserDto.name,
          last_name: registerUserDto.lastName,
          email: registerUserDto.email,
          password: passwordEncripted,
        },
      });
      
      // Generar JWT para mantener la autenticación del usuario
      const token = await JwtAdapter.generateToken({ id: user.id });

      // Si no se pudo generar el token se retorna un error 500
      if (!token) throw CustomError.internalServer('Error while generating token');

      // enviar Email de confirmación de cuenta
      await this.sendEmailValidationLink(user.email);

      // Transformar el objeto de tipo UserModel a UserEntity para retornarlo
      const { password, ...userEntity } = UserEntity.fromObject(user);

      return {
        user: userEntity,
        token,
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  private sendEmailValidationLink = async (email: string): Promise<boolean> => {
    // Generar JWT para mantener la autenticación del usuario con el email del usuario como payload
    const token = await JwtAdapter.generateToken({ email });

    // Si no se pudo generar el token se retorna un error 500
    if (!token) throw CustomError.internalServer('Error while generating token');

    // Se crea el link de confirmación de cuenta con el token generado
    // !se crea una dependencia oculta con el archivo .env
    const link = `${envs.WEBSERVICE_URL}/auth/confirm-email?token=${token}`;
    // const link = `http://localhost:3000/api/auth/validate-email/${token}`;

    // Se crea el html del correo electrónico con el link de confirmación de cuenta
    const html = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              padding: 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 40px;
              border-radius: 5px;
              box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }
            h1 {
              color: #333333;
              font-size: 24px;
              margin-bottom: 20px;
            }
            p {
              color: #666666;
              font-size: 16px;
              margin-bottom: 20px;
            }
            a {
              display: inline-block;
              background-color: #007bff;
              color: #ffffff;
              text-decoration: none;
              padding: 10px 20px;
              border-radius: 5px;
            }
          </style>
        </head>

        <body>
          <div class="container">
            <h1>Confirmación de cuenta</h1>
            <p>¡Gracias por registrarte! Haz clic en el siguiente enlace para confirmar tu cuenta:</p>
            <a href="${link}">Confirmar cuenta</a>
          </div>
        </body>
      </html>
    `;
    
    // Se configuran los datos del correo electrónico
    const options = {
      to: email, // Correo electrónico del destinatario
      subject: 'Confirmación de cuenta', // Asunto del correo electrónico
      htmlBody: html, // Cuerpo del correo electrónico
    };
    
    // Se envía el correo electrónico
    const isEmailSent = await this.emailService.sendEmail(options);
    // Si no se pudo enviar el correo electrónico se retorna un error 500
    if (!isEmailSent) throw CustomError.internalServer('Error while sending email');

    return true;
  }

  public validateEmail = async (token: string): Promise<boolean> => {
    // Se verifica si el token es válido con el servicio de JWT
    const payload = await JwtAdapter.validateToken(token);
    // Si el token no es válido se retorna un error 401
    if (!payload) throw CustomError.unauthorized('Token is invalid');

    // Se obtiene el email del payload del token y se parsea a string para poderlo usar
    const { email } = payload as { email: string };
    // Si no se pudo obtener el email se retorna un error 400
    if (!email) throw CustomError.internalServer('Email not found in token');

    // Se verifica si el email existe en la base de datos de postgres
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Si no existe se retorna un error 400
    if (!user) throw CustomError.internalServer('Email not exists');

    // Se guarda en la base de datos que el email del usuario ya está validado
    await prisma.user.update({
      where: { email },
      data: { email_validated: true },
    });

    return true;
  }

  public isEmailAvailable = async (isEmailAvailableDto: EmailUserDto) => {
    // Se verifica si el email existe en la base de datos de postgres
    const user = await prisma.user.findUnique({
      where: { email: isEmailAvailableDto.email },
    });
    
    // Si el email ya existe se retorna un objeto con isAvailable en false
    if (user) return { isAvailable: false }; 

    // Y si no, se retorna un objeto con isAvailable en true
    return { isAvailable: true };
  }

  public recoveryPassword = async (emailUserDto: EmailUserDto) => {
    // Se verifica si el email existe en la base de datos de postgres
    const user = await prisma.user.findUnique({
      where: { email: emailUserDto.email },
    });

    // Si no existe se retorna un error 400
    if (!user) throw CustomError.badRequest('Email not exists');

    // Generar JWT para mantener la autenticación del usuario con el email del usuario como payload
    const token = await JwtAdapter.generateToken({ email: user.email });

    // Si no se pudo generar el token se retorna un error 500
    if (!token) throw CustomError.internalServer('Error while generating token');

    // Se crea el link de recuperación de contraseña con el token generado
    // !se crea una dependencia oculta con el archivo .env
    const link = `${envs.WEBSERVICE_URL}/auth/change-password?token=${token}`;

    // Se crea el html del correo electrónico con el link de recuperación de contraseña
    const html = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              padding: 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 40px;
              border-radius: 5px;
              box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }
            h1 {
              color: #333333;
              font-size: 24px;
              margin-bottom: 20px;
            }
            p {
              color: #666666;
              font-size: 16px;
              margin-bottom: 20px;
            }
            a {
              display: inline-block;
              background-color: #007bff;
              color: #ffffff;
              text-decoration: none;
              padding: 10px 20px;
              border-radius: 5px;
            }
          </style>
        </head>

        <body>
          <div class="container">
            <h1>Recuperación de contraseña</h1>
            <p>Haz clic en el siguiente enlace para recuperar tu contraseña:</p>
            <a href="${link}">Recuperar contraseña</a>
          </div>
        </body>
      </html>
    `;

    // Se configuran los datos del correo electrónico
    const options = {
      to: user.email, // Correo electrónico del destinatario
      subject: 'Recuperación de contraseña', // Asunto del correo electrónico
      htmlBody: html, // Cuerpo del correo electrónico
    };

    // Se envía el correo electrónico
    const isEmailSent = await this.emailService.sendEmail(options);
    // Si no se pudo enviar el correo electrónico se retorna un error 500
    if (!isEmailSent) throw CustomError.internalServer('Error while sending email');

    return token;
  }

  public changePassword = async (token: string, newPassword: string) => {
    // Se verifica si el token es válido con el servicio de JWT
    const payload = await JwtAdapter.validateToken(token);
    // Si el token no es válido se retorna un error 401
    if (!payload) throw CustomError.unauthorized('Token is invalid');

    // Se obtiene el email del payload del token y se parsea a string para poderlo usar
    const { email } = payload as { email: string };
    // console.log(email);
    // Si no se pudo obtener el email se retorna un error 400
    if (!email) throw CustomError.internalServer('Email not found in token');

    // Se verifica si el email existe en la base de datos de postgres
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Si no existe se retorna un error 400
    if (!user) throw CustomError.internalServer('Email not exists');

    // Encryptar la contraseña del usuario con bcrypt
    const passwordEncripted = bcryptAdapter.hash(newPassword);

    // Se actualiza la contraseña del usuario en la base de datos de postgres
    await prisma.user.update({
      where: { email },
      data: { password: passwordEncripted },
    });

    return { message: 'Password was changed'};
  }

  public refreshToken = async (user: UserEntity) => {
    // Generar JWT para mantener la autenticación del usuario
    const token = await JwtAdapter.generateToken({ id: user.id });

    // Si no se pudo generar el token se retorna un error 500
    if (!token) throw CustomError.internalServer('Error while generating token');

    // Excluir la contraseña del usuario para retornar el objeto
    const { password, ...rest } = user;

    return { user: rest, token };
  }
}
