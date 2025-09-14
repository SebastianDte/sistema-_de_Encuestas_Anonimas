import { MailerModule } from "@nestjs-modules/mailer";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { strict } from "assert";
import { join } from "path";
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailService } from "./services/mail.service";


@Module({
    imports: [
        MailerModule.forRootAsync({
            useFactory: async (config: ConfigService) => ({
                transport: {
                    host: config.get('mail.emailHost'),
                    secure: false,
                    auth: {
                        user: config.get('mail.user'),
                        pass: config.get('mail.emailPassword'),
                    }
                },

                template: {
                    dir: join(__dirname, "templates"),
                    adapter: new HandlebarsAdapter(),
                    options: {
                        strict: true
                    }
                }

            }),
            inject: [ConfigService]
        })
    ],
    controllers:[],
    providers:[MailService],
    exports:[MailService]

})

export class MailModule{
    constructor() {
    }
}