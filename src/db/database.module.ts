import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import debugLib from 'debug';

// Create a debug instance for the database module
const dbug = debugLib('app:database');

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const isProduction = configService.get<string>('NODE_ENV') === 'production';
        const uri = isProduction
          ? configService.get<string>('MONGODB_URI_PROD') // Remote MongoDB URI
          : configService.get<string>('MONGODB_URI_DEV'); // Local MongoDB URI
        
        dbug(`Connecting to ${isProduction ? 'Production' : 'Local'} MongoDB`);

        return {
          uri,
          // MongoDB Driver 4.x+ automatically handles these configurations:
          // useNewUrlParser: true,
          // useUnifiedTopology: true,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
