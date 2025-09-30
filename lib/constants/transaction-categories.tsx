import { BiHouseHeart, ClarityAirplaneLine, FluentMdl2Education, FluentMegaphoneLoud28Regular, FluentWrenchSettings24Regular, HealthiconsDesktopAppOutline, HugeiconsBriefcase02, HugeiconsChartUp, HugeiconsHoldPhone, HugeiconsHome07, HugeiconsTruckDelivery, IconParkOutlineSport, IcTwotoneRamenDining, IonBeerOutline, LoanIcon, MdiAirportTaxi, MdiHomeElectricityOutline, SolarCartLargeBroken, SolarHeadphonesRoundSoundBroken, SolarHealthBroken, StreamlineCyberDeliveryPackageOpen, StreamlineFlexGasStationFuelPetroleumRemix, StreamlineFreehandDonationCharityDonateBag2, StreamlineFreehandShoppingBagSide, StreamlinePixelComputersDevicesElectronicsLaptop, StreamlinePlumpInsuranceHand, StreamlinePlumpPaymentRecieve7Remix, TablerShirtSport, UilFileContractDollar } from "@/components/icons/icons";

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
    icon: HugeiconsHome07,
    gradient: "from-pink-600/90 to-rose-500/90",
  },
  advertising: {
    icon: FluentMegaphoneLoud28Regular,
    gradient: "from-indigo-600/90 to-blue-500/90",
  },
  bar: {
    icon: IonBeerOutline,
    gradient: "from-amber-600/90 to-orange-500/90",
  },
  charity: {
    icon: StreamlineFreehandDonationCharityDonateBag2,
    gradient: "from-emerald-600/90 to-lime-500/90",
  },
  clothing: {
    icon: TablerShirtSport,
    gradient: "from-fuchsia-600/90 to-purple-500/90",
  },
  dining: {
    icon: IcTwotoneRamenDining,
    gradient: "from-red-600/90 to-rose-500/90",
  },
  education: {
    icon: FluentMdl2Education,
    gradient: "from-sky-600/90 to-blue-500/90",
  },
  electronics: {
    icon: StreamlinePixelComputersDevicesElectronicsLaptop,
    gradient: "from-cyan-600/90 to-teal-500/90",
  },
  entertainment: {
    icon: SolarHeadphonesRoundSoundBroken,
    gradient: "from-violet-600/90 to-purple-500/90",
  },
  fuel: {
    icon: StreamlineFlexGasStationFuelPetroleumRemix,
    gradient: "from-yellow-600/90 to-amber-500/90",
  },
  general: {
    icon: StreamlineCyberDeliveryPackageOpen,
    gradient: "from-gray-600/90 to-slate-500/90",
  },
  groceries: {
    icon: SolarCartLargeBroken,
    gradient: "from-lime-600/90 to-lime-500/90",
  },
  health: {
    icon: SolarHealthBroken,
    gradient: "from-pink-600/90 to-red-500/90",
  },
  home: {
    icon: BiHouseHeart,
    gradient: "from-rose-600/90 to-pink-500/90",
  },
  income: {
    icon: StreamlinePlumpPaymentRecieve7Remix,
    gradient: "from-green-600/90 to-emerald-500/90",
  },
  insurance: {
    icon: StreamlinePlumpInsuranceHand,
    gradient: "from-teal-600/90 to-cyan-500/90",
  },
  investment: {
    icon: HugeiconsChartUp,
    gradient: "from-blue-600/90 to-indigo-500/90",
  },
  loan: {
    icon: LoanIcon,
    gradient: "from-orange-600/90 to-amber-500/90",
  },
  office: {
    icon: HugeiconsBriefcase02,
    gradient: "from-slate-600/90 to-gray-500/90",
  },
  phone: {
    icon: HugeiconsHoldPhone,
    gradient: "from-purple-600/90 to-violet-500/90",
  },
  service: {
    icon: FluentWrenchSettings24Regular,
    gradient: "from-cyan-600/90 to-sky-500/90",
  },
  shopping: {
    icon: StreamlineFreehandShoppingBagSide,
    gradient: "from-fuchsia-600/90 to-pink-500/90",
  },
  software: {
    icon: HealthiconsDesktopAppOutline,
    gradient: "from-indigo-600/90 to-sky-500/90",
  },
  sport: {
    icon: IconParkOutlineSport,
    gradient: "from-green-600/90 to-lime-500/90",
  },
  tax: {
    icon: UilFileContractDollar,
    gradient: "from-amber-600/90 to-orange-500/90",
  },
  transport: {
    icon: HugeiconsTruckDelivery,
    gradient: "from-blue-600/90 to-sky-500/90",
  },
  transportation: {
    icon: MdiAirportTaxi,
    gradient: "from-yellow-600/90 to-orange-500/90",
  },
  utilities: {
    icon: MdiHomeElectricityOutline,
    gradient: "from-rose-600/90 to-red-500/90",
  },
};