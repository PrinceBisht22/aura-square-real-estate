import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ICONS } from './icons.jsx';

const megaMenuData = {
  buy: {
    categories: [
      { name: 'Apartments', to: '/buy?type=apartment', count: '2,450' },
      { name: 'Villas', to: '/buy?type=villa', count: '890' },
      { name: 'Studio', to: '/buy?type=studio', count: '320' },
      { name: 'Penthouse', to: '/buy?type=penthouse', count: '145' },
    ],
    popular: [
      { name: 'Properties in Delhi', to: '/buy?city=delhi' },
      { name: 'Properties in Mumbai', to: '/buy?city=mumbai' },
      { name: 'Properties in Bangalore', to: '/buy?city=bangalore' },
      { name: 'Properties in Gurgaon', to: '/buy?city=gurgaon' },
    ],
    regions: [
      { name: 'South Delhi', to: '/buy?area=south-delhi' },
      { name: 'Dwarka', to: '/buy?area=dwarka' },
      { name: 'Rohini', to: '/buy?area=rohini' },
      { name: 'Laxmi Nagar', to: '/buy?area=laxmi-nagar' },
    ],
    promo: {
      title: 'New Launch',
      description: 'Exclusive pre-launch offers',
      to: '/new-launch',
      image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=200',
    },
  },
  rent: {
    categories: [
      { name: 'Furnished', to: '/rent?furnished=true', count: '1,200' },
      { name: 'Semi-Furnished', to: '/rent?furnished=semi', count: '890' },
      { name: 'Unfurnished', to: '/rent?furnished=false', count: '450' },
      { name: 'PG/Hostel', to: '/rent?type=pg', count: '230' },
    ],
    popular: [
      { name: 'Rent in Delhi', to: '/rent?city=delhi' },
      { name: 'Rent in Mumbai', to: '/rent?city=mumbai' },
      { name: 'Rent in Bangalore', to: '/rent?city=bangalore' },
      { name: 'Rent in Pune', to: '/rent?city=pune' },
    ],
    regions: [
      { name: 'Golf Course Road', to: '/rent?area=golf-course' },
      { name: 'DLF Phase 1-5', to: '/rent?area=dlf' },
      { name: 'MG Road', to: '/rent?area=mg-road' },
      { name: 'Sohna Road', to: '/rent?area=sohna-road' },
    ],
    promo: {
      title: 'Verified Owners',
      description: 'Direct owner listings',
      to: '/rent?verified=true',
      image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=200',
    },
  },
  'new-launch': {
    categories: [
      { name: 'Pre-Launch', to: '/new-launch?status=pre', count: '45' },
      { name: 'Under Construction', to: '/new-launch?status=construction', count: '120' },
      { name: 'Ready to Move', to: '/new-launch?status=ready', count: '89' },
      { name: 'RERA Approved', to: '/new-launch?rera=true', count: '234' },
    ],
    popular: [
      { name: 'Luxury Projects', to: '/new-launch?category=luxury' },
      { name: 'Affordable Housing', to: '/new-launch?category=affordable' },
      { name: 'Green Buildings', to: '/new-launch?green=true' },
      { name: 'Smart Homes', to: '/new-launch?smart=true' },
    ],
    regions: [
      { name: 'Noida Expressway', to: '/new-launch?area=noida-expressway' },
      { name: 'Yamuna Expressway', to: '/new-launch?area=yamuna' },
      { name: 'Dwarka Expressway', to: '/new-launch?area=dwarka-expressway' },
      { name: 'Gurgaon Sectors', to: '/new-launch?area=gurgaon' },
    ],
    promo: {
      title: 'Early Bird Offers',
      description: 'Up to 15% discount',
      to: '/new-launch?offer=true',
      image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=200',
    },
  },
  commercial: {
    categories: [
      { name: 'Office Space', to: '/commercial?type=office', count: '450' },
      { name: 'Retail Shops', to: '/commercial?type=retail', count: '320' },
      { name: 'Warehouse', to: '/commercial?type=warehouse', count: '180' },
      { name: 'Co-working', to: '/commercial?type=coworking', count: '95' },
    ],
    popular: [
      { name: 'Commercial in Delhi', to: '/commercial?city=delhi' },
      { name: 'Commercial in Mumbai', to: '/commercial?city=mumbai' },
      { name: 'Commercial in Bangalore', to: '/commercial?city=bangalore' },
      { name: 'Commercial in Gurgaon', to: '/commercial?city=gurgaon' },
    ],
    regions: [
      { name: 'Connaught Place', to: '/commercial?area=cp' },
      { name: 'Cyber City', to: '/commercial?area=cyber-city' },
      { name: 'BKC Mumbai', to: '/commercial?area=bkc' },
      { name: 'Whitefield Bangalore', to: '/commercial?area=whitefield' },
    ],
    promo: {
      title: 'Investment Ready',
      description: 'High yield properties',
      to: '/commercial?investment=true',
      image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=200',
    },
  },
  plots: {
    categories: [
      { name: 'Residential Plots', to: '/plots?type=residential', count: '890' },
      { name: 'Commercial Plots', to: '/plots?type=commercial', count: '340' },
      { name: 'Agricultural Land', to: '/plots?type=agricultural', count: '120' },
      { name: 'Industrial Plots', to: '/plots?type=industrial', count: '78' },
    ],
    popular: [
      { name: 'Plots in Noida', to: '/plots?city=noida' },
      { name: 'Plots in Greater Noida', to: '/plots?city=greater-noida' },
      { name: 'Plots in Yamuna Expressway', to: '/plots?area=yamuna' },
      { name: 'Plots in Dwarka Expressway', to: '/plots?area=dwarka' },
    ],
    regions: [
      { name: 'Sector 150 Noida', to: '/plots?area=sector-150' },
      { name: 'Sector 143 Noida', to: '/plots?area=sector-143' },
      { name: 'Knowledge Park', to: '/plots?area=knowledge-park' },
      { name: 'Sohna Road', to: '/plots?area=sohna' },
    ],
    promo: {
      title: 'Plot Investment',
      description: 'Best ROI locations',
      to: '/plots?investment=true',
      image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=200',
    },
  },
  projects: {
    categories: [
      { name: 'Top Developers', to: '/projects?filter=developers', count: '45' },
      { name: 'Luxury Projects', to: '/projects?filter=luxury', count: '120' },
      { name: 'Affordable Projects', to: '/projects?filter=affordable', count: '234' },
      { name: 'RERA Projects', to: '/projects?filter=rera', count: '567' },
    ],
    popular: [
      { name: 'DLF Projects', to: '/projects?developer=dlf' },
      { name: 'Godrej Properties', to: '/projects?developer=godrej' },
      { name: 'Sobha Developers', to: '/projects?developer=sobha' },
      { name: 'Prestige Group', to: '/projects?developer=prestige' },
    ],
    regions: [
      { name: 'Gurgaon Projects', to: '/projects?city=gurgaon' },
      { name: 'Noida Projects', to: '/projects?city=noida' },
      { name: 'Delhi Projects', to: '/projects?city=delhi' },
      { name: 'Mumbai Projects', to: '/projects?city=mumbai' },
    ],
    promo: {
      title: 'Virtual Tours',
      description: '3D walkthroughs available',
      to: '/projects?tours=true',
      image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=200',
    },
  },
  insights: {
    categories: [
      { name: 'Market Trends', to: '/insights?category=trends', count: '45' },
      { name: 'Investment Guides', to: '/insights?category=investment', count: '32' },
      { name: 'Home Buying Tips', to: '/insights?category=buying', count: '28' },
      { name: 'Legal Guides', to: '/insights?category=legal', count: '19' },
    ],
    popular: [
      { name: 'Latest Articles', to: '/insights?sort=latest' },
      { name: 'Popular Reads', to: '/insights?sort=popular' },
      { name: 'Video Guides', to: '/insights?type=video' },
      { name: 'Expert Interviews', to: '/insights?type=interview' },
    ],
    regions: [
      { name: 'Delhi Market', to: '/insights?region=delhi' },
      { name: 'Mumbai Market', to: '/insights?region=mumbai' },
      { name: 'Bangalore Market', to: '/insights?region=bangalore' },
      { name: 'Gurgaon Market', to: '/insights?region=gurgaon' },
    ],
    promo: {
      title: 'Weekly Newsletter',
      description: 'Get market insights',
      to: '/insights?newsletter=true',
      image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=200',
    },
  },
};

const MegaMenu = ({ activeMenu, onClose }) => {
  const menu = megaMenuData[activeMenu];
  if (!menu) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="w-full bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden"
    >
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Categories Column */}
          <div className="min-w-0">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate mb-5">
              Categories
            </h3>
            <ul className="space-y-2.5">
              {menu.categories.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={onClose}
                    className="flex items-center justify-between group py-2 text-sm text-navy hover:text-teal transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal/20 focus:ring-offset-2 rounded-lg px-2 -mx-2"
                  >
                    <span className="font-medium truncate">{item.name}</span>
                    <span className="text-xs text-slate group-hover:text-teal transition-colors ml-2 flex-shrink-0">
                      {item.count}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Searches Column */}
          <div className="min-w-0">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate mb-5">
              Popular Searches
            </h3>
            <ul className="space-y-2.5">
              {menu.popular.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={onClose}
                    className="flex items-center gap-2 py-2 text-sm text-navy hover:text-teal transition-colors duration-200 group focus:outline-none focus:ring-2 focus:ring-teal/20 focus:ring-offset-2 rounded-lg px-2 -mx-2"
                  >
                    <ICONS.ChevronRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    <span className="font-medium truncate">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Regions Column */}
          <div className="min-w-0">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate mb-5">
              Popular Regions
            </h3>
            <ul className="space-y-2.5">
              {menu.regions.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={onClose}
                    className="flex items-center gap-2 py-2 text-sm text-navy hover:text-teal transition-colors duration-200 group focus:outline-none focus:ring-2 focus:ring-teal/20 focus:ring-offset-2 rounded-lg px-2 -mx-2"
                  >
                    <ICONS.MapPin className="h-3.5 w-3.5 text-slate/60 group-hover:text-teal transition-colors flex-shrink-0" />
                    <span className="font-medium truncate">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Promo Card Column */}
          <div className="min-w-0">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate mb-5">
              Featured
            </h3>
            <Link
              to={menu.promo.to}
              onClick={onClose}
              className="block group rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal/20 focus:ring-offset-2"
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={menu.promo.image}
                  alt={menu.promo.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h4 className="font-semibold text-base mb-1">{menu.promo.title}</h4>
                  <p className="text-xs opacity-90">{menu.promo.description}</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MegaMenu;
