import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import serverlessHttp from 'serverless-http';
import { config } from 'dotenv';

let cachedServer: any;

async function bootstrapServerless() {
  console.log('Bootstrapping serverless application...');
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: (req, callback) => callback(null, true),
  });
  app.use(helmet());

  await app.init();

  return app.getHttpAdapter().getInstance();
}

async function bootstrap() {
  config();
  console.log('Bootstrapping application...');
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: (req, callback) => callback(null, true),
  });
  app.use(helmet());
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

if (process.env.SERVERLESS) {
  exports.handler = async (event: any, context: any) => {
    if (!cachedServer) {
      cachedServer = await bootstrapServerless();
    }
    return serverlessHttp(cachedServer)(event, context);
  };
} else {
  bootstrap().catch(err => {
    console.error('Error during application bootstrap', err);
  });
}
