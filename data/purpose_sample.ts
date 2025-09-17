<<<<<<< HEAD
import { PurposeButton } from '@/components/PurposeMap';

export const purposeButtons: PurposeButton[] = [
  {
    id: 'purpose-home',
    purpose: 'HOME',
    label: 'Home',
    iconPath: require('../assets/icons/home.png'),
    color: '#4CAF50', // Green
  },
  {
    id: 'purpose-work',
    purpose: 'WORK',
    label: 'Work',
    iconPath: require('../assets/icons/work.png'),
    color: '#2196F3', // Blue
  },
  {
    id: 'purpose-leisure',
    purpose: 'LEISURE',
    label: 'Leisure',
    iconPath: require('../assets/icons/leisure.png'),
    color: '#FF9800', // Orange
  },
  {
    id: 'purpose-purchase',
    purpose: 'PURCHASE',
    label: 'Shopping',
    iconPath: require('../assets/icons/shopping.png'),
    color: '#9C27B0', // Purple
  },
  {
    id: 'purpose-other',
    purpose: 'OTHER',
    label: 'Other',
    iconPath: require('../assets/icons/other.png'),
    color: '#607D8B', // Blue Grey
  },
];

export { purposeButtons as purposeModes };
=======
import { ModeButton, Trajectory } from "@/components/BaseMap";

  const purposeModes: ModeButton[] = [
    {
      id: "mode-work",
      mode: "work",
      iconPath: require('../assets/icons/work.png'),
      color: "#E74C3C", // Red
    },
    {
      id: "mode-shopping",
      mode: "shopping",
      iconPath: require('../assets/icons/shopping.png'),
      color: "#F39C12", // Yellow
    },
    {
      id: "mode-leisure",
      mode: "leisure",
      iconPath: require('../assets/icons/leisure.png'),
      color: "#16A085", // Turquoise
    },
    {
      id: "mode-education",
      mode: "education",
      iconPath: require('../assets/icons/education.png'),
      color: "#8E44AD", // Dark Purple
    },
  ];

const purposeSample: Trajectory[] = [
    {
      id: "1",
      mode: "work",
      color: "#E74C3C", // Red
      date: "Monday, Sept 10, 2025",
      time: "8:30 AM - 5:00 PM",
      coordinates: [
        { latitude: -25.4390, longitude: -49.2420 } // Work location
      ]
    },
    {
      id: "2",
      mode: "shopping",
      color: "#F39C12", // Yellow
      date: "Tuesday, Sept 11, 2025",
      time: "6:30 PM - 8:00 PM",
      coordinates: [
        { latitude: -25.4220, longitude: -49.2650 } // Shopping location
      ]
    },
    {
      id: "3",
      mode: "leisure",
      color: "#16A085", // Turquoise
      date: "Wednesday, Sept 12, 2025",
      time: "7:00 PM - 10:00 PM",
      coordinates: [
        { latitude: -25.4530, longitude: -49.2590 } // Park location
      ]
    },
    {
      id: "4",
      mode: "education",
      color: "#8E44AD", // Dark Purple
      date: "Thursday, Sept 13, 2025",
      time: "2:00 PM - 4:30 PM",
      coordinates: [
        { latitude: -25.4300, longitude: -49.2500 } // School/University location
      ]
    },
  ]

export { purposeModes, purposeSample };
>>>>>>> master
