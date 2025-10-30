const prisma = require('../lib/prisma');

class MemoryAgent {
  constructor() {
    this.name = 'Memory Agent';
  }

  async getUserPreferences(userId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { trips: { take: 5, orderBy: { createdAt: 'desc' } } }
      });

      if (!user || !user.trips.length) {
        return this.getDefaultPreferences();
      }

      // Analyze past trips to extract preferences
      const preferences = this.analyzeUserHistory(user.trips);
      return preferences;
    } catch (error) {
      console.error('Memory retrieval error:', error);
      return this.getDefaultPreferences();
    }
  }

  async updateUserPreferences(userId, intent) {
    try {
      // Store trip preferences for future learning
      await prisma.userPreference.upsert({
        where: { userId },
        update: {
          preferredBudgetRange: this.categorizeBudget(intent.budget),
          preferredTripType: intent.tripType,
          preferredDuration: intent.duration,
          lastDestination: intent.destination,
          updatedAt: new Date()
        },
        create: {
          userId,
          preferredBudgetRange: this.categorizeBudget(intent.budget),
          preferredTripType: intent.tripType,
          preferredDuration: intent.duration,
          lastDestination: intent.destination
        }
      });
    } catch (error) {
      console.error('Memory update error:', error);
    }
  }

  analyzeUserHistory(trips) {
    const avgBudget = trips.reduce((sum, trip) => sum + trip.budget, 0) / trips.length;
    const commonDestinations = [...new Set(trips.map(trip => trip.destination))];
    
    return {
      preferredBudgetRange: this.categorizeBudget(avgBudget),
      travelStyle: avgBudget > 50000 ? 'luxury' : avgBudget > 25000 ? 'comfort' : 'budget',
      frequentDestinations: commonDestinations,
      avgTripDuration: Math.round(trips.reduce((sum, trip) => {
        const duration = Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24));
        return sum + duration;
      }, 0) / trips.length)
    };
  }

  categorizeBudget(budget) {
    if (budget < 15000) return 'budget';
    if (budget < 40000) return 'mid-range';
    return 'luxury';
  }

  getDefaultPreferences() {
    return {
      preferredBudgetRange: 'mid-range',
      travelStyle: 'comfort',
      frequentDestinations: [],
      avgTripDuration: 5
    };
  }
}

module.exports = MemoryAgent;