import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist:true,  //it remove the extrap values from client side if it;s not in the DTO
  }));
      // app.useGlobalPipes is apply the validation pipe for user inputs 
  await app.listen(3000);
}
bootstrap();
 