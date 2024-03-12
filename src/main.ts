import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { MikroORM } from '@mikro-orm/mysql';
import mikroOrmConfig from 'config/mikro-orm.config';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AppModule, {
    snapshot: true,
  });
  const orm = await MikroORM.init(mikroOrmConfig); // this initializes MikroORM

  // Automatically updates the database schema to match the entities - only for development
  const generator = await orm.getSchemaGenerator();
  await generator.updateSchema(); // clears the database and creates the schema from scratch

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.enableCors({
    origin: true, // Allow all origins, for now
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP Methods
    allowedHeaders: 'Content-Type, Accept', // Allowed HTTP Headers
    credentials: true, // Allows sessions/cookies to be sent
  });
  app.use(cookieParser()); // Enable cookie parsing

  const host = process.env.HOST || 'localhost';
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0', () => {
    console.log('Env Database Host ---> ' + process.env.DB_HOST);
    console.log('Env Database Port ---> ' + process.env.DB_PORT);
    console.log('Env Database User ---> ' + process.env.DB_USER);
    console.log('Env Database Connector ---> ' + process.env.DB_TYPE);
    console.log('Env Database Database ---> ' + process.env.DB_NAME);
    console.log('Env Database Debug ---> ' + process.env.DB_DEBUG);
    console.log('Config: %j', mikroOrmConfig);
    console.log(`Server running at ${host}:${port}/`);
  });
}
bootstrap();
