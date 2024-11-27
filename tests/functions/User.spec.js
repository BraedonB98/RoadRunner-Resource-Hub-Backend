/*const RizzService = require('../../controllers/rizz-controller');
const Rizz = require('../../database/model/Rizz');
const { setup } = require('../setup');
setup();

describe('Getting the rizz', () => {
  it('should return the rizzes added to the database', async () => {
    await Rizz.create([{ text: 'First Rizz' }, { text: 'Second Rizz' }]);
    const result = await RizzService.GetLatestRizz();
    expect(result.total_docs).toBe(2);
  });
});

describe('Liking a rizz', () => {
  it('should increase the likes count of a rizz', async () => {
    const rizz = await Rizz.create({ text: 'First Rizz' });
    await RizzService.LikeRizz(rizz._id);
    const updatedRizz = await Rizz.findById(rizz._id);
    expect(updatedRizz.likes).toBe(1);
  });
}); */
