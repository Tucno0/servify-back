import express, { Router } from 'express';
import path from 'path';
import compression from 'compression';

interface Options {
  port: number;
  routes: Router;
  publicPath?: string;
}

export class Server {
  public readonly app = express();
  private serverListener: any;

  private readonly port: number;
  private readonly publicPath: string;
  private readonly routes: Router;

  constructor(options: Options) {
    const { port, routes, publicPath = 'public' } = options;

    this.port = port;
    this.publicPath = publicPath;
    this.routes = routes;
  }

  async start() {
    //* Middlewares
    // Parsea el body a JSON que viene en el request (raw)
    this.app.use(express.json());
    // Parsea el body a JSON que viene en el request (form-data - x-www-form-urlencoded)
    this.app.use(express.urlencoded({ extended: true }));
    // compression() es un middleware que sirve para comprimir las respuestas HTTP.
    // Esto es útil para reducir el tamaño de las respuestas y mejorar la velocidad de carga de las páginas web.
    // https://www.npmjs.com/package/compression
    this.app.use(compression())

    //* Public Folder
    this.app.use( express.static( this.publicPath ) );

    //* Routes
    this.app.use(this.routes);

    //* 404 - Si no encuentra ninguna ruta, devuelve el index.html
    //* SPA /^\/(?!api).*/  <== Únicamente si no empieza con la palabra api
    this.app.get('*', (req, res) => {
      const indexPath = path.join( __dirname + `../../../${ this.publicPath }/index.html` );
      res.sendFile(indexPath);
    });

    this.serverListener = this.app.listen(this.port, () => {
      console.log(`Server running on http://localhost:${this.port}`);
    });
  }

  public close = () => {
    this.serverListener?.close();
  };
}