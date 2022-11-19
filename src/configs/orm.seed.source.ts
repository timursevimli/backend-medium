import { DataSource } from 'typeorm';
import ormSeedConfig from './orm.seed.config';

export default new DataSource(ormSeedConfig);
