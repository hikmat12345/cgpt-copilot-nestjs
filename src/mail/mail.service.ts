import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from 'src/user/user.entity';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class MailService {
    constructor(private mailerService : MailerService,
        private prisma: PrismaService){}
    async sendUserConfirmation(user: User, token:string){
        const lead = this.prisma.leads.findUnique({
            where: {
                 email: user.email
            }
        })
        if (!lead){
            const saveLead= this.prisma.leads.create({
                  data:{
                    name: "hikmat",
                    email :"hikmat@test1.com" 
                  }
            })
        }
        const url = `AIcopilot.com/resetpassword?token=${token}`;
        this.mailerService.sendMail({
            to: user.email,
            subject: 'Welcome to AI Copilot! Please Confirm your Email',
            template : './templates/confirmation',
            context : {
                user :user.name,
                url 
            }
         })

    }
}
  