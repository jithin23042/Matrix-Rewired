/**
 * Coverage Calculator Service
 * Calculates insurance coverage amount based on premium and risk factors
 */

export const calculateCoverage = (premium, workerData, planType = 'normal') => {
  // Base coverage multiplier (varies by plan)
  const baseMultipliers = {
    normal: 8,    // 8x premium for basic coverage
    basic: 10,    // 10x premium for standard coverage
    premium: 12   // 12x premium for premium coverage
  };

  const baseMultiplier = baseMultipliers[planType] || 8;

  // Risk adjustment factors
  let riskMultiplier = 1.0;

  // Location-based risk adjustment
  const highRiskCities = ['Mumbai', 'Delhi', 'Kolkata', 'Chennai'];
  if (highRiskCities.includes(workerData?.city)) {
    riskMultiplier *= 1.2; // 20% higher risk in metro cities
  }

  // Platform-based risk adjustment
  const platformRiskFactors = {
    'Swiggy': 1.1,    // Food delivery - moderate risk
    'Zomato': 1.1,    // Food delivery - moderate risk
    'Uber': 1.3,      // Ride sharing - higher risk
    'Ola': 1.3,       // Ride sharing - higher risk
    'Rapido': 1.4,    // Bike taxi - highest risk
    'Dunzo': 1.2      // Quick commerce - higher risk
  };

  if (workerData?.platform && platformRiskFactors[workerData.platform]) {
    riskMultiplier *= platformRiskFactors[workerData.platform];
  }

  // Working hours adjustment (more hours = higher risk)
  if (workerData?.workingHours) {
    const hoursMatch = workerData.workingHours.match(/(\d+)-(\d+)/);
    if (hoursMatch) {
      const startHour = parseInt(hoursMatch[1]);
      const endHour = parseInt(hoursMatch[2]);
      const workingHours = endHour > startHour ? endHour - startHour : (24 - startHour) + endHour;

      if (workingHours > 12) {
        riskMultiplier *= 1.15; // 15% higher risk for long working hours
      } else if (workingHours > 8) {
        riskMultiplier *= 1.05; // 5% higher risk for extended hours
      }
    }
  }

  // Income-based adjustment (higher income = higher coverage potential)
  if (workerData?.avgHourlyIncome) {
    if (workerData.avgHourlyIncome > 200) {
      riskMultiplier *= 1.1; // Higher coverage for higher earners
    } else if (workerData.avgHourlyIncome < 100) {
      riskMultiplier *= 0.9; // Lower coverage for lower earners
    }
  }

  // Calculate final coverage
  const coverageAmount = Math.round(premium * baseMultiplier * riskMultiplier);

  // Ensure minimum and maximum coverage limits
  const minCoverage = premium * 5;  // Minimum 5x premium
  const maxCoverage = premium * 20; // Maximum 20x premium

  return Math.max(minCoverage, Math.min(maxCoverage, coverageAmount));
};

export const getCoverageEstimate = (premium, workerData, planType = 'normal') => {
  const coverage = calculateCoverage(premium, workerData, planType);

  return {
    premium: premium,
    coverageAmount: coverage,
    coverageRatio: (coverage / premium).toFixed(1),
    estimatedMonthlyCoverage: coverage * 4, // Approximate monthly coverage
    planType: planType
  };
};
