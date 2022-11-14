import { DataSource } from 'typeorm';
import ormConfig from './orm.config';

const dataSource = new DataSource(ormConfig);
export default dataSource;
