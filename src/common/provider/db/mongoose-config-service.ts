import { Injectable } from "@nestjs/common";
import { MongooseOptionsFactory, MongooseModuleOptions } from "@nestjs/mongoose";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  private readonly URI: string;
  private readonly NAME: string;

  constructor(private readonly configService: ConfigService) {
    this.URI = this.configService.get<string>("mongo.uri");
    this.NAME = this.configService.get<string>("mongo.db");
  }

  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: `${this.URI}${this.NAME}?retryWrites=true&w=majority`
    };
  }
}
