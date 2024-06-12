import { Injectable } from "@nestjs/common";
import { StorageProviderInterface } from "./storage-provider.interface";
import * as AWS from "@aws-sdk/client-s3";
import { nanoid } from "nanoid";


@Injectable()
export class AwsStorageProvider implements StorageProviderInterface {

  private readonly s3BucketName: string = process.env.STORAGE_S3_BUCKET_NAME;
  private readonly s3: AWS.S3;

  constructor() {
    this.s3 = new AWS.S3({
      credentials: {
        accessKeyId: process.env.STORAGE_ACCESS_KEY,
        secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY
      },
      region: process.env.STORAGE_S3_REGION
    });
  }

  private async s3Upload(file: Buffer, bucket: string, name: string, mimetype: string): Promise<AWS.PutObjectCommandInput> {
    const params: AWS.PutObjectCommandInput = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
      ACL: "public-read",
      ContentType: mimetype,
      ContentDisposition: "inline"
    };
    try {
      await this.s3.putObject(params);
      return params;
    } catch (e) {
      console.error("Error uploading to S3:", e);
      throw e; // Re-throw the error after logging it
    }
  }

  async deleteFile(fileName: string): Promise<void> {
    try {
      await this.s3.deleteObject({ Bucket: this.s3BucketName, Key: fileName });
    } catch (e) {
      console.error("Error deleting file from S3:", e);
      throw e;
    }
  }

  async deleteFiles(fileNames: string[]): Promise<void> {
    const objects = fileNames.map((key) => ({ Key: key }));
    try {
      await this.s3.deleteObjects({ Bucket: this.s3BucketName, Delete: { Objects: objects } });
    } catch (e) {
      console.error("Error deleting files from S3:", e);
      throw e;
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const mimeType = file.mimetype.split("/")[1];
    const fileName = `${nanoid()}.${mimeType}`;
    const uploadedFile = await this.s3Upload(
      file.buffer,
      this.s3BucketName,
      fileName,
      mimeType
    );
    return uploadedFile.Key; // Ensure Key is returned correctly
  }

  async uploadFiles(files: Express.Multer.File[]): Promise<string[]> {
    const uploadedFiles: string[] = [];
    for (const file of files) {
      const mimeType = file.mimetype.split("/")[1];
      const fileName = `${nanoid()}.${mimeType}`;
      await this.s3Upload(file.buffer, this.s3BucketName, fileName, mimeType);
      uploadedFiles.push(fileName);
    }
    return uploadedFiles;
  }

}
