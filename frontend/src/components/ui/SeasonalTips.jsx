import React, { useState } from 'react';
import { Calendar, Sun, Cloud, Umbrella, Leaf, ChevronRight, ChevronDown } from 'lucide-react';

const seasonalTips = {
  january: {
    name: 'January',
    season: 'Dry Season (Harmattan)',
    icon: Sun,
    weather: 'Dry and dusty, cool mornings',
    tips: [
      { sector: 'retail', tip: 'Stock up on cold drinks and fan sales - very hot afternoons' },
      { sector: 'farming', tip: 'Prepare land for early planting, bush clearing time' },
      { sector: 'food', tip: 'Focus on hot soups and stews - people want warm food' },
      { sector: 'general', tip: 'New Year resolutions - promote fresh starts, new products' }
    ]
  },
  february: {
    name: 'February',
    season: 'Late Dry Season',
    icon: Sun,
    weather: 'Hot and dry, fire risk high',
    tips: [
      { sector: 'retail', tip: 'Valentine\'s Day - stock flowers, chocolates, gifts' },
      { sector: 'farming', tip: 'Start early maize planting in forest areas' },
      { sector: 'food', tip: 'Ice cream and cold drinks season peak' },
      { sector: 'general', tip: 'Independence Day preparations start - patriotic items' }
    ]
  },
  march: {
    name: 'March',
    season: 'Transition to Rainy',
    icon: Cloud,
    weather: 'First rains begin, humid',
    tips: [
      { sector: 'retail', tip: 'Independence Day (March 6) - national colors sell well' },
      { sector: 'farming', tip: 'Major planting season begins - fertilizer and seeds needed' },
      { sector: 'food', tip: 'New crop vegetables coming - fresh produce prices drop' },
      { sector: 'general', tip: 'Rain gear and umbrellas start selling again' }
    ]
  },
  april: {
    name: 'April',
    season: 'Major Rainy Season',
    icon: Umbrella,
    weather: 'Heavy rains, flooding risk',
    tips: [
      { sector: 'retail', tip: 'Easter season - stock religious items and gift baskets' },
      { sector: 'farming', tip: 'Peak planting for rice and vegetables' },
      { sector: 'food', tip: 'Fresh fruits and vegetables abundant - prices lower' },
      { sector: 'general', tip: 'Mosquito nets and repellents high demand' }
    ]
  },
  may: {
    name: 'May',
    season: 'Peak Rainy Season',
    icon: Umbrella,
    weather: 'Continuous rain, very humid',
    tips: [
      { sector: 'retail', tip: 'Mother\'s Day - gift items and special treats' },
      { sector: 'farming', tip: 'Weeding critical period - herbicides in demand' },
      { sector: 'food', tip: 'Tomatoes and peppers cheap - good for bulk buying' },
      { sector: 'general', tip: 'School exams - stationery and books sales increase' }
    ]
  },
  june: {
    name: 'June',
    season: 'Minor Dry Spell',
    icon: Cloud,
    weather: 'Brief dry period in south',
    tips: [
      { sector: 'retail', tip: 'Father\'s Day - men\'s products and gifts' },
      { sector: 'farming', tip: 'First harvest of maize begins - prices drop' },
      { sector: 'food', tip: 'New maize season - roasted corn sells well' },
      { sector: 'general', tip: 'Mid-year stock clearance sales opportunity' }
    ]
  },
  july: {
    name: 'July',
    season: 'Minor Rainy Season',
    icon: Umbrella,
    weather: 'Light rains resume',
    tips: [
      { sector: 'retail', tip: 'Eid celebrations - stock special items for Muslims' },
      { sector: 'farming', tip: 'Second planting season for coastal areas' },
      { sector: 'food', tip: 'Mango season peak - use in juices and products' },
      { sector: 'general', tip: 'School holidays start - children\'s items and activities' }
    ]
  },
  august: {
    name: 'August',
    season: 'Minor Rainy Season',
    icon: Cloud,
    weather: 'Cool and cloudy',
    tips: [
      { sector: 'retail', tip: 'Founder\'s Day preparations - patriotic items' },
      { sector: 'farming', tip: 'Vegetables planting for September harvest' },
      { sector: 'food', tip: 'Groundnut harvest begins - fresh groundnuts' },
      { sector: 'general', tip: 'Back to school shopping peaks - uniforms, books' }
    ]
  },
  september: {
    name: 'September',
    season: 'Late Minor Rainy',
    icon: Cloud,
    weather: 'Rains ending, warmer',
    tips: [
      { sector: 'retail', tip: 'Back to school final rush - last minute supplies' },
      { sector: 'farming', tip: 'Rice harvest in some areas begins' },
      { sector: 'food', tip: 'Fresh vegetables from second season coming' },
      { sector: 'general', tip: 'Oktoberfest events starting - beverages demand up' }
    ]
  },
  october: {
    name: 'October',
    season: 'Transition to Dry',
    icon: Leaf,
    weather: 'Becoming drier, warmer',
    tips: [
      { sector: 'retail', tip: 'Build up Christmas stock early - beat price increases' },
      { sector: 'farming', tip: 'Main harvest season - storage solutions needed' },
      { sector: 'food', tip: 'Yam festival (Homowo) - traditional foods popular' },
      { sector: 'general', tip: 'Wedding season starting - event services in demand' }
    ]
  },
  november: {
    name: 'November',
    season: 'Early Dry Season',
    icon: Sun,
    weather: 'Dry and hot',
    tips: [
      { sector: 'retail', tip: 'Black Friday sales - discounts attract crowds' },
      { sector: 'farming', tip: 'Post-harvest processing and storage critical' },
      { sector: 'food', tip: 'Fresh harvest abundance - best prices for bulk' },
      { sector: 'general', tip: 'Christmas shopping begins - decoration sales' }
    ]
  },
  december: {
    name: 'December',
    season: 'Harmattan Beginning',
    icon: Sun,
    weather: 'Dry, dusty, cool nights',
    tips: [
      { sector: 'retail', tip: 'Christmas and New Year peak - all gift items' },
      { sector: 'farming', tip: 'Land preparation for next year begins' },
      { sector: 'food', tip: 'Festive foods - chicken, rice prices increase' },
      { sector: 'general', tip: 'Travel season - transport services in high demand' }
    ]
  }
};

const SeasonalTips = ({ sector = 'general' }) => {
  const currentMonth = new Date().toLocaleString('default', { month: 'long' }).toLowerCase();
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [expanded, setExpanded] = useState(false);

  const monthData = seasonalTips[selectedMonth];
  const WeatherIcon = monthData?.icon || Sun;

  const filteredTips = monthData?.tips.filter(tip => 
    tip.sector === sector || tip.sector === 'general'
  ) || [];

  const months = Object.keys(seasonalTips);

  return (
    <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
          <Calendar className="w-5 h-5 text-green-400" />
        </div>
        <div>
          <h3 className="font-bold text-white">Seasonal Business Tips</h3>
          <p className="text-sm text-gray-400">Ghana weather and market guide</p>
        </div>
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {months.slice(0, 6).map(month => (
          <button
            key={month}
            onClick={() => setSelectedMonth(month)}
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition ${
              selectedMonth === month 
                ? 'bg-green-600 text-white' 
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            {seasonalTips[month].name.slice(0, 3)}
          </button>
        ))}
        <button
          onClick={() => setExpanded(!expanded)}
          className="px-3 py-1 bg-slate-700 text-gray-300 rounded-full text-sm hover:bg-slate-600 transition"
        >
          {expanded ? 'Less' : 'More'}
        </button>
      </div>

      {expanded && (
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {months.slice(6).map(month => (
            <button
              key={month}
              onClick={() => setSelectedMonth(month)}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition ${
                selectedMonth === month 
                  ? 'bg-green-600 text-white' 
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              {seasonalTips[month].name.slice(0, 3)}
            </button>
          ))}
        </div>
      )}

      {monthData && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-xl p-4 border border-green-500/30">
            <div className="flex items-center gap-3 mb-2">
              <WeatherIcon className="w-8 h-8 text-green-400" />
              <div>
                <h4 className="font-semibold text-white">{monthData.name} - {monthData.season}</h4>
                <p className="text-sm text-gray-400">{monthData.weather}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {filteredTips.map((tip, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg">
                <ChevronRight className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-gray-300 text-sm">{tip.tip}</p>
              </div>
            ))}
          </div>

          {currentMonth === selectedMonth && (
            <div className="bg-purple-900/20 rounded-xl p-4 border border-purple-500/30">
              <p className="text-purple-400 text-sm font-medium">
                💡 This is the current month - these tips apply to you now!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SeasonalTips;
