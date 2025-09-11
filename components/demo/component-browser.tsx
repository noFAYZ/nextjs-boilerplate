"use client"

import * as React from "react"
import {
  ChevronRight,
  ChevronDown,
  Home,
  Wallet,
  Calendar as CalendarIcon,
  Upload,
  Monitor,
  Grid3x3,
  List,
  Eye,
  EyeOff,
  Calculator,
  Filter,
  BarChart3,
  Bell,
  Navigation,
  Layers,
  Palette,
  Code2,
  Component,
  Settings,
  X,
  Type,
  Square,
  Circle,
  Star,
  CheckSquare,
  ToggleLeft,
  Sliders,
  Image,
  Play,
  MessageSquare,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Loader,
  FileText,
  Menu,
  Zap,
  MousePointer,
  Minus,
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  SearchIcon,
  TableIcon,
  ArrowUpDown,
  PieChartIcon,
  UserIcon,
  FolderOpen,
  Plus,
  Clock,
  Mail,
  Shield,
  Globe,
  Heart,
  CoinsIcon,
  GalleryThumbnails,
  LucideGalleryThumbnails,
  ImageIcon,
  ImagesIcon,
  History,
  ListChecks,
  Coins,
  Images,
  ListCheck,
  VideoIcon,
  Bitcoin,
  Earth,
  AlertCircle,
  HardDrive,
  Database,
  Server,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { IconTabsList, IconTabsTrigger, StepIndicator, Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Calendar } from "@/components/ui/calendar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Toggle } from "@/components/ui/toggle"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Search } from "@/components/ui/search"
import { CommandPalette } from "@/components/ui/command-palette"
import { FileUpload } from "@/components/ui/file-upload"
import { LoadingButton } from "@/components/ui/loading-button"
import { ThemeSwitcher } from "@/components/ui/theme-switcher"
import { MetricCard } from "@/components/ui/metric-card"
import { StatsCard } from "@/components/ui/stats-card"
import { Chart } from "@/components/ui/chart"
import { AdvancedChart } from "@/components/ui/advanced-chart"
import { ComparisonTable } from "@/components/ui/comparison-table"
import { Testimonials } from "@/components/ui/testimonials"
import { DataTable } from "@/components/ui/data-table"
import { DataTableAdvanced } from "@/components/ui/data-table-advanced"

// Import component demonstrations
import { Dock, ExpandableDock, ExpandableItem, FloatingDock, MiniDock, useDock, useExpandableDock } from "@/components/ui/dock"
import { WalletHeader, CompactWalletHeader } from "@/components/ui/wallet-header"
import { DatePicker, DateRangePicker } from "@/components/ui/date-picker"
import { MultiSelect, useMultiSelect } from "@/components/ui/multi-select"
import { Combobox, useCombobox } from "@/components/ui/combobox"
import { NumberInput, useNumberInput } from "@/components/ui/number-input"
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter, useModal } from "@/components/ui/modal"
import { LoadingSpinner, LoadingOverlay, LoadingSkeleton } from "@/components/ui/loading-spinner"
import { PricingTable, PricingBillingToggle, usePricing } from "@/components/ui/pricing-table"
import { Pagination, PaginationInfo } from "@/components/ui/pagination"
import {
  WindowControls,
  MacOSWindow,
  FinderWindow,
} from "@/components/ui/macos-blocks"
import { HugeiconsHome04, LetsIconsAddRingDuotone, MageDashboard, SolarAddSquareBoldDuotone, StreamlineFlexHome2, StreamlineFlexWallet } from "../icons/icons"
import { IconParkOutlineSettingTwo, LetsIconsSettingLineDuotone } from "../icons"

// MoneyMappr-specific components
import { TransactionCard, TransactionList } from "@/components/crypto/transaction-card"
import { PortfolioSummary, CompactPortfolioSummary } from "@/components/crypto/portfolio-summary"
import { AssetPriceCard, AssetPriceRow } from "@/components/crypto/asset-price-card"

// Layout components
import { AppHeader } from "@/components/layout/app-header"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { DashboardLayout, PageContainer, PageHeader, PageSection } from "@/components/layout/dashboard-layout"
import { UserProfile } from "@/components/user/user-profile"

// Additional UI components that exist
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import AuthForm from "../auth/auth-form"
import router from "next/router"

interface ComponentItem {
  id: string
  name: string
  description: string
  category: string
  icon: React.ComponentType<{ className?: string }>
  component: React.ComponentType
  props?: Record<string, any>
  variants?: Array<{
    name: string
    component: React.ComponentType
    props?: Record<string, any>
  }>
}

interface CategoryItem {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  count: number
}

// Component definitions
const COMPONENT_CATEGORIES: CategoryItem[] = [
  { id: "basics", name: "Basic UI", icon: Square, count: 12 },
  { id: "forms", name: "Form Controls", icon: CheckSquare, count: 13 },
  { id: "overlays", name: "Overlays", icon: Layers, count: 9 },
  { id: "data", name: "Data Display", icon: TableIcon, count: 8 },
  { id: "navigation", name: "Navigation", icon: Navigation, count: 3 },
  { id: "feedback", name: "Feedback", icon: Bell, count: 6 },
  { id: "charts", name: "Charts & Metrics", icon: BarChart3, count: 4 },
  { id: "layout", name: "Layout & Structure", icon: Layers, count: 4 },
  { id: "macos", name: "macOS Style", icon: Monitor, count: 3 },
  { id: "crypto", name: "Crypto & Finance", icon: DollarSign, count: 4 },
  { id: "business", name: "Business & Commerce", icon: Zap, count: 2 },
  { id: "auth", name: "Authentication", icon: Shield, count: 1 },
  { id: "accounts", name: "Account Management", icon: Users, count: 1 },
]

// Demo Components

// Basic UI Components
const ButtonDemo = () => {
  return (
    <div className="space-y-6">
      {/* Primary Variants */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Variants</h4>
        <div className="flex flex-wrap gap-2">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
      </div>

      {/* Sizes */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Sizes</h4>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon"><Settings className="h-4 w-4" /></Button>
        </div>
      </div>

      {/* States */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">States</h4>
        <div className="flex flex-wrap gap-2">
          <Button disabled>Disabled</Button>
          <Button>
            <Loader className="mr-2 h-4 w-4 animate-spin" />
            Loading
          </Button>
        </div>
      </div>

      {/* With Icons */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">With Icons</h4>
        <div className="flex flex-wrap gap-2">
          <Button>
            <Mail className="mr-2 h-4 w-4" />
            Email
          </Button>
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button variant="secondary">
            Download
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* As Link */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">As Link</h4>
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <a href="#" onClick={(e) => e.preventDefault()}>
              Button as Link
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}

const InputDemo = () => {
  const [value, setValue] = React.useState("")
  
  return (
    <div className="space-y-6">
      {/* Basic Input Types */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Types</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="text">Text</Label>
            <Input 
              id="text"
              placeholder="Enter text..." 
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Enter email..." />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="Enter password..." />
          </div>
          <div>
            <Label htmlFor="number">Number</Label>
            <Input id="number" type="number" placeholder="Enter number..." />
          </div>
          <div>
            <Label htmlFor="search">Search</Label>
            <Input id="search" type="search" placeholder="Search..." />
          </div>
          <div>
            <Label htmlFor="url">URL</Label>
            <Input id="url" type="url" placeholder="https://example.com" />
          </div>
        </div>
      </div>

      {/* With Icons */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">With Icons</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Label htmlFor="search-icon">Search with Icon</Label>
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input id="search-icon" className="pl-9" placeholder="Search..." />
            </div>
          </div>
          <div className="relative">
            <Label htmlFor="email-icon">Email with Icon</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input id="email-icon" className="pl-9" type="email" placeholder="Email..." />
            </div>
          </div>
        </div>
      </div>

      {/* States */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">States</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="disabled">Disabled</Label>
            <Input id="disabled" placeholder="Disabled..." disabled />
          </div>
          <div>
            <Label htmlFor="readonly">Read Only</Label>
            <Input id="readonly" placeholder="Read only..." readOnly value="Read only value" />
          </div>
        </div>
      </div>

      {/* With Validation */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">With Validation</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="error">Error State</Label>
            <Input id="error" placeholder="Enter value..." className="border-destructive" />
            <p className="text-sm text-destructive mt-1">This field is required</p>
          </div>
          <div>
            <Label htmlFor="success">Success State</Label>
            <Input id="success" placeholder="Enter value..." className="border-green-500" />
            <p className="text-sm text-green-600 mt-1">Valid input</p>
          </div>
        </div>
      </div>
    </div>
  )
}

const BadgeDemo = () => {
  return (
    <div className="space-y-6">
      {/* Basic Variants */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Variants</h4>
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>
      </div>

      {/* With Icons */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">With Icons</h4>
        <div className="flex flex-wrap gap-2">
          <Badge className="gap-1">
            <Circle className="h-2 w-2 fill-current" />
            Online
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <Star className="h-3 w-3" />
            New
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Info className="h-3 w-3" />
            Beta
          </Badge>
          <Badge variant="destructive" className="gap-1">
            <AlertTriangle className="h-3 w-3" />
            Error
          </Badge>
        </div>
      </div>

      {/* Status Badges */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Status</h4>
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-green-500 hover:bg-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            Success
          </Badge>
          <Badge className="bg-yellow-500 hover:bg-yellow-600">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
          <Badge className="bg-blue-500 hover:bg-blue-600">
            <Info className="h-3 w-3 mr-1" />
            Info
          </Badge>
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        </div>
      </div>

      {/* Notification Badges */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Notifications</h4>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">3</Badge>
          <Badge className="bg-red-500 hover:bg-red-600 text-white rounded-full h-5 w-5 p-0 flex items-center justify-center text-xs">
            9
          </Badge>
          <Badge className="bg-orange-500 hover:bg-orange-600 text-white rounded-full h-6 w-6 p-0 flex items-center justify-center text-xs">
            99+
          </Badge>
        </div>
      </div>

      {/* Custom Colors */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Custom Colors</h4>
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-purple-500 hover:bg-purple-600">Purple</Badge>
          <Badge className="bg-pink-500 hover:bg-pink-600">Pink</Badge>
          <Badge className="bg-indigo-500 hover:bg-indigo-600">Indigo</Badge>
          <Badge className="bg-teal-500 hover:bg-teal-600">Teal</Badge>
        </div>
      </div>
    </div>
  )
}

const AvatarDemo = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
      
      <div className="flex items-center gap-4">
        <Avatar className="h-8 w-8">
          <AvatarFallback>SM</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>MD</AvatarFallback>
        </Avatar>
        <Avatar className="h-16 w-16">
          <AvatarFallback>LG</AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}

const ProgressDemo = () => {
  const [progress, setProgress] = React.useState(13)
  
  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500)
    return () => clearTimeout(timer)
  }, [])
  
  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} />
      </div>
      
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span>Storage</span>
          <span>85%</span>
        </div>
        <Progress value={85} className="h-2" />
      </div>
    </div>
  )
}

const SkeletonDemo = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
      
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[90%]" />
        <Skeleton className="h-4 w-[80%]" />
      </div>
    </div>
  )
}

const SeparatorDemo = () => {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium">Horizontal</h4>
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">Item 1</div>
          <Separator />
          <div className="text-sm text-muted-foreground">Item 2</div>
          <Separator />
          <div className="text-sm text-muted-foreground">Item 3</div>
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium mb-2">Vertical</h4>
        <div className="flex h-5 items-center space-x-4 text-sm">
          <div>Blog</div>
          <Separator orientation="vertical" />
          <div>Docs</div>
          <Separator orientation="vertical" />
          <div>Source</div>
        </div>
      </div>
    </div>
  )
}

const AlertDemo = () => {
  return (
    <div className="space-y-4">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          You can add components to your app using the cli.
        </AlertDescription>
      </Alert>
      
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Your session has expired. Please log in again.
        </AlertDescription>
      </Alert>
    </div>
  )
}

// Form Components
const CheckboxDemo = () => {
  const [checked, setChecked] = React.useState(false)
  
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="terms" 
          checked={checked}
          onCheckedChange={setChecked}
        />
        <Label htmlFor="terms">Accept terms and conditions</Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox id="disabled" disabled />
        <Label htmlFor="disabled">Disabled checkbox</Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox id="checked" defaultChecked />
        <Label htmlFor="checked">Default checked</Label>
      </div>
    </div>
  )
}

const SwitchDemo = () => {
  const [enabled, setEnabled] = React.useState(false)
  
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch 
          id="airplane-mode" 
          checked={enabled}
          onCheckedChange={setEnabled}
        />
        <Label htmlFor="airplane-mode">Airplane Mode</Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch id="disabled" disabled />
        <Label htmlFor="disabled">Disabled switch</Label>
      </div>
    </div>
  )
}

const SelectDemo = () => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="framework">Select Framework</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select a framework" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="next">Next.js</SelectItem>
            <SelectItem value="react">React</SelectItem>
            <SelectItem value="vue">Vue.js</SelectItem>
            <SelectItem value="angular">Angular</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

const TextareaDemo = () => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea 
          id="message"
          placeholder="Type your message here..."
          rows={4}
        />
      </div>
      
      <div>
        <Label htmlFor="disabled-textarea">Disabled Textarea</Label>
        <Textarea 
          id="disabled-textarea"
          placeholder="Disabled textarea..."
          disabled
        />
      </div>
    </div>
  )
}

const SliderDemo = () => {
  const [value, setValue] = React.useState([33])
  
  return (
    <div className="space-y-6">
      <div>
        <Label>Volume: {value[0]}</Label>
        <Slider
          value={value}
          onValueChange={setValue}
          max={100}
          step={1}
          className="mt-2"
        />
      </div>
      
      <div>
        <Label>Range Slider</Label>
        <Slider
          defaultValue={[25, 75]}
          max={100}
          step={1}
          className="mt-2"
        />
      </div>
    </div>
  )
}

// Overlay Components
const DialogDemo = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value="Pedro Duarte" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const TooltipDemo = () => {
  return (
    <TooltipProvider>
      <div className="flex gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Hover me</Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>This is a tooltip</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon">
              <Info className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Information tooltip</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}

const DropdownDemo = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          Open Menu
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Bell className="mr-2 h-4 w-4" />
          Notifications
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Home className="mr-2 h-4 w-4" />
          Home
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600">
          <X className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Data Display Components
const TabsDemo = () => {
  return (<div>

      <div className="grid grid-cols-1 md:grid-cols-2  gap-2">

        
      {/* card Tabs */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Card</h2>
          <Tabs defaultValue="tab1" className="flex flex-col gap-2">
            <TabsList variant="card" size="default">
              <TabsTrigger variant="card" value="tab1">
                <MageDashboard className="w-5 h-5" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger variant="card" value="tab2">
                <SearchIcon className="w-5 h-5" />
                Explore
              </TabsTrigger>
              <TabsTrigger variant="card" value="tab3">
                <Heart className="w-5 h-5" />
                Favorites
              </TabsTrigger>
            </TabsList>
            <TabsContent value="tab1" className="mt-4 p-4 bg-background rounded-lg">
              <p className="text-muted-foreground">Floating action tabs with elevated design and shadow effects.</p>
            </TabsContent>
          </Tabs>
        </div>  

      {/* Pill Tabs */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Pills</h2>
          <Tabs defaultValue="tab1" className="flex flex-col gap-2">
            <TabsList variant="pill" size="default">
              <TabsTrigger variant="pill" value="tab1">
                <MageDashboard className="w-5 h-5" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger variant="pill" value="tab2">
                <SearchIcon className="w-5 h-5" />
                Explore
              </TabsTrigger>
              <TabsTrigger variant="pill" value="tab3">
                <Heart className="w-5 h-5" />
                Favorites
              </TabsTrigger>
            </TabsList>
            <TabsContent value="tab1" className="mt-4 p-4 bg-background rounded-lg">
              <p className="text-muted-foreground">Floating action tabs with elevated design and shadow effects.</p>
            </TabsContent>
          </Tabs>
        </div>  
           {/* Minimal Tabs */}
           <div className="bg-card rounded-xl border border-border p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">segmented</h2>
          <Tabs defaultValue="tab1" className="flex flex-col gap-2">
            <TabsList variant="segmented" size="default">
              <TabsTrigger variant="segmented" value="tab1">
                <MageDashboard className="w-5 h-5" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger variant="segmented" value="tab2">
                <SearchIcon className="w-5 h-5" />
                Explore
              </TabsTrigger>
              <TabsTrigger variant="segmented" value="tab3">
                <Heart className="w-5 h-5" />
                Favorites
              </TabsTrigger>
            </TabsList>
            <TabsContent value="tab1" className="mt-4 p-4 bg-background rounded-lg">
              <p className="text-muted-foreground">Floating action tabs with elevated design and shadow effects.</p>
            </TabsContent>
          </Tabs>
        </div>
          {/* Minimal Tabs */}
          <div className="bg-card rounded-xl border border-border p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Minimal</h2>
          <Tabs defaultValue="tab1" className="flex flex-col gap-2">
            <TabsList variant="minimal" size="default">
              <TabsTrigger variant="minimal" value="tab1">
                <Coins className="w-5 h-5" />
                Tokens
              </TabsTrigger>
              <TabsTrigger variant="minimal" value="tab2">
                <Images className="w-5 h-5" />
                NFTs
              </TabsTrigger>
              <TabsTrigger variant="minimal" value="tab3">
                <ListCheck className="w-5 h-5" />
                Transactions
              </TabsTrigger>
            </TabsList>
            <TabsContent value="tab1" className="mt-4 p-4 bg-background rounded-lg">
              <p className="text-muted-foreground">Floating action tabs with elevated design and shadow effects.</p>
            </TabsContent>
          </Tabs>
        </div>
        {/* Floating Action Tabs */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Floating Action</h2>
          <Tabs defaultValue="tab1" className="flex flex-col gap-2">
            <TabsList variant="floatingAction" size="default">
              <TabsTrigger variant="floatingAction" value="tab1">
                <MageDashboard className="w-5 h-5" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger variant="floatingAction" value="tab2">
                <SearchIcon className="w-5 h-5" />
                Explore
              </TabsTrigger>
              <TabsTrigger variant="floatingAction" value="tab3">
                <Heart className="w-5 h-5" />
                Favorites
              </TabsTrigger>
            </TabsList>
            <TabsContent value="tab1" className="mt-4 p-4 bg-background rounded-lg">
              <p className="text-muted-foreground">Floating action tabs with elevated design and shadow effects.</p>
            </TabsContent>
          </Tabs>
        </div>

        {/* Icon-Only Tabs */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Icon-Only</h2>
          <Tabs defaultValue="tab1" className="flex flex-col gap-2">
            <IconTabsList variant="iconOnly" size="default">
              <IconTabsTrigger variant="iconOnly" value="tab1" icon={<Home className="w-5 h-5" />}>
                <span className="sr-only">Home</span>
              </IconTabsTrigger>
              <IconTabsTrigger variant="iconOnly" value="tab2" icon={<SearchIcon className="w-5 h-5" />}>
                <span className="sr-only">Search</span>
              </IconTabsTrigger>
              <IconTabsTrigger variant="iconOnly" value="tab3" icon={<Heart className="w-5 h-5" />} badge={3}>
                <span className="sr-only">Favorites</span>
              </IconTabsTrigger>
            </IconTabsList>
            <TabsContent value="tab1" className="mt-4 p-4 bg-background rounded-lg">
              <p className="text-muted-foreground">Minimal icon-only navigation with badge notifications.</p>
            </TabsContent>
          </Tabs>
        </div>

        {/* Step Indicator */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Step Indicator</h2>
          <Tabs defaultValue="tab1" className="flex flex-col gap-2">
            <TabsList variant="steps" size="default">
              <TabsTrigger variant="steps" value="tab1">
                <StepIndicator step={1} completed={true} />
                <span>Setup</span>
              </TabsTrigger>
              <TabsTrigger variant="steps" value="tab2">
                <StepIndicator step={2} />
                <span>Configure</span>
              </TabsTrigger>
              <TabsTrigger variant="steps" value="tab3">
                <StepIndicator step={3} />
                <span>Complete</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="tab1" className="mt-4 p-4 bg-background rounded-lg">
              <p className="text-muted-foreground">Multi-step wizard with visual progress indicators.</p>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar Tabs */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Sidebar</h2>
          <Tabs defaultValue="tab1" className="flex flex-col gap-2">
            <TabsList variant="sidebar" size="default">
              <TabsTrigger variant="sidebar" value="tab1">
                <CoinsIcon className="w-5 h-5" />
                Tokens
              </TabsTrigger>
              <TabsTrigger variant="sidebar" value="tab2">
                <ImagesIcon className="w-5 h-5" />
                NFTs
              </TabsTrigger>
              <TabsTrigger variant="sidebar" value="tab3">
                <ListChecks className="w-5 h-5" />
                Transactions
              </TabsTrigger>
            </TabsList>
            <TabsContent value="tab1" className="mt-4 p-4 bg-background rounded-lg">
              <p className="text-muted-foreground">Sidebar navigation with icons and labels.</p>
            </TabsContent>
          </Tabs>
        </div>

        {/* Card Stack */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Card Stack</h2>
          <Tabs defaultValue="tab1" className="flex flex-col gap-2">
            <TabsList variant="stacked" size="default">
              <TabsTrigger variant="stacked" value="tab1">
              <CoinsIcon className="w-5 h-5" />
              Tokens
              </TabsTrigger>
              <TabsTrigger variant="stacked" value="tab2">
              <ImagesIcon className="w-5 h-5" />
              NFTs
              </TabsTrigger>
              <TabsTrigger variant="stacked" value="tab3">
              <ListChecks className="w-5 h-5" />
              Transactions
              </TabsTrigger>
            </TabsList>
            <TabsContent value="tab1" className="mt-4 p-4 bg-background rounded-lg">
              <p className="text-muted-foreground">Stacked card design with elevation effects on active tab.</p>
            </TabsContent>
          </Tabs>
        </div>

        {/* Timeline */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Timeline</h2>
          <Tabs defaultValue="tab1" className="flex flex-col gap-2">
            <TabsList variant="timeline" size="default">
              <TabsTrigger variant="timeline" value="tab1">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold">1</span>
                  </div>
                  <div>
                    <div className="font-medium">Planning</div>
                    <div className="text-xs text-muted-foreground">Phase 1</div>
                  </div>
                </div>
              </TabsTrigger>
              <TabsTrigger variant="timeline" value="tab2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground font-semibold">2</span>
                  </div>
                  <div>
                    <div className="font-medium">Design</div>
                    <div className="text-xs text-muted-foreground">Phase 2</div>
                  </div>
                </div>
              </TabsTrigger>
              <TabsTrigger variant="timeline" value="tab3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground font-semibold">3</span>
                  </div>
                  <div>
                    <div className="font-medium">Development</div>
                    <div className="text-xs text-muted-foreground">Phase 3</div>
                  </div>
                </div>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="tab1" className="mt-4 p-4 bg-background rounded-lg">
              <p className="text-muted-foreground">Timeline-based navigation with numbered phases.</p>
            </TabsContent>
          </Tabs>
        </div>

        {/* Glassmorphism */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Glassmorphism</h2>
          <Tabs defaultValue="tab1" className="flex flex-col gap-2">
            <TabsList variant="glass" size="default">
              <TabsTrigger variant="glass" value="tab1">
                <Home className="w-5 h-5" />
                Home
              </TabsTrigger>
              <TabsTrigger variant="glass" value="tab2">
                <SearchIcon className="w-5 h-5" />
                Explore
              </TabsTrigger>
              <TabsTrigger variant="glass" value="tab3">
                <Heart className="w-5 h-5" />
                Favorites
              </TabsTrigger>
            </TabsList>
            <TabsContent value="tab1" className="mt-4 p-4 bg-background/50 backdrop-blur-sm rounded-lg border border-white/10">
              <p className="text-muted-foreground">Frosted glass effect with transparency and blur.</p>
            </TabsContent>
          </Tabs>
        </div>

        {/* Holographic */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Holographic</h2>
          <Tabs defaultValue="tab1" className="flex flex-col gap-2">
            <TabsList variant="hologram" size="default">
              <TabsTrigger variant="hologram" value="tab1">
                <Home className="w-5 h-5" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger variant="hologram" value="tab2">
                <UserIcon className="w-5 h-5" />
                Profile
              </TabsTrigger>
              <TabsTrigger variant="hologram" value="tab3">
                <Settings className="w-5 h-5" />
                Settings
              </TabsTrigger>
            </TabsList>
            <TabsContent value="tab1" className="mt-4 p-4 bg-background/80 backdrop-blur-sm rounded-lg border border-white/10">
              <p className="text-muted-foreground">Futuristic holographic interface with prismatic effects.</p>
            </TabsContent>
          </Tabs>
        </div>

        {/* Cyberpunk */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Cyberpunk</h2>
          <Tabs defaultValue="tab1" className="flex flex-col gap-2">
            <TabsList variant="cyber" size="default">
              <TabsTrigger variant="cyber" value="tab1">
                <Home className="w-5 h-5" />
                Terminal
              </TabsTrigger>
              <TabsTrigger variant="cyber" value="tab2">
                <SearchIcon className="w-5 h-5" />
                Network
              </TabsTrigger>
              <TabsTrigger variant="cyber" value="tab3">
                <Settings className="w-5 h-5" />
                Security
              </TabsTrigger>
            </TabsList>
            <TabsContent value="tab1" className="mt-4 p-4 bg-black/50 rounded-lg border border-cyan-500/20">
              <p className="text-cyan-400/70">Cyberpunk interface with neon accents and glowing effects.</p>
            </TabsContent>
          </Tabs>
        </div>

        {/* Badge Tabs */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Badge Tabs</h2>
          <Tabs defaultValue="tab1" className="flex flex-col gap-2">
            <TabsList variant="badge" size="default">
              <IconTabsTrigger variant="badge" value="tab1" icon={<Bell className="w-5 h-5" />} badge={5}>
                Notifications
              </IconTabsTrigger>
              <IconTabsTrigger variant="badge" value="tab2" icon={<Star className="w-5 h-5" />} badge={12}>
                Reviews
              </IconTabsTrigger>
              <IconTabsTrigger variant="badge" value="tab3" icon={<Heart className="w-5 h-5" />} badge={24}>
                Favorites
              </IconTabsTrigger>
            </TabsList>
            <TabsContent value="tab1" className="mt-4 p-4 bg-background rounded-lg">
              <p className="text-muted-foreground">Tabs with notification badges for unread items.</p>
            </TabsContent>
          </Tabs>
        </div>

        {/* Progress Tabs */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Progress</h2>
          <Tabs defaultValue="tab1" className="flex flex-col gap-2">
            <TabsList variant="progress" size="default">
              <TabsTrigger variant="progress" value="tab1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span>Started</span>
                </div>
              </TabsTrigger>
              <TabsTrigger variant="progress" value="tab2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <div className="w-8 h-1 bg-primary rounded"></div>
                  <span>In Progress</span>
                </div>
              </TabsTrigger>
              <TabsTrigger variant="progress" value="tab3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <div className="w-8 h-1 bg-primary rounded"></div>
                  <div className="w-8 h-1 bg-primary rounded"></div>
                  <span>Almost Done</span>
                </div>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="tab1" className="mt-4 p-4 bg-background rounded-lg">
              <p className="text-muted-foreground">Progress indicators showing completion status.</p>
            </TabsContent>
          </Tabs>
        </div>

        {/* Animated Tabs */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Animated</h2>
          <Tabs defaultValue="tab1" className="flex flex-col gap-2">
            <TabsList variant="animated" size="default">
              <TabsTrigger variant="animated" value="tab1">
                <Home className="w-5 h-5" />
                Home
              </TabsTrigger>
              <TabsTrigger variant="animated" value="tab2">
                <SearchIcon className="w-5 h-5" />
                Explore
              </TabsTrigger>
              <TabsTrigger variant="animated" value="tab3">
                <Heart className="w-5 h-5" />
                Favorites
              </TabsTrigger>
            </TabsList>
            <TabsContent value="tab1" className="mt-4 p-4 bg-background rounded-lg">
              <p className="text-muted-foreground">Smooth animations with gradient backgrounds.</p>
            </TabsContent>
          </Tabs>
        </div>
      </div>

    </div>
  )
}

const AccordionDemo = () => {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. It adheres to the WAI-ARIA design pattern.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>
          Yes. It comes with default styles that matches the other components&apos; aesthetic.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>
          Yes. It&apos;s animated by default, but you can disable it if you prefer.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

// Missing Component Demos

const ToggleDemo = () => {
  const [pressed, setPressed] = React.useState(false)
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Toggle pressed={pressed} onPressedChange={setPressed}>
          <Star className="h-4 w-4" />
        </Toggle>
        <span className="text-sm">
          {pressed ? "Starred" : "Not starred"}
        </span>
      </div>
      
      <div className="flex gap-2">
        <Toggle size="sm">
          <Star className="h-3 w-3" />
        </Toggle>
        <Toggle size="default">
          <Star className="h-4 w-4" />
        </Toggle>
        <Toggle size="lg">
          <Star className="h-5 w-5" />
        </Toggle>
      </div>
    </div>
  )
}

const CalendarDemo = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  
  return (
    <div className="flex justify-center">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
      />
    </div>
  )
}

const TableDemo = () => {
  const invoices = [
    { invoice: "INV001", paymentStatus: "Paid", totalAmount: "$250.00", method: "Credit Card" },
    { invoice: "INV002", paymentStatus: "Pending", totalAmount: "$150.00", method: "PayPal" },
    { invoice: "INV003", paymentStatus: "Unpaid", totalAmount: "$350.00", method: "Bank Transfer" },
  ]

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.invoice}>
              <TableCell className="font-medium">{invoice.invoice}</TableCell>
              <TableCell>{invoice.paymentStatus}</TableCell>
              <TableCell>{invoice.method}</TableCell>
              <TableCell className="text-right">{invoice.totalAmount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

const SheetDemo = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value="Pedro Duarte" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input id="username" value="@peduarte" className="col-span-3" />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

const DrawerDemo = () => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Edit profile</DrawerTitle>
          <DrawerDescription>
            Make changes to your profile here. Click save when you're done.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4">
          <div className="grid gap-4 py-4">
            <Input placeholder="Name" />
            <Input placeholder="Username" />
          </div>
        </div>
        <DrawerFooter className="pt-2">
          <Button>Save changes</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

const CollapsibleDemo = () => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full space-y-2">
      <div className="flex items-center justify-between space-x-4">
        <h4 className="text-sm font-semibold">
          @peduarte starred 3 repositories
        </h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-9 p-0">
            <ChevronDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <div className="rounded-md border px-4 py-3 font-mono text-sm">
        @radix-ui/primitives
      </div>
      <CollapsibleContent className="space-y-2">
        <div className="rounded-md border px-4 py-3 font-mono text-sm">
          @radix-ui/colors
        </div>
        <div className="rounded-md border px-4 py-3 font-mono text-sm">
          @stitches/react
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

const CommandDemo = () => {
  return (
    <Command className="rounded-lg border shadow-md">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span>Calendar</span>
          </CommandItem>
          <CommandItem>
            <SearchIcon className="mr-2 h-4 w-4" />
            <span>Search Emoji</span>
          </CommandItem>
          <CommandItem>
            <Calculator className="mr-2 h-4 w-4" />
            <span>Calculator</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}

const LoadingButtonDemo = () => {
  const [isLoading, setIsLoading] = React.useState(false)

  const handleClick = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 2000)
  }

  return (
    <div className="space-y-4">
      <LoadingButton isLoading={isLoading} onClick={handleClick}>
        {isLoading ? "Loading..." : "Click me"}
      </LoadingButton>
      
      <div className="flex gap-2">
        <LoadingButton isLoading={true} size="sm">
          Loading
        </LoadingButton>
        <LoadingButton isLoading={false} variant="outline">
          Not loading
        </LoadingButton>
      </div>
    </div>
  )
}

const ThemeSwitcherDemo = () => {
  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium">Theme:</span>
      <ThemeSwitcher />
    </div>
  )
}

const FileUploadDemo = () => {
  const [files, setFiles] = React.useState<File[]>([])

  return (
    <div className="space-y-4">
      <FileUpload
        maxFiles={3}
        maxSize={5 * 1024 * 1024} // 5MB
        accept={{ 'image/*': ['.png', '.jpg', '.jpeg'] }}
        onFilesChange={setFiles}
      />
      {files.length > 0 && (
        <div className="text-sm text-muted-foreground">
          {files.length} file(s) selected
        </div>
      )}
    </div>
  )
}

const SearchDemo = () => {
  const [query, setQuery] = React.useState("")
  const items = ["Apple", "Banana", "Cherry", "Date", "Elderberry"]
  const filteredItems = items.filter(item => 
    item.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <Search
        value={query}
        onChange={setQuery}
        placeholder="Search fruits..."
        className="max-w-md"
      />
      <div className="space-y-1">
        {filteredItems.map(item => (
          <div key={item} className="p-2 text-sm border rounded">
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}

const MetricCardDemo = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <MetricCard
        title="Total Revenue"
        value="$45,231"
        change="+20.1%"
        trend="up"
        icon={DollarSign}
      />
      <MetricCard
        title="Active Users"
        value="2,350"
        change="-5.4%"
        trend="down"
        icon={Users}
      />
    </div>
  )
}

const StatsCardDemo = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatsCard
        title="Total Sales"
        value="$12,426"
        description="Increased by 12% this month"
        icon={TrendingUp}
        trend="positive"
      />
      <StatsCard
        title="New Customers" 
        value="1,340"
        description="Decreased by 5% this week"
        icon={Users}
        trend="negative"
      />
      <StatsCard
        title="Active Projects"
        value="58"
        description="No change from last month"
        icon={Activity}
        trend="neutral"
      />
    </div>
  )
}

// Advanced Components
const DockDemo = () => {
  const dock = useDock([
    {
      id: 'add',
      label: 'Add',
      icon: <LetsIconsAddRingDuotone className="w-12 h-12 text-primary"  />,
     
      hotkey: '⌘+1',
      onClick: () => alert('Add clicked!')
    },
    {
      id: 'home',
      label: 'Dashboard',
      icon: <StreamlineFlexHome2 className="w-6 h-6 text-accent-foreground/80"/>,
      href: '/dashboard',
      hotkey: '⌘+1'
    },
    {
      id: 'wallets',
      label: 'Wallets',
      icon: <StreamlineFlexWallet className="w-6 h-6 text-accent-foreground/80" />,
      href: '/dashboard/accounts/wallet',
      hotkey: '⌘+1'
    },
    
    {
      id: 'demo',
      label: 'Demo',
      icon: <ImageIcon className="w-6 h-6 text-accent-foreground/80"/>,
      href: '/demo',
      badge: 2
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-6 h-6 text-accent-foreground/80"/>,
      href: '/settings',
      badge: 2
    }
  ])

  return (
    <div className="space-y-6">
      <div className="relative bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-lg p-12 min-h-[200px] flex items-center justify-center">
        <Dock
          items={dock.items}
          position="bottom"
          size="md"
          magnification={false}
          indicatorStyle="windows11"
          blur={false}
          className="relative "
          showActiveIndicator={true}
          autoDetectActive={true}
        />
       
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium mb-2">Mini Dock</h4>
          <MiniDock items={dock.items} />
        </div>
        <div>
          <h4 className="font-medium mb-2">Floating Dock</h4>
          {/* <div className="flex justify-center">
            <FloatingDock items={dock.items.slice(0, 3)} />
          </div> */}
        </div>
      </div>
    </div>
  )
}

function NotificationsDock() {
  const notifications = useExpandableDock()
  
  const notificationItems: ExpandableItem[] = [
    {
      id: '1',
      title: 'New message from John',
      subtitle: 'Hey, let\'s discuss the project details...',
      status: 'idle',
      timestamp: '2 min ago',
      icon: <MessageSquare className="w-4 h-4" />,
      onClick: () => {
        // Navigate to message
        router.push('/messages/john')
      }
    },
    {
      id: '2', 
      title: 'Payment received',
      subtitle: '$1,250.00 from Crypto Wallet',
      status: 'success',
      timestamp: '5 min ago',
      icon: <DollarSign className="w-4 h-4" />,
      badge: 'New',
      onClick: () => { }
    },
    {
      id: '3',
      title: 'Sync error',
      subtitle: 'Failed to sync Bitcoin wallet data',
      status: 'error', 
      timestamp: '10 min ago',
      icon: <AlertCircle className="w-4 h-4" />,
      onClick: () => {}
    }
  ]
  
  return (
    <ExpandableDock
      trigger={{
        icon: <Bell className="w-4 h-4" />,
        label: 'Notifications',
        badge: notificationItems.length
      }}
      items={notificationItems}
      isExpanded={notifications.isExpanded}
      onToggle={notifications.toggle}
      panelTitle="Notifications" 
      position="bottom-right"
    />
  )
}

function WalletTrackerDock() {
  const walletTracker = useExpandableDock()
  const [wallets, setWallets] = React.useState<ExpandableItem[]>([])
  
  React.useEffect(() => {
    // Fetch wallet data
    const mockWallets: ExpandableItem[] = [
      {
        id: 'btc-wallet',
        title: 'Bitcoin Wallet',
    
        status: 'success',
        timestamp: 'Last sync: 30s ago',
        icon: <Bitcoin className="w-5 h-5" />,
        
        onClick: () => router.push('/wallets/btc')
      },
      {
        id: 'eth-wallet', 
        title: 'Ethereum Wallet',
      
        status: 'loading',
        timestamp: 'Syncing...',
        icon: <Earth className="w-5 h-5" />,
        onClick: () => router.push('/wallets/eth')
      },
      {
        id: 'ada-wallet',
        title: 'Cardano Wallet', 
  
        status: 'warning',
        timestamp: 'Sync delayed: 5min',
        icon: <Wallet className="w-5 h-5" />,
        badge: 'error',
        onClick: () => router.push('/wallets/ada')
      },
      {
        id: 'sol-wallet',
        title: 'Solana Wallet',
        subtitle: 'Connection failed',
        status: 'error',
        timestamp: 'Last sync: 2hrs ago',
        icon: <AlertTriangle className="w-5 h-5" />,
        onClick: () => {}
      }
    ]
    setWallets(mockWallets)
  }, [])
  
  const activeWallets = wallets.filter(w => w.status === 'success').length
  const totalWallets = wallets.length
  
  return (
    <ExpandableDock
      trigger={{
        icon: <StreamlineFlexWallet className="w-4 h-4" />,
        label: 'Wallet Tracker',
        badge: `${activeWallets}/${totalWallets}`
      }}
      items={wallets}
      isExpanded={walletTracker.isExpanded}
      onToggle={walletTracker.toggle}
      panelTitle="Crypto Wallets"
      position="bottom-left"
      maxHeight={500}
    />
  )
}

function SystemStatusDock() {
  const systemStatus = useExpandableDock()
  const [isLoading, setIsLoading] = React.useState(false)
  
  const statusItems: ExpandableItem[] = [
    {
      id: 'api-status',
      title: 'API Server',
      subtitle: 'All services operational',
      status: 'success',
      timestamp: 'Last check: 1min ago',
      icon: <Server className="w-4 h-4" />
    },
    {
      id: 'database',
      title: 'Database',
      subtitle: 'Connection stable',
      status: 'success', 
      timestamp: 'Last check: 30s ago',
      icon: <Database className="w-4 h-4" />
    },
    {
      id: 'backup',
      title: 'Backup Service',
      subtitle: 'Daily backup in progress',
      status: 'loading',
      timestamp: 'Started: 10min ago',
      icon: <HardDrive className="w-4 h-4" />
    }
  ]
  
  return (
    <ExpandableDock
      trigger={{
        icon: <Activity className="w-4 h-4" />,
        label: 'System Status',
        badge: statusItems.filter(item => item.status === 'error').length || undefined
      }}
      items={statusItems}
      isExpanded={systemStatus.isExpanded}
      onToggle={systemStatus.toggle}
      panelTitle="System Status"
      isLoading={isLoading}
      position="top-right"
    />
  )
}

const WalletHeaderDemo = () => {
  const [showBalance, setShowBalance] = React.useState(true)
  
  const sampleWallet = {
    id: "1",
    name: "Main Wallet",
    address: "0x742d35Cc6634C0532925a3b8D22adb63bb6E7A7e",
    balance: 12.5,
    balanceUsd: 25000,
    change24h: 1250.75,
    change24hPercent: 5.25,
    network: "Ethereum",
    isWatching: true,
    lastUpdated: new Date(),
  }

  return (
    <div className="space-y-6">
      <WalletHeader
        wallet={sampleWallet}
        showBalance={showBalance}
        onToggleBalance={() => setShowBalance(!showBalance)}
      />
      <CompactWalletHeader
        wallet={sampleWallet}
        showBalance={showBalance}
        onToggleBalance={() => setShowBalance(!showBalance)}
      />
    </div>
  )
}

const DatePickerDemo = () => {
  const [date, setDate] = React.useState<Date>()
  const [dateRange, setDateRange] = React.useState<{ from?: Date; to?: Date }>({})

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Single Date Picker</label>
        <DatePicker date={date} onSelect={setDate} />
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Date Range Picker</label>
        <DateRangePicker
          from={dateRange.from}
          to={dateRange.to}
          onSelect={setDateRange}
        />
      </div>
    </div>
  )
}

const MultiSelectDemo = () => {
  const multiSelect = useMultiSelect(["react"])
  const options = [
    { label: "React", value: "react" },
    { label: "Next.js", value: "nextjs" },
    { label: "TypeScript", value: "typescript" },
    { label: "Tailwind CSS", value: "tailwind" },
  ]

  return (
    <div>
      <label className="text-sm font-medium mb-2 block">Multi Select</label>
      <MultiSelect
        options={options}
        selected={multiSelect.selected}
        onChange={multiSelect.onChange}
        placeholder="Select technologies..."
      />
    </div>
  )
}

const LoadingDemo = () => {
  const [isLoading, setIsLoading] = React.useState(false)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-sm font-medium mb-2">Default</p>
          <LoadingSpinner />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium mb-2">Dots</p>
          <LoadingSpinner variant="dots" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium mb-2">Pulse</p>
          <LoadingSpinner variant="pulse" />
        </div>
      </div>
      
      <div>
        <p className="text-sm font-medium mb-2">Loading Skeleton</p>
        <LoadingSkeleton lines={3} />
      </div>

      <div className="relative">
        <Button onClick={() => {
          setIsLoading(true)
          setTimeout(() => setIsLoading(false), 2000)
        }}>
          Toggle Overlay
        </Button>
        <div className="mt-4 p-4 bg-muted rounded relative min-h-[100px]">
          <p>Content behind overlay</p>
          <LoadingOverlay isVisible={isLoading} text="Loading..." />
        </div>
      </div>
    </div>
  )
}

const PricingTableDemo = () => {
  const pricing = usePricing("monthly")
  const plans = [
    {
      id: "free",
      name: "Free",
      description: "For getting started",
      price: { monthly: 0, yearly: 0 },
      features: [
        { name: "Basic features", included: true },
        { name: "Email support", included: true },
        { name: "Advanced features", included: false },
      ],
    },
    {
      id: "pro",
      name: "Pro",
      description: "For professionals",
      price: { monthly: 29, yearly: 290 },
      features: [
        { name: "All features", included: true },
        { name: "Priority support", included: true },
        { name: "API access", included: true },
      ],
      highlighted: true,
      popular: true,
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <PricingBillingToggle
          billingCycle={pricing.billingCycle}
          onToggle={pricing.setBillingCycle}
          yearlyDiscount="Save 17%"
        />
      </div>
      <PricingTable
        plans={plans}
        billingCycle={pricing.billingCycle}
        onSelectPlan={(id) => console.log("Selected:", id)}
      />
    </div>
  )
}

const PaginationDemo = () => {
  const [currentPage, setCurrentPage] = React.useState(1)
  
  return (
    <div className="space-y-4">
      <PaginationInfo
        currentPage={currentPage}
        totalPages={10}
        totalItems={100}
        itemsPerPage={10}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={10}
        onPageChange={setCurrentPage}
        showFirstLast
      />
    </div>
  )
}

const WindowControlsDemo = () => {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium mb-2">Standard Controls</p>
        <div className="p-4 border rounded-lg">
          <WindowControls />
        </div>
      </div>
      <div>
        <p className="text-sm font-medium mb-2">Minimal Controls</p>
        <div className="p-4 border rounded-lg">
          <WindowControls variant="minimal" />
        </div>
      </div>
    </div>
  )
}

const NumberInputDemo = () => {
  const numberInput = useNumberInput(100)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Basic Number Input</label>
        <NumberInput
          value={numberInput.value}
          onChange={numberInput.onChange}
          min={0}
          max={1000}
          step={1}
        />
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">With Controls</label>
        <NumberInput
          value={numberInput.value}
          onChange={numberInput.onChange}
          showControls
          min={0}
          max={1000}
          step={5}
        />
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Currency Format</label>
        <NumberInput
          value={numberInput.value}
          onChange={numberInput.onChange}
          prefix="$"
          suffix=" USD"
          precision={2}
        />
      </div>
    </div>
  )
}

const ComboboxDemo = () => {
  const combobox = useCombobox("nextjs")
  const options = [
    { label: "React", value: "react" },
    { label: "Next.js", value: "nextjs" },
    { label: "Vue.js", value: "vuejs" },
    { label: "Angular", value: "angular" },
    { label: "Svelte", value: "svelte" },
  ]

  return (
    <div>
      <label className="text-sm font-medium mb-2 block">Framework Selection</label>
      <Combobox
        options={options}
        value={combobox.value}
        onSelect={combobox.onSelect}
        placeholder="Choose framework..."
      />
    </div>
  )
}

const ModalDemo = () => {
  const modal = useModal()

  return (
    <div className="space-y-4">
      <Button onClick={modal.openModal}>Open Modal</Button>
      <p className="text-sm text-muted-foreground">
        Accessible modal with proper keyboard navigation and focus management.
      </p>
      <Modal open={modal.open} onClose={modal.closeModal} size="md">
        <ModalHeader>
          <ModalTitle>Example Modal</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <p>This modal demonstrates proper accessibility and keyboard navigation.</p>
          <p className="text-sm text-muted-foreground mt-2">
            You can press Escape to close or click outside.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={modal.closeModal}>
            Cancel
          </Button>
          <Button onClick={modal.closeModal}>
            Confirm
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

const FinderDemo = () => {
  const [showFinder, setShowFinder] = React.useState(false)

  return (
    <div className="space-y-4">
      <Button onClick={() => setShowFinder(true)}>Open Finder Window</Button>
      <p className="text-sm text-muted-foreground">
        Complete macOS Finder-style file browser with sidebar, toolbar, and grid/list views.
      </p>
      {showFinder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <FinderWindow onClose={() => setShowFinder(false)} />
        </div>
      )}
    </div>
  )
}

// Layout Components
const AppHeaderDemo = () => {
  const sampleUser = {
    name: "John Doe",
    email: "john@example.com",
    avatar: "https://github.com/shadcn.png",
    plan: "pro" as const,
    balance: 45231.75,
  }

  return (
    <div className="space-y-4">
      <AppHeader
        user={sampleUser}
        showSearch={true}
        showNotifications={true}
        showThemeToggle={true}
        notificationCount={3}
        onSearch={(query) => console.log("Search:", query)}
        onNotificationClick={() => console.log("Notifications clicked")}
        onProfileClick={() => console.log("Profile clicked")}
        onSignOut={() => console.log("Sign out")}
      />
      <p className="text-sm text-muted-foreground text-center mt-4">
        Complete application header with navigation, search, notifications, and user menu
      </p>
    </div>
  )
}

const AppSidebarDemo = () => {
  const [collapsed, setCollapsed] = React.useState(false)

  return (
    <div className="space-y-4">
      <div className="h-96 border rounded-lg relative overflow-hidden">
        <AppSidebar
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          className="h-full"
        />
      </div>
      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? "Expand" : "Collapse"} Sidebar
        </Button>
      </div>
      <p className="text-sm text-muted-foreground text-center">
        Professional sidebar navigation with collapsible sections and quick actions
      </p>
    </div>
  )
}

const DashboardLayoutDemo = () => {
  return (
    <div className="space-y-4">
      <div className="border rounded-lg h-96 overflow-hidden">
        <DashboardLayout
          showHeader={true}
          showSidebar={true}
          sidebarCollapsible={true}
          spacing="default"
        >
          <PageContainer>
            <PageHeader
              title="Dashboard"
              description="Welcome to your financial dashboard"
            >
              <Button>Add Wallet</Button>
            </PageHeader>
            <PageSection title="Overview" description="Your financial summary">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-2xl font-bold">$45,231</div>
                    <p className="text-muted-foreground">Total Balance</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-muted-foreground">Active Wallets</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-2xl font-bold">+5.2%</div>
                    <p className="text-muted-foreground">24h Change</p>
                  </CardContent>
                </Card>
              </div>
            </PageSection>
          </PageContainer>
        </DashboardLayout>
      </div>
      <p className="text-sm text-muted-foreground text-center">
        Complete dashboard layout with header, sidebar, and structured content areas
      </p>
    </div>
  )
}

const UserProfileDemo = () => {
  return (
    <div className="space-y-4">
      <div className="max-w-2xl mx-auto">
        <UserProfile user={undefined} />
      </div>
      <p className="text-sm text-muted-foreground text-center">
        Comprehensive user profile management with settings and account information
      </p>
    </div>
  )
}

// MoneyMappr-specific Demo Components
const TransactionCardDemo = () => {
  const sampleTransaction = {
    id: "tx-1",
    hash: "0x742d35Cc6634C0532925a3b8D22adb63bb6E7A7e042d35Cc6634C0532925a3b8",
    type: "send" as const,
    status: "confirmed" as const,
    from: {
      address: "0x742d35Cc6634C0532925a3b8D22adb63bb6E7A7e",
      name: "My Wallet",
    },
    to: {
      address: "0x8ba1f109551bD432803012645Hac136c22C9BC40",
      name: "Trading Account",
    },
    asset: {
      symbol: "ETH",
      name: "Ethereum",
      amount: "2.5",
      logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    },
    value: {
      usd: 4250.75,
      change24h: 125.50,
    },
    fee: {
      amount: "0.0021",
      symbol: "ETH",
      usd: 3.58,
    },
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    network: "Ethereum",
    confirmations: 15,
    requiredConfirmations: 12,
    tags: ["DeFi"],
  }

  return (
    <div className="space-y-4">
      <TransactionCard 
        transaction={sampleTransaction}
        onViewDetails={() => console.log("View details")}
        onCopyHash={() => console.log("Hash copied")}
        onViewOnExplorer={() => console.log("View on explorer")}
      />
      
      <TransactionCard 
        transaction={{
          ...sampleTransaction,
          id: "tx-2",
          type: "swap",
          status: "pending",
          toAsset: {
            symbol: "USDC",
            name: "USD Coin",
            amount: "4250.00",
          },
          confirmations: 2,
        }}
        variant="pending"
      />
    </div>
  )
}

const PortfolioSummaryDemo = () => {
  const samplePortfolio = {
    totalBalance: 1.5,
    totalValue: 45231.75,
    change24h: 1250.75,
    change24hPercent: 2.84,
    change7d: -825.50,
    change7dPercent: -1.79,
    change30d: 3420.25,
    change30dPercent: 8.17,
    walletCount: 3,
    assetCount: 12,
    allocations: [
      {
        asset: { symbol: "BTC", name: "Bitcoin", logo: "https://cryptologos.cc/logos/bitcoin-btc-logo.png" },
        balance: 0.75,
        value: 27500.00,
        percentage: 60.8,
        change24h: 850.25,
        change24hPercent: 3.2,
      },
      {
        asset: { symbol: "ETH", name: "Ethereum", logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png" },
        balance: 8.5,
        value: 14250.50,
        percentage: 31.5,
        change24h: -225.75,
        change24hPercent: -1.6,
      },
      {
        asset: { symbol: "SOL", name: "Solana" },
        balance: 125.0,
        value: 3481.25,
        percentage: 7.7,
        change24h: 125.25,
        change24hPercent: 3.7,
      },
    ],
    performance: Array.from({ length: 30 }, (_, i) => ({
      timestamp: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000),
      value: 45000 + Math.sin(i / 5) * 2000 + Math.random() * 1000,
    })),
    lastUpdated: new Date(),
    isRefreshing: false,
  }

  return (
    <div className="space-y-6">
      <PortfolioSummary 
        data={samplePortfolio}
        showChart={true}
        showAllocations={true}
        onToggleBalance={() => console.log("Toggle balance")}
        onRefresh={() => console.log("Refresh")}
        onViewDetails={() => console.log("View details")}
      />
      
      <CompactPortfolioSummary 
        data={samplePortfolio}
        onToggleBalance={() => console.log("Toggle balance")}
      />
    </div>
  )
}

const AssetPriceCardDemo = () => {
  const sampleAsset = {
    id: "bitcoin",
    symbol: "BTC",
    name: "Bitcoin",
    logo: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
    price: 43250.75,
    change24h: 1250.50,
    change24hPercent: 2.98,
    change7d: -2150.25,
    change7dPercent: -4.75,
    change30d: 5420.75,
    change30dPercent: 14.35,
    volume24h: 28500000000,
    marketCap: 850000000000,
    rank: 1,
    supply: {
      circulating: 19650000,
      total: 19650000,
      max: 21000000,
    },
    allTimeHigh: {
      price: 69045.22,
      date: new Date("2021-11-10"),
      changePercent: -37.4,
    },
    priceHistory: Array.from({ length: 24 }, (_, i) => ({
      timestamp: new Date(Date.now() - (23 - i) * 60 * 60 * 1000),
      price: 43000 + Math.sin(i / 3) * 500 + Math.random() * 200,
    })),
    isWatchlisted: true,
    hasAlerts: false,
    lastUpdated: new Date(),
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AssetPriceCard 
          asset={sampleAsset}
          showChart={true}
          showVolume={true}
          showMarketCap={true}
          showATH={true}
          onToggleWatchlist={() => console.log("Toggle watchlist")}
          onViewDetails={() => console.log("View details")}
        />
        
        <AssetPriceCard 
          asset={{
            ...sampleAsset,
            id: "ethereum",
            symbol: "ETH",
            name: "Ethereum",
            price: 2650.25,
            change24hPercent: -1.85,
            rank: 2,
            isWatchlisted: false,
          }}
          compact={true}
          variant="elevated"
        />
      </div>
      
      <div className="space-y-2">
        <h4 className="font-medium">Asset Price Rows</h4>
        <AssetPriceRow 
          asset={sampleAsset}
          onToggleWatchlist={() => console.log("Toggle watchlist")}
        />
        <AssetPriceRow 
          asset={{
            ...sampleAsset,
            id: "ethereum",
            symbol: "ETH",
            name: "Ethereum",
            price: 2650.25,
            change24hPercent: -1.85,
            rank: 2,
          }}
        />
      </div>
    </div>
  )
}

// Missing Component Demos
const CommandPaletteDemo = () => {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const sampleItems = [
    {
      id: "dashboard",
      title: "Dashboard",
      description: "View your financial overview",
      icon: <Home className="size-4" />,
      category: "Navigation",
      keywords: ["home", "overview", "summary"],
      shortcut: ["Ctrl", "H"],
      action: () => console.log("Navigate to dashboard"),
    },
    {
      id: "wallets",
      title: "Crypto Wallets",
      description: "Manage your cryptocurrency portfolios",
      icon: <Wallet className="size-4" />,
      category: "Navigation",
      keywords: ["crypto", "bitcoin", "ethereum", "portfolio"],
      shortcut: ["Ctrl", "W"],
      action: () => console.log("Navigate to wallets"),
    },
    {
      id: "settings",
      title: "Settings",
      description: "Configure your account preferences",
      icon: <Settings className="size-4" />,
      category: "Navigation",
      keywords: ["preferences", "config", "account"],
      shortcut: ["Ctrl", ","],
      action: () => console.log("Navigate to settings"),
    },
    {
      id: "search-transactions",
      title: "Search Transactions",
      description: "Find specific transactions",
      icon: <SearchIcon className="size-4" />,
      category: "Actions",
      keywords: ["find", "filter", "history"],
      action: () => console.log("Search transactions"),
    },
  ]

  return (
    <div className="space-y-4">
      <div className="text-center">
        <Button onClick={() => setOpen(true)}>
          Open Command Palette
        </Button>
        <p className="text-sm text-muted-foreground mt-2">
          Or press <kbd>Ctrl+K</kbd> (or <kbd>⌘K</kbd> on Mac)
        </p>
      </div>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        items={sampleItems}
      />
    </div>
  )
}

const ComparisonTableDemo = () => {
  return (
    <div className="text-center py-8">
      <p className="text-muted-foreground">Comparison Table Component</p>
      <p className="text-sm text-muted-foreground mt-2">
        Feature comparison table for pricing plans and products
      </p>
    </div>
  )
}

const AdvancedChartDemo = () => {
  return (
    <div className="text-center py-8">
      <p className="text-muted-foreground">Advanced Chart Component</p>
      <p className="text-sm text-muted-foreground mt-2">
        Interactive charts with multiple data types and animations
      </p>
    </div>
  )
}

const TestimonialsDemo = () => {
  return (
    <div className="text-center py-8">
      <p className="text-muted-foreground">Testimonials Component</p>
      <p className="text-sm text-muted-foreground mt-2">
        Customer testimonials and reviews in grid or carousel layout
      </p>
    </div>
  )
}

const NotificationDemo = () => {
  const [notifications, setNotifications] = React.useState([
    { id: 1, title: "Welcome!", message: "Thanks for joining MoneyMappr", type: "success" as const },
    { id: 2, title: "New Transaction", message: "You received 0.5 ETH", type: "info" as const },
    { id: 3, title: "Price Alert", message: "Bitcoin reached $45,000", type: "warning" as const },
  ])

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={cn(
              "p-4 rounded-lg border-l-4 bg-card",
              notification.type === "success" && "border-l-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/10",
              notification.type === "info" && "border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/10",
              notification.type === "warning" && "border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/10"
            )}
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium">{notification.title}</h4>
                <p className="text-sm text-muted-foreground">{notification.message}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <Button 
        variant="outline" 
        onClick={() => setNotifications(prev => [...prev, {
          id: Date.now(),
          title: "New Notification",
          message: "This is a test notification",
          type: "info" as const
        }])}
      >
        Add Notification
      </Button>
    </div>
  )
}

const ToastDemo = () => {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button onClick={() => console.log("Success toast triggered")}>
          Success Toast
        </Button>
        <Button variant="outline" onClick={() => console.log("Error toast triggered")}>
          Error Toast
        </Button>
        <Button variant="ghost" onClick={() => console.log("Info toast triggered")}>
          Info Toast
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Toast notifications appear temporarily and auto-dismiss
      </p>
    </div>
  )
}

const PopoverDemo = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Open Popover</Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Dimensions</h4>
                <p className="text-sm text-muted-foreground">
                  Set the dimensions for the layer.
                </p>
              </div>
              <div className="grid gap-2">
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="width">Width</Label>
                  <Input
                    id="width"
                    defaultValue="100%"
                    className="col-span-2 h-8"
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="maxWidth">Max. width</Label>
                  <Input
                    id="maxWidth"
                    defaultValue="300px"
                    className="col-span-2 h-8"
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="height">Height</Label>
                  <Input
                    id="height"
                    defaultValue="25px"
                    className="col-span-2 h-8"
                  />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <p className="text-sm text-muted-foreground text-center">
        Floating content container with rich interactive content
      </p>
    </div>
  )
}

const AccountManagementDemo = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-4">
    <AuthForm type={"signin"} title={""} description={""} onSubmit={()=>{}}  />
    <AuthForm type={"signup"} title={""} description={""} onSubmit={()=>{}} />
      </div>
      <p className="text-sm text-muted-foreground text-center">
        Floating content container with rich interactive content
      </p>
    </div>
  )
}

// Form Components
const FormDemo = () => {
  const form = {
    register: () => ({}),
    handleSubmit: (fn: Function) => (e: React.FormEvent) => {
      e.preventDefault()
      fn({})
    },
    formState: { errors: {} },
    control: {},
  }

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(() => console.log("Form submitted"))} className="space-y-4">
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <Input placeholder="Enter username" />
            </FormControl>
            <FormDescription>
              This is your public display name.
            </FormDescription>
            <FormMessage />
          </FormItem>
          
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="Enter email" />
            </FormControl>
            <FormMessage />
          </FormItem>
          
          <FormItem>
            <FormLabel>Bio</FormLabel>
            <FormControl>
              <Textarea placeholder="Tell us about yourself" />
            </FormControl>
            <FormDescription>
              You can write a brief description about yourself.
            </FormDescription>
            <FormMessage />
          </FormItem>
          
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  )
}

// Placeholder demos for components that exist but need proper implementation
const PlaceholderDemo = ({ title, description }: { title: string; description: string }) => {
  return (
    <div className="text-center py-8">
      <p className="text-muted-foreground">{title}</p>
      <p className="text-sm text-muted-foreground mt-2">
        {description}
      </p>
    </div>
  )
}

const ScrollAreaDemo = () => {
  const items = Array.from({ length: 50 }, (_, i) => `Item ${i + 1}`)
  
  return (
    <div className="space-y-4">
      <ScrollArea className="h-48 w-full rounded-md border p-4">
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item} className="text-sm">
              {item}
            </div>
          ))}
        </div>
      </ScrollArea>
      <p className="text-sm text-muted-foreground">
        Custom scrollbar styling with smooth scrolling
      </p>
    </div>
  )
}

const BreadcrumbDemo = () => {
  return (
    <div className="space-y-4">
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <a href="#" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
              <Home className="size-4 mr-2" />
              Home
            </a>
          </li>
          <li>
            <div className="flex items-center">
              <ChevronRight className="size-4 text-muted-foreground" />
              <a href="#" className="ml-1 text-sm font-medium text-muted-foreground hover:text-foreground md:ml-2">
                Dashboard
              </a>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <ChevronRight className="size-4 text-muted-foreground" />
              <span className="ml-1 text-sm font-medium text-foreground md:ml-2">
                Components
              </span>
            </div>
          </li>
        </ol>
      </nav>
      
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1">
          <li className="inline-flex items-center">
            <span className="text-sm text-muted-foreground">Crypto</span>
          </li>
          <li>
            <span className="text-muted-foreground">/</span>
            <span className="ml-1 text-sm text-muted-foreground">Wallets</span>
          </li>
          <li>
            <span className="text-muted-foreground">/</span>
            <span className="ml-1 text-sm font-medium text-foreground">Bitcoin Wallet</span>
          </li>
        </ol>
      </nav>
    </div>
  )
}

const WindowResizeDemo = () => {
  return (
    <div className="text-center py-8">
      <p className="text-muted-foreground">Window Resize Component</p>
      <p className="text-sm text-muted-foreground mt-2">
        Custom window resize handles for resizable panels and modals
      </p>
    </div>
  )
}

const COMPONENTS: ComponentItem[] = [
  // Basic UI Components
  {
    id: "button",
    name: "Button",
    description: "Clickable button component with multiple variants and sizes",
    category: "basics",
    icon: MousePointer,
    component: ButtonDemo,
  },
  {
    id: "input",
    name: "Input",
    description: "Text input field with various types and states",
    category: "basics",
    icon: Type,
    component: InputDemo,
  },
  {
    id: "badge",
    name: "Badge",
    description: "Small status indicators and labels",
    category: "basics",
    icon: Circle,
    component: BadgeDemo,
  },
  {
    id: "avatar",
    name: "Avatar",
    description: "User profile picture with fallback initials",
    category: "basics",
    icon: Circle,
    component: AvatarDemo,
  },
  {
    id: "progress",
    name: "Progress",
    description: "Progress indicator showing completion percentage",
    category: "basics",
    icon: Loader,
    component: ProgressDemo,
  },
  {
    id: "skeleton",
    name: "Skeleton",
    description: "Loading placeholder component",
    category: "basics",
    icon: Square,
    component: SkeletonDemo,
  },
  {
    id: "separator",
    name: "Separator",
    description: "Visual separator line component",
    category: "basics",
    icon: Minus,
    component: SeparatorDemo,
  },
  {
    id: "alert",
    name: "Alert",
    description: "Alert messages with different severity levels",
    category: "basics",
    icon: AlertTriangle,
    component: AlertDemo,
  },
  {
    id: "toggle",
    name: "Toggle",
    description: "A two-state button that can be toggled on or off",
    category: "basics",
    icon: ToggleLeft,
    component: ToggleDemo,
  },
  {
    id: "loading-button",
    name: "Loading Button",
    description: "Button with loading state and spinner",
    category: "basics",
    icon: Loader,
    component: LoadingButtonDemo,
  },
  {
    id: "theme-switcher",
    name: "Theme Switcher",
    description: "Toggle between light and dark themes",
    category: "basics",
    icon: Palette,
    component: ThemeSwitcherDemo,
  },
  {
    id: "calendar",
    name: "Calendar",
    description: "Interactive date calendar component",
    category: "basics",
    icon: CalendarIcon,
    component: CalendarDemo,
  },

  // Form Controls
  {
    id: "checkbox",
    name: "Checkbox",
    description: "Checkbox input with label support",
    category: "forms",
    icon: CheckSquare,
    component: CheckboxDemo,
  },
  {
    id: "switch",
    name: "Switch",
    description: "Toggle switch for boolean values",
    category: "forms",
    icon: ToggleLeft,
    component: SwitchDemo,
  },
  {
    id: "select",
    name: "Select",
    description: "Dropdown select component",
    category: "forms",
    icon: ChevronDown,
    component: SelectDemo,
  },
  {
    id: "textarea",
    name: "Textarea",
    description: "Multi-line text input component",
    category: "forms",
    icon: FileText,
    component: TextareaDemo,
  },
  {
    id: "slider",
    name: "Slider",
    description: "Range slider for numeric input",
    category: "forms",
    icon: Sliders,
    component: SliderDemo,
  },
  {
    id: "date-picker",
    name: "Date Picker",
    description: "Single and range date selection with calendar popup",
    category: "forms",
    icon: CalendarIcon,
    component: DatePickerDemo,
  },
  {
    id: "multi-select",
    name: "Multi Select",
    description: "Multiple option selection with search and badges",
    category: "forms",
    icon: Filter,
    component: MultiSelectDemo,
  },
  {
    id: "combobox",
    name: "Combobox",
    description: "Searchable single selection dropdown",
    category: "forms",
    icon: List,
    component: ComboboxDemo,
  },
  {
    id: "number-input",
    name: "Number Input",
    description: "Advanced number input with controls and formatting",
    category: "forms",
    icon: Calculator,
    component: NumberInputDemo,
  },
  {
    id: "file-upload",
    name: "File Upload",
    description: "Drag and drop file upload with preview",
    category: "forms",
    icon: Upload,
    component: FileUploadDemo,
  },
  {
    id: "search",
    name: "Search",
    description: "Advanced search component with filtering",
    category: "forms",
    icon: Search,
    component: SearchDemo,
  },
  {
    id: "command",
    name: "Command",
    description: "Command menu for keyboard-driven interaction",
    category: "forms",
    icon: Code2,
    component: CommandDemo,
  },

  // Overlays
  {
    id: "dialog",
    name: "Dialog",
    description: "Modal dialog with header, body, and footer",
    category: "overlays",
    icon: Square,
    component: DialogDemo,
  },
  {
    id: "tooltip",
    name: "Tooltip",
    description: "Contextual information on hover",
    category: "overlays",
    icon: MessageSquare,
    component: TooltipDemo,
  },
  {
    id: "dropdown",
    name: "Dropdown Menu",
    description: "Context menu with multiple actions",
    category: "overlays",
    icon: Menu,
    component: DropdownDemo,
  },
  {
    id: "modal",
    name: "Modal Dialog",
    description: "Custom accessible modal with keyboard navigation",
    category: "overlays",
    icon: Upload,
    component: ModalDemo,
  },
  {
    id: "sheet",
    name: "Sheet",
    description: "Side panel overlay component",
    category: "overlays",
    icon: Menu,
    component: SheetDemo,
  },
  {
    id: "drawer",
    name: "Drawer",
    description: "Bottom drawer overlay component",
    category: "overlays",
    icon: Menu,
    component: DrawerDemo,
  },
  {
    id: "collapsible",
    name: "Collapsible",
    description: "Collapsible content sections",
    category: "overlays",
    icon: ChevronDown,
    component: CollapsibleDemo,
  },
  {
    id: "popover",
    name: "Popover",
    description: "Floating content container with positioning",
    category: "overlays",
    icon: MessageSquare,
    component: PopoverDemo,
  },

  // Data Display
  {
    id: "tabs",
    name: "Tabs",
    description: "Tabbed interface for organizing content",
    category: "data",
    icon: FileText,
    component: TabsDemo,
  },
  {
    id: "accordion",
    name: "Accordion",
    description: "Collapsible content sections",
    category: "data",
    icon: ChevronDown,
    component: AccordionDemo,
  },
  {
    id: "card",
    name: "Card",
    description: "Container component for grouping content",
    category: "data",
    icon: Square,
    component: () => (
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card description goes here</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This is the card content area where you can place any content.</p>
        </CardContent>
      </Card>
    ),
  },
  {
    id: "breadcrumb",
    name: "Breadcrumb",
    description: "Navigation breadcrumb component",
    category: "data",
    icon: ChevronRight,
    component: BreadcrumbDemo,
  },
  {
    id: "scroll-area",
    name: "Scroll Area",
    description: "Custom styled scrollable container",
    category: "data",
    icon: ArrowUpDown,
    component: ScrollAreaDemo,
  },
  {
    id: "table",
    name: "Table",
    description: "Data table component with headers and rows",
    category: "data",
    icon: TableIcon,
    component: TableDemo,
  },
  {
    id: "data-table",
    name: "Data Table",
    description: "Advanced data table with sorting and filtering",
    category: "data",
    icon: Table,
    component: () => (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Advanced data table component</p>
        <p className="text-sm text-muted-foreground mt-2">
          Full featured table with sorting, filtering, and pagination
        </p>
      </div>
    ),
  },

  // Navigation
  {
    id: "pagination",
    name: "Pagination",
    description: "Complete pagination with info display and controls",
    category: "navigation",
    icon: Navigation,
    component: PaginationDemo,
  },
  {
    id: "command-palette",
    name: "Command Palette",
    description: "Keyboard-driven command interface (⌘K)",
    category: "navigation",
    icon: SearchIcon,
    component: CommandPaletteDemo,
  },

  // Feedback
  {
    id: "loading",
    name: "Loading States",
    description: "Spinners, skeletons, overlays, and loading indicators",
    category: "feedback",
    icon: Loader,
    component: LoadingDemo,
  },
  {
    id: "notification",
    name: "Notification",
    description: "System notifications with different types and actions",
    category: "feedback",
    icon: Bell,
    component: NotificationDemo,
  },
  {
    id: "toast",
    name: "Toast",
    description: "Temporary notification messages that auto-dismiss",
    category: "feedback",
    icon: MessageSquare,
    component: ToastDemo,
  },

  // Charts & Metrics
  {
    id: "metric-card",
    name: "Metric Card",
    description: "Display key metrics with trend indicators",
    category: "charts",
    icon: TrendingUp,
    component: MetricCardDemo,
  },
  {
    id: "stats-card",
    name: "Stats Card",
    description: "Statistical data cards with icons and trends",
    category: "charts",
    icon: BarChart3,
    component: StatsCardDemo,
  },
  {
    id: "chart",
    name: "Chart",
    description: "Basic chart component for data visualization",
    category: "charts",
    icon: BarChart3,
    component: () => (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Chart Component</p>
        <p className="text-sm text-muted-foreground mt-2">
          Recharts-based charting component
        </p>
      </div>
    ),
  },
  {
    id: "advanced-chart",
    name: "Advanced Chart",
    description: "Interactive charts with multiple data types",
    category: "charts",
    icon: Activity,
    component: AdvancedChartDemo,
  },

  // Business Components
  {
    id: "comparison-table",
    name: "Comparison Table",
    description: "Feature comparison table for pricing plans",
    category: "business",
    icon: TableIcon,
    component: ComparisonTableDemo,
  },
  {
    id: "testimonials",
    name: "Testimonials",
    description: "Customer testimonials and reviews",
    category: "business",
    icon: Star,
    component: TestimonialsDemo,
  },

  // macOS Style Components
  {
    id: "dock",
    name: "Dock",
    description: "macOS-style dock with magnification effects and tooltips",
    category: "macos",
    icon: Grid3x3,
    component: DockDemo,
  },
  {
    id: "window-controls",
    name: "Window Controls",
    description: "macOS traffic light window controls with hover states",
    category: "macos",
    icon: X,
    component: WindowControlsDemo,
  },
  {
    id: "finder",
    name: "Finder Window",
    description: "Complete macOS Finder interface with file browser",
    category: "macos",
    icon: Monitor,
    component: FinderDemo,
  },

  // Crypto & Finance Components
  {
    id: "wallet-header",
    name: "Wallet Header",
    description: "Professional crypto wallet interface with balance controls",
    category: "crypto",
    icon: Wallet,
    component: WalletHeaderDemo,
  },
  {
    id: "transaction-card",
    name: "Transaction Card",
    description: "Comprehensive transaction display with status, amounts, and actions",
    category: "crypto",
    icon: ArrowUpDown,
    component: TransactionCardDemo,
  },
  {
    id: "portfolio-summary",
    name: "Portfolio Summary",
    description: "Complete portfolio overview with charts, allocations, and performance",
    category: "crypto",
    icon: PieChartIcon,
    component: PortfolioSummaryDemo,
  },
  {
    id: "asset-price-card",
    name: "Asset Price Card",
    description: "Cryptocurrency price display with charts, metrics, and controls",
    category: "crypto",
    icon: TrendingUp,
    component: AssetPriceCardDemo,
  },

  // Layout Components
  {
    id: "app-header",
    name: "App Header",
    description: "Complete application header with navigation and user menu",
    category: "layout",
    icon: Navigation,
    component: AppHeaderDemo,
  },
  {
    id: "app-sidebar",
    name: "App Sidebar",
    description: "Professional sidebar navigation with collapsible sections",
    category: "layout",
    icon: Menu,
    component: AppSidebarDemo,
  },
  {
    id: "dashboard-layout",
    name: "Dashboard Layout",
    description: "Complete dashboard layout with header, sidebar, and content areas",
    category: "layout",
    icon: Layers,
    component: DashboardLayoutDemo,
  },
  {
    id: "user-profile",
    name: "User Profile",
    description: "Comprehensive user profile management component",
    category: "layout",
    icon: UserIcon,
    component: UserProfileDemo,
  },

  // Form Components (Additional)
  {
    id: "form",
    name: "Form",
    description: "React Hook Form integration with validation",
    category: "forms",
    icon: FileText,
    component: FormDemo,
  },

  // Overlays (Additional) 
  {
    id: "popover",
    name: "Popover",
    description: "Floating content container with positioning",
    category: "overlays",
    icon: MessageSquare,
    component: PopoverDemo,
  },

  // Navigation (Additional)
  {
    id: "breadcrumb",
    name: "Breadcrumb",
    description: "Navigation breadcrumb component",
    category: "navigation",
    icon: ChevronRight,
    component: BreadcrumbDemo,
  },

  // Feedback (Additional)
  {
    id: "notification",
    name: "Notification",
    description: "System notifications with different types and actions",
    category: "feedback",
    icon: Bell,
    component: NotificationDemo,
  },
  {
    id: "toast",
    name: "Toast",
    description: "Temporary notification messages that auto-dismiss",
    category: "feedback",
    icon: MessageSquare,
    component: ToastDemo,
  },
  {
    id: "scroll-area",
    name: "Scroll Area",
    description: "Custom styled scrollable container",
    category: "feedback",
    icon: ArrowUpDown,
    component: ScrollAreaDemo,
  },

  // Additional Components (Placeholder for future implementation)
  {
    id: "account-management",
    name: "Account Management",
    description: "Components for managing user accounts and groups",
    category: "accounts",
    icon: FolderOpen,
    component: () => (
      <AccountManagementDemo 
      
      />
    ),
  },

  // Authentication Components
  {
    id: "auth-components",
    name: "Authentication",
    description: "Authentication forms and guards",
    category: "auth",
    icon: Shield,
    component: () => (
      <PlaceholderDemo 
        title="Authentication Components" 
        description="Login forms, signup forms, and route protection components"
      />
    ),
  },

  // Business Components
  {
    id: "business-components",
    name: "Business Components",
    description: "Business-specific UI components and pages",
    category: "business",
    icon: Clock,
    component: () => (
      <PlaceholderDemo 
        title="Business Components" 
        description="Coming soon pages, waitlist forms, and other business components"
      />
    ),
  },
  {
    id: "pricing-table",
    name: "Pricing Table",
    description: "Professional pricing table with billing toggle",
    category: "business",
    icon: BarChart3,
    component: PricingTableDemo,
  },
]

export function ComponentBrowser() {
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>("basics")
  const [selectedComponent, setSelectedComponent] = React.useState<string | null>("button")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [expandedCategories, setExpandedCategories] = React.useState<Set<string>>(new Set(["basics"]))

  const filteredComponents = COMPONENTS.filter(component => {
    const matchesSearch = component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         component.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || component.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const selectedComponentData = COMPONENTS.find(c => c.id === selectedComponent)
  const ComponentDemo = selectedComponentData?.component

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  const getComponentsByCategory = (categoryId: string) => {
    return COMPONENTS.filter(c => c.category === categoryId)
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-80 border-r bg-muted/20 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold mb-4">Component Browser</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {searchQuery ? (
              // Search Results
              <div className="space-y-1">
                {filteredComponents.map((component) => (
                  <Button
                    key={component.id}
                    variant={selectedComponent === component.id ? "secondary" : "ghost"}
                    className="w-full justify-start h-auto p-3"
                    onClick={() => setSelectedComponent(component.id)}
                  >
                    <component.icon className="h-4 w-4 mr-3 flex-shrink-0" />
                    <div className="text-left flex-1 min-w-0">
                      <div className="font-medium truncate">{component.name}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {component.description}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            ) : (
              // Categories
              <div className="space-y-1">
                {COMPONENT_CATEGORIES.map((category) => {
                  const categoryComponents = getComponentsByCategory(category.id)
                  const isExpanded = expandedCategories.has(category.id)
                  
                  return (
                    <div key={category.id}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start p-3 h-auto"
                        onClick={() => toggleCategory(category.id)}
                      >
                        <category.icon className="h-4 w-4 mr-3" />
                        <span className="flex-1 text-left font-medium">{category.name}</span>
                        <Badge variant="secondary" className="mr-2">
                          {category.count}
                        </Badge>
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                      
                      {isExpanded && (
                        <div className="ml-6 space-y-1 mt-1">
                          {categoryComponents.map((component) => (
                            <Button
                              key={component.id}
                              variant={selectedComponent === component.id ? "secondary" : "ghost"}
                              size="sm"
                              className="w-full justify-start p-2"
                              onClick={() => setSelectedComponent(component.id)}
                            >
                              <component.icon className="h-3 w-3 mr-2" />
                              <span className="text-sm">{component.name}</span>
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {selectedComponentData ? (
          <>
            {/* Header */}
            <div className="p-6 border-b bg-muted/10">
              <div className="flex items-center gap-3 mb-2">
                <selectedComponentData.icon className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">{selectedComponentData.name}</h2>
                <Badge variant="outline">
                  {COMPONENT_CATEGORIES.find(c => c.id === selectedComponentData.category)?.name}
                </Badge>
              </div>
              <p className="text-muted-foreground text-lg">
                {selectedComponentData.description}
              </p>
            </div>

            {/* Component Demo */}
            <div className="flex-1 overflow-auto">
              <div className="p-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Component className="h-5 w-5" />
                      Live Demo
                    </CardTitle>
                    <CardDescription>
                      Interactive demonstration of the {selectedComponentData.name} component
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    {ComponentDemo && <ComponentDemo />}
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center">
            <div className="space-y-4">
              <Palette className="h-12 w-12 text-muted-foreground mx-auto" />
              <div>
                <h3 className="text-lg font-medium">Select a Component</h3>
                <p className="text-muted-foreground">
                  Choose a component from the sidebar to see its demo
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}