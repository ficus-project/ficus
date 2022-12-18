import Factory from '@ioc:Adonis/Lucid/Factory';
import Ficus from '../../app/Models/Ficus';

export default Factory.define(Ficus, ({ faker }) => ({
  name: faker.word.noun(),
})).build();
