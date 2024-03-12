import * as dotenv from 'dotenv';
dotenv.config();

export const jwtConstants = {
  secret: 'testtest',
  signOptions: { expiresIn: '5m' },
};
