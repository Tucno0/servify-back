
export class CustomError extends Error {
  private constructor(
    public readonly statusCode: number,
    public readonly message: string,
  ) {
    super(message);
  }

  // Indica que la solicitud fue malformada o incorrecta.
  static badRequest(message: string) {
    return new CustomError(400, message);
  }

  // Indica que el usuario necesita autenticación para obtener la respuesta solicitada.
  static unauthorized(message: string) {
    return new CustomError(401, message);
  }

  // indica que el cliente no tiene permiso para acceder al recurso solicitado.
  static forbidden(message: string) {
    return new CustomError(403, message);
  }

  // indica que el recurso solicitado no se encontró en el servidor.
  static notFound(message: string) {
    return new CustomError(404, message);
  }

  // indica que la solicitud no se pudo completar debido a un conflicto con el estado actual del recurso.
  static conflict(message: string) {
    return new CustomError(409, message);
  }

  // indica que ocurrió un error interno en el servidor.
  static internalServer(message: string) {
    console.log(message);
    return new CustomError(500, message);
  }

  // indica que el servidor, mientras actuaba como puerta de enlace o proxy, recibió una respuesta inválida del servidor aguas arriba.
  static badGateway(message: string) {
    return new CustomError(502, message);
  }

  // indica que el servidor no está disponible temporalmente.
  static serviceUnavailable(message: string) {
    return new CustomError(503, message);
  }

  // indica que el servidor, mientras actuaba como puerta de enlace o proxy, no recibió una respuesta a tiempo del servidor aguas arriba.
  static gatewayTimeout(message: string) {
    return new CustomError(504, message);
  }
}