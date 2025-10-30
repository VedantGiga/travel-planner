const axios = require('axios');

class HotelFlightFinderAgent {
  constructor() {
    this.name = 'Hotel & Flight Finder Agent';
  }

  async searchOptions(intent) {
    const { from, destination, budget, duration } = intent;
    
    const [flights, hotels, trains, activities] = await Promise.all([
      this.searchFlights(from, destination),
      this.searchHotels(destination, budget),
      this.searchTrains(from, destination),
      this.searchActivities(destination)
    ]);

    return { flights, hotels, trains, activities };
  }

  async searchFlights(origin, destination) {
    try {
      if (origin.toLowerCase() === destination.toLowerCase()) {
        return [];
      }
      
      const originCode = this.getAirportCode(origin);
      const destCode = this.getAirportCode(destination);
      
      const response = await axios.get('http://api.aviationstack.com/v1/flights', {
        params: {
          access_key: '8f686e07f895c08460175b139b6e658a',
          dep_iata: originCode,
          arr_iata: destCode,
          limit: 3
        }
      });

      if (response.data?.data && response.data.data.length > 0) {
        return response.data.data.map((flight, index) => ({
          id: flight.flight?.iata || `flight_${index}`,
          airline: flight.airline?.name || 'Airline',
          departure: flight.departure?.scheduled?.split('T')[1]?.substring(0, 5) || '09:00',
          arrival: flight.arrival?.scheduled?.split('T')[1]?.substring(0, 5) || '11:00',
          duration: '2h 30m',
          price: Math.floor(Math.random() * 3000) + 3000,
          stops: 0
        }));
      }
      
      return this.getMockFlights(origin, destination);
    } catch (error) {
      console.error('Flight search error:', error.message);
      return this.getMockFlights(origin, destination);
    }
  }

  getMockFlights(origin, destination) {
    return [
      {
        id: '1',
        airline: 'IndiGo',
        departure: '09:30',
        arrival: '11:45',
        duration: '2h 15m',
        price: 4500,
        stops: 0
      },
      {
        id: '2', 
        airline: 'SpiceJet',
        departure: '14:20',
        arrival: '16:50',
        duration: '2h 30m',
        price: 3800,
        stops: 0
      }
    ];
  }

  async searchHotels(destination, budget) {
    try {
      const response = await fetch(`https://booking-com15.p.rapidapi.com/api/v1/hotels/searchDestination?query=${destination}`, {
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || '8f686e07f895c08460175b139b6e658a',
          'X-RapidAPI-Host': 'booking-com15.p.rapidapi.com'
        }
      });
      
      const data = await response.json();
      
      if (data?.data?.length > 0) {
        return data.data.slice(0, 3).map(hotel => ({
          id: hotel.dest_id,
          name: hotel.label || `Hotel in ${destination}`,
          price: Math.floor(budget * 0.25 / 5),
          rating: (4.0 + Math.random()).toFixed(1),
          location: destination,
          description: `Quality accommodation in ${destination}`,
          amenities: ['WiFi', 'AC', 'Room Service'],
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=400&fit=crop"
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Hotel search error:', error);
      return [];
    }
  }

  async searchTrains(origin, destination) {
    return [];
  }

  async searchActivities(destination) {
    const places = await this.getDestinationPlaces(destination);
    return places;
  }

  async getDestinationPlaces(destination) {
    try {
      const response = await fetch(`https://travel-advisor.p.rapidapi.com/locations/search?query=${destination}&limit=1`, {
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || '8f686e07f895c08460175b139b6e658a',
          'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
        }
      });
      
      const searchData = await response.json();
      
      if (searchData?.data?.[0]?.result_object?.location_id) {
        const locationId = searchData.data[0].result_object.location_id;
        
        const attractionsResponse = await fetch(`https://travel-advisor.p.rapidapi.com/attractions/list?location_id=${locationId}&currency=INR&lang=en_US&limit=10`, {
          headers: {
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || '8f686e07f895c08460175b139b6e658a',
            'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
          }
        });
        
        const attractionsData = await attractionsResponse.json();
        
        if (attractionsData?.data) {
          return attractionsData.data.map(attraction => ({
            name: attraction.name,
            price: Math.floor(Math.random() * 500) + 100,
            duration: '2-3 hours',
            rating: parseFloat(attraction.rating) || 4.0,
            category: attraction.subcategory?.[0]?.name || 'Attraction',
            description: attraction.description || `Popular attraction in ${destination}`,
            image: attraction.photo?.images?.medium?.url || 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6b?w=400&h=300&fit=crop'
          })).filter(place => place.name);
        }
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching attractions:', error);
      return [];
    }
  }

  getAirportCode(city) {
    const codes = {
      'Delhi': 'DEL', 'Mumbai': 'BOM', 'Bangalore': 'BLR',
      'Chennai': 'MAA', 'Kolkata': 'CCU', 'Goa': 'GOI',
      'Jaipur': 'JAI', 'Paris': 'CDG', 'London': 'LHR'
    };
    return codes[city.charAt(0).toUpperCase() + city.slice(1).toLowerCase()] || 'DEL';
  }
}

module.exports = HotelFlightFinderAgent;