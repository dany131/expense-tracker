import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import helmet from "helmet";
import { SwaggerModule } from "@nestjs/swagger";
import { createDocument } from "@swagger/swagger";
import { ConfigService } from "@nestjs/config";
import { WinstonModule } from "nest-winston";
import { instance } from "./logger/winston.logger";


async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true, bufferLogs: true, logger: WinstonModule.createLogger({
      instance
    })
  });

  const configService = app.get(ConfigService);
  const appPrefix: string = configService.get<string>("app.prefix");
  const docsPrefix: string = configService.get<string>("app.docsPrefix");
  const swaggerUser: string = configService.get<string>("app.swaggerAuthUser");
  const swaggerPassword: string = configService.get<string>("app.swaggerAuthPassword");
  const port: number = configService.get<number>("port");

  app.setGlobalPrefix(appPrefix);
  app.useGlobalPipes(new ValidationPipe({
    transform: true
  }));
  app.use(helmet());

  SwaggerModule.setup(docsPrefix, app, createDocument(app, docsPrefix, swaggerUser, swaggerPassword));

  await app.listen(port);
}

void bootstrap();
