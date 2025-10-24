const IndianRailService = require('./services/IndianRailService');

async function testTrainAPI() {
  const railService = new IndianRailService();
  
  try {
    console.log('Testing train search: Delhi to Mumbai...');
    const trains = await railService.searchTrains('Delhi', 'Mumbai', new Date());
    
    console.log(`Found ${trains.length} trains:`);
    trains.forEach(train => {
      console.log(`${train.trainNumber} - ${train.trainName}`);
      console.log(`  Departure: ${train.departure} | Arrival: ${train.arrival}`);
      console.log(`  Duration: ${train.duration}`);
      console.log(`  Prices: SL: ₹${train.price.sleeper}, 3AC: ₹${train.price.ac3}, 2AC: ₹${train.price.ac2}`);
      console.log('---');
    });
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testTrainAPI();