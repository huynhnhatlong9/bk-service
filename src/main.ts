import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: true});
  app.useGlobalPipes(new ValidationPipe({transform: true, whitelist: true}));
  // app.useStaticAssets(join(__dirname, "..", "upload"));
  // add swagger module
  const config = new DocumentBuilder()
    .setTitle("[BK Student APIs]")
    .setDescription("The RESTful APIs from me")
      .setVersion('1.0')
      .addTag('BK')
      .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3007);
}

bootstrap();
