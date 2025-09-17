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