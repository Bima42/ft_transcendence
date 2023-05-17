import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express'
import * as cookieParser from 'cookie-parser';
import { join } from 'path';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);

	// Use ValidationPipe to validate all inputs
	app.useGlobalPipes(new ValidationPipe());

	// Use cookie parser middleware
	app.use(cookieParser());

	app.setGlobalPrefix('api');

	app.enableCors({
		origin: process.env.FRONTEND_URL,
		credentials: true,
		allowedHeaders: 'Content-Type, Authorization, Cookie',
		methods: 'GET,PUT,PATCH,POST,DELETE',
	});


	const staticAssetsPath = join(__dirname, '../..', 'uploads')
	app.useStaticAssets(staticAssetsPath, {
		prefix: '/api/uploads/',
	})

	const config = new DocumentBuilder()
		.setTitle('Transcendence')
		.setDescription('Transcendence API')
		.setVersion('0.1')
		.addTag('Chat')
		.addBearerAuth({
				type: 'http',
				scheme: 'bearer',
				bearerFormat: 'JWT',
				in: 'header',
			},
			'JWT')
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);

	await app.listen(3080);
}

bootstrap();
