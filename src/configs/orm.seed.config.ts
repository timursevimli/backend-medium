import config from './orm.config';

const ormSeedConfig = {
	...config,
	migrations: [__dirname + '/../seeds/**/*{.ts,.js}'],
};

export default ormSeedConfig;
