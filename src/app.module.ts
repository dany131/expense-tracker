import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { APP_GUARD } from "@nestjs/core";
import { ConfigModule, ConfigService } from "@nestjs/config";
import configuration from "@config/configuration";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { AppService } from "./app.service";
import { AppController } from "./app.controller";
import { AtGuard, RolesGuard } from "@guards/index";
import { MongooseConfigService } from "@provider/db/mongoose-config-service";
import { AdminModule } from "@routes/admin/admin.module";
import { AuthModule } from "@routes/auth/auth.module";
import { UserModule } from "@routes/user/user.module";
import { ExpenseModule } from "@routes/expense/expense.module";


@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.ENVIRONMENT}`,
      load: [configuration]
    }),
    // DB connection
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
      inject: [ConfigService]
    }),
    // Request rate limiting - 50 requests per IP in 1 minute (60 seconds)
    ThrottlerModule.forRoot({ throttlers: [{ name: "Request-Limit", ttl: 60 * 1000, limit: 50 }] }),
    // Routes
    AuthModule, AdminModule, UserModule, ExpenseModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: AtGuard },
    { provide: APP_GUARD, useClass: RolesGuard }
  ]
})
export class AppModule {
}