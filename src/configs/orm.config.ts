import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const config: PostgresConnectionOptions = {
	type: 'postgres',
	host: 'localhost',
	port: 5432,
	username: 're_mediumclone',
	password: '123',
	database: 're_mediumclone',
	entities: [__dirname + '/../**/*.entity{.ts,.js}'],
	synchronize: false,
	migrations: [__dirname + '/../migrations/**/*{.ts,.js}'],
};

export default config;
