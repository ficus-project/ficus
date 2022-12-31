import Env from '@ioc:Adonis/Core/Env';

const influxdbConfig = {
  host: Env.get('INFLUXDB_URL'),
  token: Env.get('INFLUXDB_TOKEN'),
  organization: Env.get('INFLUXDB_ORGANIZATION'),
};

export default influxdbConfig;
