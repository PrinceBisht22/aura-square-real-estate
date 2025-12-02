export const cityMarketData = {
  Dehradun: [
    { id: 1, locality: 'Rajpur Road', rate: 8500, yield: '3.2%', growth: 18.5, trend: [6500, 6800, 7200, 7500, 7900, 8200, 8500] },
    { id: 2, locality: 'Sahastradhara', rate: 5200, yield: '2.8%', growth: 12.4, trend: [4200, 4400, 4600, 4800, 5000, 5100, 5200] },
    { id: 3, locality: 'Clement Town', rate: 4800, yield: '4.1%', growth: 9.2, trend: [4100, 4200, 4300, 4400, 4600, 4700, 4800] },
    { id: 4, locality: 'Vasant Vihar', rate: 6900, yield: '2.5%', growth: 15.1, trend: [5800, 6000, 6200, 6400, 6600, 6800, 6900] },
    { id: 5, locality: 'Prem Nagar', rate: 3800, yield: '5.0%', growth: 22.0, trend: [2800, 3000, 3200, 3400, 3600, 3700, 3800] },
  ],
  Delhi: [
    { id: 1, locality: 'Dwarka Mor', rate: 6500, yield: '3.5%', growth: 8.5, trend: [5800, 5900, 6000, 6100, 6300, 6400, 6500] },
    { id: 2, locality: 'Uttam Nagar', rate: 4200, yield: '4.0%', growth: 5.2, trend: [3900, 4000, 4050, 4100, 4150, 4180, 4200] },
    { id: 3, locality: 'Rohini Sec-24', rate: 11500, yield: '2.2%', growth: 14.5, trend: [9500, 9800, 10200, 10500, 10800, 11200, 11500] },
    { id: 4, locality: 'Vasant Kunj', rate: 18000, yield: '1.8%', growth: 6.0, trend: [16500, 16800, 17000, 17200, 17500, 17800, 18000] },
    { id: 5, locality: 'Saket', rate: 16500, yield: '2.9%', growth: 9.8, trend: [14000, 14500, 15000, 15500, 16000, 16200, 16500] },
  ],
  Chandigarh: [
    { id: 1, locality: 'Zirakpur', rate: 4500, yield: '3.8%', growth: 12.5, trend: [3800, 3900, 4100, 4200, 4300, 4400, 4500] },
    { id: 2, locality: 'Mohali Sec-82', rate: 6200, yield: '3.1%', growth: 10.0, trend: [5200, 5400, 5600, 5800, 6000, 6100, 6200] },
    { id: 3, locality: 'New Chandigarh', rate: 5800, yield: '2.5%', growth: 18.2, trend: [4500, 4800, 5000, 5200, 5500, 5600, 5800] },
    { id: 4, locality: 'Panchkula', rate: 7100, yield: '2.9%', growth: 7.5, trend: [6500, 6600, 6700, 6800, 6900, 7000, 7100] },
    { id: 5, locality: 'Kharar', rate: 3500, yield: '4.2%', growth: 11.0, trend: [3000, 3100, 3200, 3300, 3400, 3450, 3500] },
  ],
  Chennai: [
    { id: 1, locality: 'Potheri', rate: 3150, yield: '3.0%', growth: 75.0, trend: [1800, 2000, 2200, 2500, 2800, 3000, 3150] },
    { id: 2, locality: 'Ekkaduthangal', rate: 12700, yield: '2.0%', growth: 57.8, trend: [8000, 9000, 10000, 11000, 11500, 12000, 12700] },
    { id: 3, locality: 'Ramapuram', rate: 10300, yield: 'NA', growth: 47.1, trend: [7000, 7500, 8000, 8500, 9000, 9500, 10300] },
    { id: 4, locality: 'Velachery', rate: 9400, yield: '2.5%', growth: 15.0, trend: [8000, 8200, 8500, 8800, 9000, 9200, 9400] },
    { id: 5, locality: 'OMR', rate: 5500, yield: '4.0%', growth: 10.0, trend: [4800, 5000, 5100, 5200, 5300, 5400, 5500] },
  ]
};

// Data organized by City for Transactions
export const cityTransactionData = {
  Dehradun: [
    { id: 1, locality: 'Rajpur Road', count: 145, rate: 8500, txnRate: 8250 },
    { id: 2, locality: 'GMS Road', count: 112, rate: 5800, txnRate: 5600 },
    { id: 3, locality: 'Mussoorie Road', count: 89, rate: 12000, txnRate: 11500 },
  ],
  Delhi: [
    { id: 1, locality: 'Laxmi Nagar', count: 312, rate: 8000, txnRate: 7850 },
    { id: 2, locality: 'Janakpuri', count: 245, rate: 11000, txnRate: 10800 },
    { id: 3, locality: 'Vasant Vihar', count: 98, rate: 25000, txnRate: 24200 },
  ],
  Chandigarh: [
    { id: 1, locality: 'Aerocity', count: 180, rate: 6000, txnRate: 5950 },
    { id: 2, locality: 'Sector 20', count: 150, rate: 8500, txnRate: 8300 },
    { id: 3, locality: 'Dharkoli', count: 210, rate: 3800, txnRate: 3700 },
  ],
  Chennai: [
    { id: 1, locality: 'Zamin Pallavaram', count: 236, rate: 7200, txnRate: 6991 },
    { id: 2, locality: 'Tambaram', count: 225, rate: 4000, txnRate: 5140 },
    { id: 3, locality: 'Velachery', count: 221, rate: 9400, txnRate: 9908 },
  ],
};

export const popularCities = [
  { name: 'Delhi / NCR', count: '177,000+', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=400&q=80' },
  { name: 'Bangalore', count: '50,000+', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=400&q=80' },
  { name: 'Pune', count: '38,000+', image: 'https://images.unsplash.com/photo-1569615563422-c2f992383339?auto=format&fit=crop&w=400&q=80' },
  { name: 'Mumbai', count: '41,000+', image: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&w=400&q=80' },
  { name: 'Hyderabad', count: '28,000+', image: 'https://images.unsplash.com/photo-1605218427368-35b0f996d93e?auto=format&fit=crop&w=400&q=80' },
  { name: 'Chennai', count: '37,000+', image: 'https://images.unsplash.com/photo-1582510003544-524378052900?auto=format&fit=crop&w=400&q=80' },
];