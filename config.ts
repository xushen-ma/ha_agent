import dotenv from 'dotenv';

dotenv.config();

export default {
  host: process.env.HA_HOST as string,
  token: process.env.TOKEN as string,
};