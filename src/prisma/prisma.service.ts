import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';


@Injectable()
export class PrismaService extends PrismaClient{
    constructor (
        private config : ConfigService
    ){
        super({
            datasources:{
                db :{
                    url : config.get('DATABASE_URL')
                    // "postgresql://postgres:postgres@localhost:5050/AIC_DB?schema=public"
                }
            }
        });
    }
 
    // cleanDb() {
    //     return this.$transaction({
    //         // delete db by 
    //         // this.user.deleteMany(),
    //     })
    // }
}

