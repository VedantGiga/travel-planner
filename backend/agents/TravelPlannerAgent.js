const { ChatGroq } = require('@langchain/groq');
const { PromptTemplate } = require('@langchain/core/prompts');
const axios = require('axios');

class TravelPlannerAgent {
  constructor() {
    this.llm = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      model: 'llama-3.1-8b-instant',
      temperature: 0.7
    });
  }

  async extractIntent(userMessage) {
    const prompt = PromptTemplate.fromTemplate(`
      Extract travel intent from this user message for Indian travel and return ONLY valid JSON:
      
      Message: "{input}"
      
      Extract budget from numbers like "2000rs", "5000 rupees", "₹3000", etc.
      Extract duration from "2 days", "3 day", etc.
      
      Return exactly this JSON format with Indian cities and INR budget:
      {{
        "from": "extracted_origin_city",
        "destination": "extracted_destination_city",
        "tripType": "leisure",
        "budget": extracted_budget_number,
        "duration": extracted_duration_number,
        "travelers": 2,
        "preferences": ["sightseeing"]
      }}
    `);
    
    try {
      const formattedPrompt = await prompt.format({ input: userMessage });
      
      const result = await this.llm.invoke(formattedPrompt);
      
      // Clean the response to extract JSON
      let cleanedResponse = result.content.trim();
      
      // Remove markdown code blocks if present
      cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      // Find JSON object in the response
      const jsonMatch = cleanedResponse.match(/\{[^}]+\}/s);
      if (jsonMatch) {
        cleanedResponse = jsonMatch[0];
      }
      
      const parsed = JSON.parse(cleanedResponse);
      
      return parsed;
    } catch (error) {
      // Extract from message
      const fromToMatch = userMessage.match(/(?:from\s+)?([a-zA-Z]+)\s+to\s+([a-zA-Z]+)/i);
      const budgetMatch = userMessage.match(/(\d+)\s*(?:rs|rupees?|inr|₹)/i);
      const durationMatch = userMessage.match(/(\d+)\s*days?/i);
      
      if (fromToMatch) {
        return {
          from: fromToMatch[1].trim(),
          destination: fromToMatch[2].trim(),
          tripType: "leisure",
          budget: budgetMatch ? parseInt(budgetMatch[1]) : 25000,
          duration: durationMatch ? parseInt(durationMatch[1]) : 5,
          travelers: 2,
          preferences: ["sightseeing"]
        };
      }
      
      throw new Error('Failed to extract travel intent from message');
    }
  }

  async searchFlights(origin, destination, date) {
    try {
      // For now, return empty array until Amadeus is configured
      return [];
    } catch (error) {
      return [];
    }
  }

  async searchHotels(destination, checkIn, checkOut, budget) {
    try {
      // Booking.com API or Hotels.com API
      const response = await axios.get('https://booking-com.p.rapidapi.com/v1/hotels/search', {
        params: {
          dest_type: 'city',
          dest_id: await this.getCityId(destination),
          checkin_date: checkIn.toISOString().split('T')[0],
          checkout_date: checkOut.toISOString().split('T')[0],
          adults_number: 2,
          room_number: 1,
          order_by: 'price'
        },
        headers: {
          'X-RapidAPI-Key': process.env.BOOKING_API_KEY,
          'X-RapidAPI-Host': 'booking-com.p.rapidapi.com'
        }
      });

      return response.data.result.slice(0, 5).map(hotel => ({
        name: hotel.hotel_name,
        price: Math.round(hotel.min_total_price),
        rating: hotel.review_score / 2,
        amenities: hotel.hotel_facilities?.slice(0, 3),
        location: hotel.district,
        image: hotel.main_photo_url
      })).filter(hotel => hotel.name && hotel.price);
    } catch (error) {
      return [];
    }
  }

  async searchTrains(origin, destination, date) {
    return [];
  }

  async searchActivities(destination) {
    try {
      // First try to get location ID from our mapping
      let locationId = await this.getLocationId(destination);
      
      // If no location ID found, try to search for the location
      if (!locationId) {
        const searchResponse = await axios.get('https://travel-advisor.p.rapidapi.com/locations/search', {
          params: {
            query: destination,
            limit: 1,
            offset: 0,
            units: 'km',
            location_id: '1',
            currency: 'INR',
            sort: 'relevance',
            lang: 'en_US'
          },
          headers: {
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
          }
        });
        
        if (searchResponse.data?.data?.[0]?.result_object?.location_id) {
          locationId = searchResponse.data.data[0].result_object.location_id;
        } else {
          return [];
        }
      }
      
      const response = await axios.get('https://travel-advisor.p.rapidapi.com/attractions/list', {
        params: {
          location_id: locationId,
          currency: 'INR',
          lang: 'en_US',
          limit: 10
        },
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
        }
      });

      if (!response.data?.data) {
        return [];
      }

      return response.data.data.slice(0, 6).map(activity => ({
        name: activity.name,
        price: Math.floor(Math.random() * 1000) + 200,
        duration: "2-3 hours",
        rating: parseFloat(activity.rating) || 4.2,
        category: activity.subcategory?.[0]?.name || "Attraction",
        description: activity.description || `Popular attraction in ${destination}`,
        image: activity.photo?.images?.medium?.url || `https://images.unsplash.com/photo-1539650116574-75c0c6d73f6b?w=400&h=300&fit=crop&q=80`
      })).filter(activity => activity.name);
    } catch (error) {
      return [];
    }
  }

  async generateItinerary(userMessage) {
    try {
      // Step 1: Extract intent
      const intent = await this.extractIntent(userMessage);
      
      // Step 2: Research options
      const [flights, trains, hotels, activities] = await Promise.all([
        this.searchFlights(intent.from, intent.destination, new Date()),
        this.searchTrains(intent.from, intent.destination, new Date()),
        this.searchHotels(intent.destination, new Date(), new Date(), intent.budget),
        this.searchActivities(intent.destination)
      ]);
      
      // Step 3: Generate itinerary
      const itineraryPrompt = PromptTemplate.fromTemplate(`
        Create a detailed {duration}-day travel itinerary from {from} to {destination} in India within ₹{budget} budget.
        
        IMPORTANT: Stay within the ₹{budget} budget. Choose the most affordable options.
        
        Trip Details:
        - From: {from}
        - Destination: {destination}
        - Duration: {duration} days
        - Budget: ₹{budget} (STRICT LIMIT)
        - Trip Type: {tripType}
        - Travelers: {travelers}
        
        Available Options:
        Flights: {flights}
        Trains: {trains}
        Hotels: {hotels}
        Activities: {activities}
        
        Create a budget-friendly day-by-day itinerary with cost breakdown in INR (₹). Ensure total cost does not exceed ₹{budget}.
      `);
      
      const formattedPrompt = await itineraryPrompt.format({
        from: intent.from,
        destination: intent.destination,
        duration: intent.duration,
        budget: intent.budget,
        tripType: intent.tripType,
        travelers: intent.travelers,
        flights: JSON.stringify(flights),
        trains: JSON.stringify(trains),
        hotels: JSON.stringify(hotels),
        activities: JSON.stringify(activities)
      });
      
      const result = await this.llm.invoke(formattedPrompt);
      
      return {
        intent,
        options: { flights, trains, hotels, activities },
        itinerary: result.content,
        totalBudget: this.calculateBudget(flights, trains, hotels, activities, intent.duration)
      };
      
    } catch (error) {
      throw new Error(`Travel planning failed: ${error.message}`);
    }
  }

  // Helper methods for API integration
  async getAmadeusToken() {
    try {
      const response = await axios.post('https://test.api.amadeus.com/v1/security/oauth2/token', {
        grant_type: 'client_credentials',
        client_id: process.env.AMADEUS_API_KEY,
        client_secret: process.env.AMADEUS_API_SECRET
      });
      return response.data.access_token;
    } catch (error) {
      throw new Error('Failed to get Amadeus token');
    }
  }

  getAirportCode(city) {
    const airportCodes = {
      'Delhi': 'DEL',
      'Mumbai': 'BOM',
      'Bangalore': 'BLR',
      'Chennai': 'MAA',
      'Kolkata': 'CCU',
      'Lucknow': 'LKO',
      'Paris': 'CDG',
      'London': 'LHR',
      'New York': 'JFK'
    };
    return airportCodes[city] || 'DEL';
  }



  async getCityId(city) {
    const cityIds = {
      'Delhi': '-2092174',
      'Mumbai': '-2092042',
      'Lucknow': '-2106102',
      'Bhopal': '-2106103',
      'Bangalore': '-2090174',
      'Chennai': '-2092588'
    };
    return cityIds[city] || cityIds['Delhi'];
  }

  async getLocationId(city) {
    const normalizedCity = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
    const locationIds = {
      'Delhi': '304551',
      'Mumbai': '295424', 
      'Lucknow': '297684',
      'Bhopal': '297585',
      'Bangalore': '295423',
      'Chennai': '295424',
      'Kolkata': '304554',
      'Jaipur': '304555',
      'Goa': '304556'
    };
    return locationIds[normalizedCity];
  }



  calculateBudget(flights, trains, hotels, activities, duration) {
    const flightCost = flights[0]?.price || 0;
    const trainCost = trains[0]?.price?.ac3 || 0;
    const hotelCost = (hotels[0]?.price || 0) * duration;
    const activityCost = activities.reduce((sum, act) => sum + (act.price || 0), 0);
    
    return {
      flights: flightCost,
      trains: trainCost,
      accommodation: hotelCost,
      activities: activityCost,
      total: flightCost + trainCost + hotelCost + activityCost
    };
  }
}

module.exports = TravelPlannerAgent;