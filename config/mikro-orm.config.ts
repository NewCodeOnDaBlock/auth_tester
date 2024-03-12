import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import * as dotenv from 'dotenv';
import { defineConfig } from '@mikro-orm/mysql';
import { User } from 'src/users/entity/user.entity';
dotenv.config();

export default defineConfig({
  dbName: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  entities: [User],
  metadataProvider: TsMorphMetadataProvider,
  metadataCache: { enabled: true },
  migrations: {
    // tableName: 'mikro_orm_migrations',
    // path: './migrations',
    // transactional: true,
    // disableForeignKeys: false,
  },
  extensions: [],
});
