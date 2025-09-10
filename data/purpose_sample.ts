import { ModeButton } from "@/components/BaseMap";
import { PurposePoint } from "@/components/PurposePointMap";

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



const purposePoints: PurposePoint[] = [
    {
        id: "1",
        purpose: "work",
        color: "#E74C3C", // Red
        coordinate: { latitude: -25.4220, longitude: -49.2650 },
        time: "08:00",
        date: "2023-09-10"
    },
    {
        id: "2",
        purpose: "shopping",
        color: "#F39C12", // Yellow
        coordinate: { latitude: -25.4375, longitude: -49.2810 },
        time: "12:30",
        date: "2023-09-10"
    },
    {
        id: "3",
        purpose: "leisure",
        color: "#16A085", // Turquoise
        coordinate: { latitude: -25.4530, longitude: -49.2590 },
        time: "16:45",
        date: "2023-09-10"
    },
    {
        id: "4",
        purpose: "education",
        color: "#8E44AD", // Dark Purple
        coordinate: { latitude: -25.4390, longitude: -49.2420 },
        time: "19:30",
        date: "2023-09-10"
    },
];


export { purposeModes, purposePoints };
