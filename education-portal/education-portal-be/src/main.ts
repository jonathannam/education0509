import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { EnvironmentConfiguration } from './app/infrastructures/config';
import { TypeOrmErrorExceptionFilter } from './app/infrastructures/exceptions';
import { BadRequestExceptionFilter } from './app/infrastructures/exceptions/bad-request-exception.filter';
import {
  ParseQueryParamsInterceptor,
  SuccessResponseFormatInterceptor,
} from './app/infrastructures/interceptors';
import { WinstonLogger } from './app/infrastructures/loggers';

function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Nestjs Conduit')
    .setDescription('Nestjs Conduit API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
}

function configureApp(app: INestApplication): void {
  app.enableCors({
    origin:
      process.env.NODE_ENV === 'production'
        ? 'http://3.232.7.39:4200'
        : 'http://localhost:4200',
  });
  app.useGlobalInterceptors(
    new SuccessResponseFormatInterceptor(),
    new ParseQueryParamsInterceptor(),
  );
  app.useGlobalFilters(
    new TypeOrmErrorExceptionFilter(),
    new BadRequestExceptionFilter(),
  );
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new WinstonLogger(),
  });
  const configService = app.get(ConfigService<EnvironmentConfiguration>);
  configureApp(app);
  setupSwagger(app);
  await app.listen(configService.get('listeningPort', { infer: true }));
}

bootstrap();
