"use client"

import * as React from "react"
import {
  Home,
  Wallet,
  Search as SearchIcon,
  Settings,
  Bell,
  User,
  Calculator,
  Calendar as CalendarIcon,
  Upload,
  Download,
  Star,
  Heart,
  Bookmark,
  Share,
  Copy,
  ExternalLink,
  Trash2,
  Edit,
  Plus,
  Minus,
  X,
  Check,
  ChevronRight,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  TrendingUp,
  Activity,
  BarChart3,
  PieChart,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Mail,
  Phone,
  MapPin,
  Clock,
  Zap,
  Shield,
  Lock,
  Eye,
  EyeOff,
  Filter,
  Grid3x3,
  List,
  MoreHorizontal,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
  Code,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Container } from "@/components/ui/container"
import { Section } from "@/components/ui/section"
import { Grid, GridItem } from "@/components/ui/grid"
import { Switch } from "@/components/ui/switch"

// New macOS Components
import { Dock, FloatingDock, MiniDock, useDock } from "@/components/ui/dock"
import { WalletHeader, CompactWalletHeader } from "@/components/ui/wallet-header"
import {
  WindowControls,
  MacOSWindow,
  FinderSidebar,
  FinderToolbar,
  FileItem,
  FinderWindow,
} from "@/components/ui/macos-blocks"

// Advanced Components
import { DatePicker, DateRangePicker } from "@/components/ui/date-picker"
import { MultiSelect, useMultiSelect } from "@/components/ui/multi-select"
import { Combobox, useCombobox } from "@/components/ui/combobox"
import { NumberInput, useNumberInput } from "@/components/ui/number-input"
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter, useModal } from "@/components/ui/modal"
import { LoadingSpinner, LoadingOverlay, LoadingSkeleton } from "@/components/ui/loading-spinner"
import { PricingTable, PricingBillingToggle, usePricing } from "@/components/ui/pricing-table"
import { Pagination, PaginationInfo } from "@/components/ui/pagination"

export function OrganizedShowcase() {
  const [showBalance, setShowBalance] = React.useState(true)
  const [selectedDate, setSelectedDate] = React.useState<Date>()
  const [dateRange, setDateRange] = React.useState<{ from?: Date; to?: Date }>({})
  const [isLoading, setIsLoading] = React.useState(false)
  const [showFinder, setShowFinder] = React.useState(false)

  // Component state
  const multiSelect = useMultiSelect(["react", "nextjs"])
  const combobox = useCombobox("nextjs")
  const numberInput = useNumberInput(100)
  const modal = useModal()
  const pricing = usePricing("monthly")

  // Sample wallet data
  const sampleWallet = {
    id: "1",
    name: "Main Wallet",
    address: "0x742d35Cc6634C0532925a3b8D22adb63bb6E7A7e",
    balance: 12.5,
    balanceUsd: 25000,
    change24h: 1250.75,
    change24hPercent: 5.25,
    network: "Ethereum",
    avatar: "",
    isWatching: true,
    lastUpdated: new Date(),
  }

  // Dock items
  const dock = useDock([
    { id: "home", label: "Home", icon: <Home className="h-5 w-5" />, onClick: () => console.log("Home") },
    { id: "wallet", label: "Wallet", icon: <Wallet className="h-5 w-5" />, badge: 3, onClick: () => console.log("Wallet") },
    { id: "search", label: "Search", icon: <SearchIcon className="h-5 w-5" />, onClick: () => console.log("Search") },
    { id: "settings", label: "Settings", icon: <Settings className="h-5 w-5" />, onClick: () => console.log("Settings") },
    { id: "notifications", label: "Notifications", icon: <Bell className="h-5 w-5" />, badge: 5, onClick: () => console.log("Notifications") },
    { id: "profile", label: "Profile", icon: <User className="h-5 w-5" />, onClick: () => console.log("Profile") },
  ])

  const multiSelectOptions = [
    { label: "React", value: "react" },
    { label: "Next.js", value: "nextjs" },
    { label: "TypeScript", value: "typescript" },
    { label: "Tailwind CSS", value: "tailwind" },
    { label: "Framer Motion", value: "framer" },
  ]

  const comboboxOptions = [
    { label: "React", value: "react" },
    { label: "Next.js", value: "nextjs" },
    { label: "Vue.js", value: "vuejs" },
    { label: "Angular", value: "angular" },
    { label: "Svelte", value: "svelte" },
  ]

  const pricingPlans = [
    {
      id: "free",
      name: "Free",
      description: "Perfect for getting started",
      price: { monthly: 0, yearly: 0 },
      features: [
        { name: "Up to 3 wallets", included: true },
        { name: "Basic analytics", included: true },
        { name: "Email support", included: true },
        { name: "Advanced features", included: false },
        { name: "Priority support", included: false },
      ],
      buttonText: "Get Started",
      buttonVariant: "outline" as const,
    },
    {
      id: "pro",
      name: "Pro",
      description: "Best for active traders",
      price: { monthly: 29, yearly: 290 },
      features: [
        { name: "Unlimited wallets", included: true },
        { name: "Advanced analytics", included: true },
        { name: "Priority support", included: true },
        { name: "DeFi tracking", included: true },
        { name: "API access", included: false },
      ],
      highlighted: true,
      popular: true,
      buttonText: "Start Free Trial",
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "For institutions",
      price: { monthly: 99, yearly: 990 },
      features: [
        { name: "Everything in Pro", included: true },
        { name: "Custom integrations", included: true },
        { name: "Dedicated support", included: true },
        { name: "API access", included: true },
        { name: "White-label option", included: true },
      ],
      buttonText: "Contact Sales",
      buttonVariant: "outline" as const,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
      <Container size="full" className="py-8">
        <div className="space-y-12">
          {/* Hero Header */}
          <Section className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 text-sm font-medium mb-6">
              <Zap className="h-4 w-4 text-yellow-500" />
              macOS-Inspired Design System
            </div>
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
              MoneyMappr UI
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
              A comprehensive, production-ready component library featuring advanced forms, 
              macOS-inspired interfaces, crypto wallet components, and modern business tools.
            </p>
            <div className="flex items-center justify-center gap-4 mb-8">
              <Badge variant="secondary" className="text-sm px-4 py-2">
                <Activity className="h-3 w-3 mr-1" />
                130+ Components
              </Badge>
              <Badge variant="secondary" className="text-sm px-4 py-2">
                <Shield className="h-3 w-3 mr-1" />
                Accessible
              </Badge>
              <Badge variant="secondary" className="text-sm px-4 py-2">
                <Zap className="h-3 w-3 mr-1" />
                TypeScript
              </Badge>
            </div>
          </Section>

          <Tabs defaultValue="macos" className="space-y-8">
            <div className="flex justify-center">
              <TabsList className="grid w-full max-w-4xl grid-cols-6 h-12">
                <TabsTrigger value="macos" className="flex items-center gap-2">
                  <Monitor className="h-4 w-4" />
                  macOS
                </TabsTrigger>
                <TabsTrigger value="wallet" className="flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  Wallet
                </TabsTrigger>
                <TabsTrigger value="forms" className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Forms
                </TabsTrigger>
                <TabsTrigger value="business" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Business
                </TabsTrigger>
                <TabsTrigger value="feedback" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Feedback
                </TabsTrigger>
                <TabsTrigger value="navigation" className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4" />
                  Navigation
                </TabsTrigger>
              </TabsList>
            </div>

            {/* macOS Components Tab */}
            <TabsContent value="macos" className="space-y-8">
              <Section>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">macOS-Inspired Components</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Native macOS look and feel with modern web technologies
                  </p>
                </div>

                <Grid cols={1} gap={8}>
                  {/* Dock Showcase */}
                  <Card className="overflow-hidden">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Grid3x3 className="h-5 w-5" />
                        Interactive Dock
                      </CardTitle>
                      <CardDescription>
                        macOS-style dock with magnification effects and tooltips
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="relative bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-lg p-12 min-h-[200px] flex items-center justify-center">
                        <Dock
                          items={dock.items}
                          position="bottom"
                          size="md"
                          magnification={true}
                          blur={true}
                          className="relative"
                          onItemClick={(item) => console.log("Clicked:", item.label)}
                        />
                      </div>
                      
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <p className="text-sm font-medium mb-2">Mini Dock</p>
                          <MiniDock items={dock.items.slice(0, 4)} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium mb-2">Vertical Dock</p>
                          <div className="flex justify-center">
                            <Dock
                              items={dock.items.slice(0, 4)}
                              orientation="vertical"
                              position="left"
                              size="sm"
                              className="relative"
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Window Controls & Finder */}
                  <Grid cols={2} gap={6}>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <X className="h-5 w-5" />
                          Window Controls
                        </CardTitle>
                        <CardDescription>macOS traffic light controls</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-medium mb-2">Standard Controls</p>
                            <div className="p-4 border rounded-lg">
                              <WindowControls
                                onClose={() => console.log("Close")}
                                onMinimize={() => console.log("Minimize")}
                                onMaximize={() => console.log("Maximize")}
                              />
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium mb-2">Minimal Controls</p>
                            <div className="p-4 border rounded-lg">
                              <WindowControls
                                variant="minimal"
                                onClose={() => console.log("Close")}
                                onMinimize={() => console.log("Minimize")}
                                onMaximize={() => console.log("Maximize")}
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Monitor className="h-5 w-5" />
                          Finder Window
                        </CardTitle>
                        <CardDescription>Complete macOS Finder interface</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button onClick={() => setShowFinder(true)} className="w-full">
                          Open Finder Window
                        </Button>
                        {showFinder && (
                          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                            <FinderWindow onClose={() => setShowFinder(false)} />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Section>
            </TabsContent>

            {/* Wallet Components Tab */}
            <TabsContent value="wallet" className="space-y-8">
              <Section>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">Crypto Wallet Components</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Professional wallet interfaces with real-time data and interactive features
                  </p>
                </div>

                <Grid cols={1} gap={6}>
                  <Card className="overflow-hidden">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Wallet className="h-5 w-5" />
                        Wallet Header - Full Featured
                      </CardTitle>
                      <CardDescription>
                        Complete wallet interface with balance, charts, and controls
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <WalletHeader
                        wallet={sampleWallet}
                        showBalance={showBalance}
                        onToggleBalance={() => setShowBalance(!showBalance)}
                        onRefresh={() => console.log("Refresh")}
                        onSettings={() => console.log("Settings")}
                        onCopyAddress={() => console.log("Copy address")}
                        onViewExplorer={() => console.log("View explorer")}
                      />
                    </CardContent>
                  </Card>

                  <Grid cols={2} gap={6}>
                    <Card>
                      <CardHeader>
                        <CardTitle>Compact Wallet Header</CardTitle>
                        <CardDescription>Condensed version for lists and cards</CardDescription>
                      </CardHeader>
                      <CardContent className="p-0">
                        <CompactWalletHeader
                          wallet={sampleWallet}
                          showBalance={showBalance}
                          onToggleBalance={() => setShowBalance(!showBalance)}
                        />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Balance Controls</CardTitle>
                        <CardDescription>Privacy and visibility controls</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Show Balance</span>
                          <Switch
                            checked={showBalance}
                            onCheckedChange={setShowBalance}
                          />
                        </div>
                        <div className="p-4 rounded-lg bg-muted/50">
                          <div className="text-2xl font-bold">
                            {showBalance ? "$25,000.00" : "••••••••"}
                          </div>
                          <div className="text-sm text-green-600 flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            {showBalance ? "+5.25%" : "••••"}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Section>
            </TabsContent>

            {/* Advanced Forms Tab */}
            <TabsContent value="forms" className="space-y-8">
              <Section>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">Advanced Form Components</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Professional form controls with validation and modern UX
                  </p>
                </div>

                <Grid cols={2} gap={6}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CalendarIcon className="h-5 w-5" />
                        Date Pickers
                      </CardTitle>
                      <CardDescription>Single date and range selection</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Single Date</label>
                        <DatePicker
                          date={selectedDate}
                          onSelect={setSelectedDate}
                          placeholder="Select date"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Date Range</label>
                        <DateRangePicker
                          from={dateRange.from}
                          to={dateRange.to}
                          onSelect={setDateRange}
                          placeholder="Select date range"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Advanced Selectors
                      </CardTitle>
                      <CardDescription>Multi-select and searchable options</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Multi-Select</label>
                        <MultiSelect
                          options={multiSelectOptions}
                          selected={multiSelect.selected}
                          onChange={multiSelect.onChange}
                          placeholder="Select technologies..."
                          maxItems={3}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Combobox</label>
                        <Combobox
                          options={comboboxOptions}
                          value={combobox.value}
                          onSelect={combobox.onSelect}
                          placeholder="Choose framework..."
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calculator className="h-5 w-5" />
                        Number Input Variants
                      </CardTitle>
                      <CardDescription>Advanced number inputs with controls and formatting</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Grid cols={3} gap={4}>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Basic Number</label>
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
                          <label className="text-sm font-medium mb-2 block">Currency</label>
                          <NumberInput
                            value={numberInput.value}
                            onChange={numberInput.onChange}
                            prefix="$"
                            suffix=" USD"
                            precision={2}
                          />
                        </div>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Section>
            </TabsContent>

            {/* Business Components Tab */}
            <TabsContent value="business" className="space-y-8">
              <Section>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">Business Components</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Professional pricing tables and business-focused UI elements
                  </p>
                </div>

                <Card>
                  <CardHeader className="text-center">
                    <CardTitle>Professional Pricing Table</CardTitle>
                    <CardDescription>
                      Responsive pricing with billing toggle and feature comparison
                    </CardDescription>
                    <div className="flex justify-center pt-4">
                      <PricingBillingToggle
                        billingCycle={pricing.billingCycle}
                        onToggle={pricing.setBillingCycle}
                        yearlyDiscount="Save 17%"
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <PricingTable
                      plans={pricingPlans}
                      billingCycle={pricing.billingCycle}
                      onSelectPlan={(planId) => console.log("Selected plan:", planId)}
                    />
                  </CardContent>
                </Card>
              </Section>
            </TabsContent>

            {/* Feedback Components Tab */}
            <TabsContent value="feedback" className="space-y-8">
              <Section>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">Feedback & Loading States</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Loading indicators, overlays, and user feedback components
                  </p>
                </div>

                <Grid cols={2} gap={6}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Loading Components</CardTitle>
                      <CardDescription>Various loading states and animations</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium mb-2">Spinner Variants</p>
                          <div className="flex items-center gap-4">
                            <LoadingSpinner size="sm" />
                            <LoadingSpinner variant="dots" />
                            <LoadingSpinner variant="pulse" size="lg" />
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-2">Skeleton Loading</p>
                          <LoadingSkeleton lines={3} />
                        </div>
                      </div>
                      <Button
                        onClick={() => {
                          setIsLoading(true)
                          setTimeout(() => setIsLoading(false), 2000)
                        }}
                        disabled={isLoading}
                      >
                        {isLoading ? <LoadingSpinner size="sm" /> : "Test Loading"}
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="relative">
                    <CardHeader>
                      <CardTitle>Modal & Overlays</CardTitle>
                      <CardDescription>Accessible modals and loading overlays</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button onClick={modal.openModal} className="w-full">
                        Open Modal
                      </Button>
                      <div className="p-4 bg-muted rounded relative min-h-[100px] flex items-center justify-center">
                        <span>Content with overlay</span>
                        <LoadingOverlay
                          isVisible={isLoading}
                          text="Loading data..."
                          variant="dots"
                        />
                      </div>
                    </CardContent>

                    <Modal
                      open={modal.open}
                      onClose={modal.closeModal}
                      size="md"
                    >
                      <ModalHeader>
                        <ModalTitle>Example Modal</ModalTitle>
                      </ModalHeader>
                      <ModalBody>
                        <p>This modal demonstrates proper accessibility and keyboard navigation.</p>
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
                  </Card>
                </Grid>
              </Section>
            </TabsContent>

            {/* Navigation Components Tab */}
            <TabsContent value="navigation" className="space-y-8">
              <Section>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">Navigation Components</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Breadcrumbs, pagination, and navigation utilities
                  </p>
                </div>

                <Grid cols={1} gap={6}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Pagination System</CardTitle>
                      <CardDescription>Complete pagination with info and controls</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <PaginationInfo
                        currentPage={1}
                        totalPages={10}
                        totalItems={100}
                        itemsPerPage={10}
                      />
                      <Pagination
                        currentPage={1}
                        totalPages={10}
                        onPageChange={(page) => console.log("Go to page:", page)}
                        showFirstLast
                        size="default"
                      />
                    </CardContent>
                  </Card>
                </Grid>
              </Section>
            </TabsContent>
          </Tabs>

          {/* Footer */}
          <Section className="text-center border-t pt-12">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Ready to build amazing interfaces?</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                This comprehensive component library provides everything you need to create modern,
                accessible, and beautiful user interfaces for financial applications.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Badge variant="outline" className="text-sm px-4 py-2">
                  <Code className="h-3 w-3 mr-1" />
                  Open Source
                </Badge>
                <Badge variant="outline" className="text-sm px-4 py-2">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Production Ready
                </Badge>
                <Badge variant="outline" className="text-sm px-4 py-2">
                  <Globe className="h-3 w-3 mr-1" />
                  TypeScript
                </Badge>
              </div>
            </div>
          </Section>
        </div>
      </Container>
    </div>
  )
}