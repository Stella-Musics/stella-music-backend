import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await configApiDoc(app);
  await app.listen(3000);
}
bootstrap();

async function configApiDoc(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle("스텔 플레이 API 문서")
    .setDescription("스텔 플레이의 API 문서입니다.")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api-docs", app, document);
}
