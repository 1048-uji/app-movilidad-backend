import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
  .setTitle('APP-Movilidad API')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
  const document = SwaggerModule.createDocument(app, config);

  app.enableCors({
    allowedHeaders: "*",
    origin: "*",
    methods: "*"
  });

  SwaggerModule.setup("docs", app, document);

  await app.listen(parseInt(process.env.PORT) || 3000);
  console.log('Server is running on port: ', process.env.PORT)
}
bootstrap();
