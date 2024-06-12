import * as fs from "fs";
import * as handlebars from "handlebars";
import * as nodemailer from "nodemailer";
import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";


@Injectable()
export class MailHelper {
  constructor(private configService: ConfigService) {
  }

  private readonly host = this.configService.get<string>("mailing.host");
  private readonly port = this.configService.get<number>("mailing.port");
  private readonly user = this.configService.get<string>("mailing.user");
  private readonly pass = this.configService.get<string>("mailing.pass");
  private readonly filePath = `${process.cwd()}/src/public`;
  private readonly from: string = "'Expense Tracker' no-reply@expencetracker.com";

  private async mailerConfig(templatePath: string, mailConfig: any) {
    const source = fs.readFileSync(templatePath, "utf-8").toString();
    const template = handlebars.compile(source);
    const replacements = { ...mailConfig };
    const htmlToSend = template(replacements);
    let transporter = nodemailer.createTransport({
      host: this.host, port: this.port,
      secure: true, // true for 465, false for other ports
      auth: { user: this.user, pass: this.pass }
    });
    const mailOptions = {
      from: this.from,
      to: mailConfig.email,
      subject: mailConfig.subject,
      attachments: [
        {
          filename: "logo.png",
          path: `${this.filePath}/logo.png`,
          cid: "logoImage"
        }
      ],
      html: htmlToSend
    };
    const info = await transporter.sendMail(mailOptions);
    console.log(`Message sent to: ${mailConfig.email} id: ${info.messageId}`);
  }

  async sendEmail(email: string, subject: string, text: string, code: string, footer: string): Promise<void> {
    await this.mailerConfig(`${this.filePath}/mail/email.html`, { email, subject, text, code, footer });
  }

}