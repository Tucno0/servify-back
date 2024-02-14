import nodemailer, { Transporter } from 'nodemailer';

// Se crea una interfaz para definir los parámetros que se van a recibir para enviar un correo electrónico
export interface SendMailOptions {
  to: string | string[]; // A quien se le va a enviar el correo electrónico
  subject: string; // Asunto del correo electrónico
  htmlBody: string; // Cuerpo del correo electrónico
  attachments?: Attachment[];  // Archivos adjuntos
}

export interface Attachment {
  filename: string; // Nombre del archivo adjunto
  path: string; // Ruta del archivo adjunto
}

export class EmailService {
  private transporter: Transporter;

  constructor(
    private readonly mailerService: string,
    private readonly mailerEmail: string,
    private readonly senderEmailPassword: string,
    private readonly postToProvider: boolean,
  ) {
    // Se crea el transporter con los datos del servicio de correo electrónico y el correo electrónico del remitente con su contraseña para enviar correos electrónicos
    this.transporter = nodemailer.createTransport({
      service: this.mailerService, // Servicio de correo electrónico como Gmail
      auth: { // Datos del correo electrónico del remitente
        user: this.mailerEmail, // Correo electrónico del remitente
        pass: this.senderEmailPassword, // Contraseña del correo electrónico del remitente
      },
    });
  }

  public async sendEmail (options: SendMailOptions): Promise<boolean> {
    const { to, subject, htmlBody, attachments } = options;

    try {
      // Si la variable de entorno SEND_EMAIL es false, no se envía el correo electrónico
      if(!this.postToProvider) return true;

      const sentInformation = await this.transporter.sendMail({
        to, // Correo electrónico del destinatario
        subject, // Asunto del correo electrónico
        html: htmlBody, // Cuerpo del correo electrónico
        attachments, // Archivos adjuntos
      });

      console.log(sentInformation);

      return true;
      
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}