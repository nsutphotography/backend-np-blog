import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './db/database.module';
// import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { BlogModule } from './blog/blog.module';
import { JwtStrategy } from './auth/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true,}),
    DatabaseModule,
    UserModule,
    BlogModule,
  ],
  controllers: [AppController],
  providers: [AppService,JwtStrategy],
})
export class AppModule {}
