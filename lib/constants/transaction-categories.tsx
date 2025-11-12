import { AddFileIcon, BankBuildingIcon, BarChartIcon, BiHouseHeart, BookIcon, CameraIcon, ClarityAirplaneLine, FluentMdl2Education, FluentMegaphoneLoud28Regular, FluentWrenchSettings24Regular, General, GroceriesIcon, HealthiconsDesktopAppOutline, HomeCategory, HugeiconsBriefcase02, HugeiconsChartUp, HugeiconsHoldPhone, HugeiconsHome07, HugeiconsTruckDelivery, IconParkOutlineSport, IcTwotoneRamenDining, IonBeerOutline, LoanIcon, MdiAirportTaxi, MdiHomeElectricityOutline, MonitorFlatIcon, ShoppingIcon, SmartPhoneIcon, SolarBar, SolarCartLargeBroken, SolarDrinkGlassBoldDuotone, SolarGiftBoxBoldDuotone, SolarHeadphonesRoundSoundBroken, SolarHealthBroken, SolarHeartBoldDuotone, SolarMegaphoneDuotone, SolarPencil, StreamlineCyberDeliveryPackageOpen, StreamlineFlexGasStationFuelPetroleumRemix, StreamlineFreehandDonationCharityDonateBag2, StreamlineFreehandShoppingBagSide, StreamlinePixelComputersDevicesElectronicsLaptop, StreamlinePlumpInsuranceHand, StreamlinePlumpPaymentRecieve7Remix, TablerShirtSport, UilFileContractDollar } from "@/components/icons/icons";

export type Category =
  | "accommodation"
  | "advertising"
  | "bar"
  | "charity"
  | "clothing"
  | "dining"
  | "education"
  | "electronics"
  | "entertainment"
  | "fuel"
  | "general"
  | "groceries"
  | "health"
  | "home"
  | "income"
  | "insurance"
  | "investment"
  | "loan"
  | "office"
  | "phone"
  | "service"
  | "shopping"
  | "software"
  | "sport"
  | "tax"
  | "transport"
  | "transportation"
  | "utilities";

  export const categoryIcons : Record<
  Category,
  { icon: React.ElementType; gradient: string }
> = {

  accommodation: {
    icon: HomeCategory,
    gradient: "from-pink-600/40 to-rose-500/40",
  },
  advertising: {
    icon: SolarMegaphoneDuotone,
    gradient: "from-indigo-600/40 to-blue-500/40",
  },
  bar: {
    icon: SolarBar,
    gradient: "from-amber-600/40 to-orange-500/40",
  },
  charity: {
    icon: SolarHeartBoldDuotone,
    gradient: "from-emerald-600/40 to-lime-500/40",
  },
  clothing: {
    icon: SolarGiftBoxBoldDuotone,
    gradient: "from-fuchsia-600/40 to-purple-500/40",
  },
  dining: {
    icon: SolarDrinkGlassBoldDuotone,
    gradient: "from-red-600/40 to-rose-500/40",
  },
  education: {
    icon: BookIcon,
    gradient: "from-sky-600/40 to-blue-500/40",
  },
  electronics: {
    icon: MonitorFlatIcon,
    gradient: "from-cyan-600/40 to-teal-500/40",
  },
  entertainment: {
    icon: CameraIcon,
    gradient: "from-violet-600/40 to-purple-500/40",
  },
  fuel: {
    icon: StreamlineFlexGasStationFuelPetroleumRemix,
    gradient: "from-yellow-600/40 to-amber-500/40",
  },
  general: {
    icon: General,
    gradient: "from-gray-600/40 to-slate-500/40",
  },
  groceries: {
    icon: GroceriesIcon,
    gradient: "from-lime-600/40 to-lime-500/40",
  },
  health: {
    icon: AddFileIcon,
    gradient: "from-pink-600/40 to-red-500/40",
  },
  home: {
    icon: HomeCategory,
    gradient: "from-rose-600/40 to-pink-500/40",
  },
  income: {
    icon: StreamlinePlumpPaymentRecieve7Remix,
    gradient: "from-green-600/40 to-emerald-500/40",
  },
  insurance: {
    icon: StreamlinePlumpInsuranceHand,
    gradient: "from-teal-600/40 to-cyan-500/40",
  },
  investment: {
    icon: BarChartIcon,
    gradient: "from-blue-600/40 to-indigo-500/40",
  },
  loan: {
    icon: BankBuildingIcon,
    gradient: "from-orange-600/40 to-amber-500/40",
  },
  office: {
    icon: HugeiconsBriefcase02,
    gradient: "from-slate-600/40 to-gray-500/40",
  },
  phone: {
    icon: SmartPhoneIcon,
    gradient: "from-purple-600/40 to-violet-500/40",
  },
  service: {
    icon: FluentWrenchSettings24Regular,
    gradient: "from-cyan-600/40 to-sky-500/40",
  },
  shopping: {
    icon: ShoppingIcon,
    gradient: "from-fuchsia-600/40 to-pink-500/40",
  },
  software: {
    icon: HealthiconsDesktopAppOutline,
    gradient: "from-indigo-600/40 to-sky-500/40",
  },
  sport: {
    icon: IconParkOutlineSport,
    gradient: "from-green-600/40 to-lime-500/40",
  },
  tax: {
    icon: UilFileContractDollar,
    gradient: "from-amber-600/40 to-orange-500/40",
  },
  transport: {
    icon: HugeiconsTruckDelivery,
    gradient: "from-blue-600/40 to-sky-500/40",
  },
  transportation: {
    icon: MdiAirportTaxi,
    gradient: "from-yellow-600/40 to-orange-500/40",
  },
  utilities: {
    icon: MdiHomeElectricityOutline,
    gradient: "from-rose-600/40 to-red-500/40",
  },
};