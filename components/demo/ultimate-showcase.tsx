"use client"

import * as React from "react"
import {
  Search as SearchIcon,
  Command,
  Upload,
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  Bell,
  Settings,
  Home,
  Star,
  Shield,
  Zap,
  Crown,
  Mail,
  Phone,
  Calendar,
  Clock,
  FileText,
  Download,
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  X,
  Filter,
  Globe,
  Building,
  Briefcase,
  CreditCard,
  Target,
  Rocket,
  Heart,
  Bookmark,
  Share,
  Copy,
} from "lucide-react"

// Layout & Structure
import { Container } from "@/components/ui/container"
import { Section } from "@/components/ui/section" 
import { Grid, GridItem } from "@/components/ui/grid"
import { HStack, VStack, Center, Spacer } from "@/components/ui/stack"

// Base Components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"

// Advanced Components
import { CommandPalette, useCommandPalette } from "@/components/ui/command-palette"
import { FileUpload } from "@/components/ui/file-upload"
import { AdvancedChart } from "@/components/ui/advanced-chart"
import { ComparisonTable, saasPricingPlans, saasPricingFeatures } from "@/components/ui/comparison-table"
import { Testimonials, sampleTestimonials } from "@/components/ui/testimonials"
import { Search as SearchComponent, QuickSearch } from "@/components/ui/search"
import { Pagination, PaginationInfo, usePagination } from "@/components/ui/pagination"

// Animations
import { 
  Animate, 
  Stagger, 
  InViewAnimate, 
  Hover, 
  Click, 
  Entrance,
  useAnimation 
} from "@/components/ui/animate"

// Sample Data
const chartData = [
  { label: "Jan", value: 1200, color: "#3b82f6" },
  { label: "Feb", value: 1900, color: "#10b981" },
  { label: "Mar", value: 800, color: "#f59e0b" },
  { label: "Apr", value: 1500, color: "#ef4444" },
  { label: "May", value: 2000, color: "#8b5cf6" },
  { label: "Jun", value: 1700, color: "#06b6d4" },
]

const pieChartData = [
  { label: "Bitcoin", value: 45, color: "#f7931a" },
  { label: "Ethereum", value: 30, color: "#627eea" },
  { label: "Solana", value: 15, color: "#9945ff" },
  { label: "Others", value: 10, color: "#64748b" },
]

const gaugeData = [{ label: "Portfolio Health", value: 78 }]

// Toast Component (inline for this showcase)
const Toast = ({ 
  toast, 
  onDismiss 
}: { 
  toast: { 
    id: string
    title?: string
    description?: string
    variant?: "default" | "success" | "error" | "warning" | "info"
  }
  onDismiss: () => void 
}) => {
  const toastIcons = {
    default: <Info className="size-5" />,
    success: <CheckCircle className="size-5" />,
    error: <AlertCircle className="size-5" />,
    warning: <AlertTriangle className="size-5" />,
    info: <Info className="size-5" />,
  }

  const toastStyles = {
    default: "border-border bg-background text-foreground",
    success: "border-green-200 bg-green-50 text-green-800",
    error: "border-red-200 bg-red-50 text-red-800", 
    warning: "border-yellow-200 bg-yellow-50 text-yellow-800",
    info: "border-blue-200 bg-blue-50 text-blue-800",
  }

  return (
    <div className={`pointer-events-auto relative flex w-full items-center space-x-4 overflow-hidden rounded-md border p-4 shadow-lg transition-all mb-2 ${toastStyles[toast.variant || 'default']}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {toastIcons[toast.variant || 'default']}
        </div>
        <div className="flex-1">
          {toast.title && <div className="text-sm font-semibold">{toast.title}</div>}
          {toast.description && <div className="text-sm mt-1 opacity-90">{toast.description}</div>}
        </div>
      </div>
      <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={onDismiss}>
        <X className="h-3 w-3" />
      </Button>
    </div>
  )
}

export function UltimateShowcase() {
  const animation = useAnimation()
  const commandPalette = useCommandPalette()
  const [toasts, setToasts] = React.useState<any[]>([])
  const [activeTab, setActiveTab] = React.useState("overview")
  
  const pagination = usePagination({
    totalItems: 1000,
    itemsPerPage: 50,
  })

  const addToast = (toast: any) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = { ...toast, id }
    setToasts(prev => [...prev, newToast])
    setTimeout(() => removeToast(id), 5000)
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const handleFileUpload = async (files: File[]) => {
    addToast({
      title: "Upload Started",
      description: `Uploading ${files.length} file${files.length > 1 ? 's' : ''}...`,
      variant: "info"
    })
    
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    addToast({
      title: "Upload Complete",
      description: "All files uploaded successfully!",
      variant: "success"
    })
  }

  const demoSearchItems = [
    { id: "1", title: "Bitcoin Wallet", description: "Main BTC holding wallet" },
    { id: "2", title: "Ethereum DeFi", description: "Staking and DeFi positions" },
    { id: "3", title: "Trading Account", description: "Active trading portfolio" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col w-full md:max-w-[420px]">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            toast={toast}
            onDismiss={() => removeToast(toast.id)}
          />
        ))}
      </div>

      <Container size="full" className="py-12">
        <div className="space-y-16">
          {/* Hero Section */}
          <Entrance type="hero">
            <div className="text-center space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="text-sm px-4 py-2">
                  Ultimate Component Library v4.0.0
                </Badge>
                <h1 className="text-6xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                  Next-Generation Design System
                </h1>
                <p className="text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                  The most comprehensive React component library for modern SaaS applications.
                  Built with TypeScript, Tailwind CSS, and accessibility-first design principles.
                </p>
              </div>
              
              <HStack justify="center" gap={4} className="flex-wrap">
                <Button size="lg" className="gap-2" onClick={() => commandPalette.toggle()}>
                  <Command className="size-5" />
                  Open Command Palette
                  <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-2">
                    ⌘K
                  </kbd>
                </Button>
                <Button variant="outline" size="lg" className="gap-2">
                  <Download className="size-5" />
                  Download Components
                </Button>
                <Button variant="ghost" size="lg" className="gap-2">
                  <Star className="size-5" />
                  Star on GitHub
                </Button>
              </HStack>

              {/* Feature Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-12">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-lg mb-3">
                    <Shield className="size-6" />
                  </div>
                  <h3 className="font-semibold">Fully Accessible</h3>
                  <p className="text-sm text-muted-foreground mt-1">WCAG 2.1 AA compliant with full keyboard navigation</p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-lg mb-3">
                    <Zap className="size-6" />
                  </div>
                  <h3 className="font-semibold">High Performance</h3>
                  <p className="text-sm text-muted-foreground mt-1">Optimized for speed with tree-shaking support</p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 text-purple-600 rounded-lg mb-3">
                    <Crown className="size-6" />
                  </div>
                  <h3 className="font-semibold">Premium Quality</h3>
                  <p className="text-sm text-muted-foreground mt-1">Production-ready components used by top companies</p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 text-orange-600 rounded-lg mb-3">
                    <Rocket className="size-6" />
                  </div>
                  <h3 className="font-semibold">Developer Experience</h3>
                  <p className="text-sm text-muted-foreground mt-1">Full TypeScript support with excellent IntelliSense</p>
                </div>
              </div>
            </div>
          </Entrance>

          <Separator />

          {/* Main Showcase */}
          <Tabs defaultValue="foundations" className="space-y-12">
            <div className="flex justify-center">
              <TabsList className="grid w-full max-w-4xl grid-cols-3 lg:grid-cols-7">
                <TabsTrigger value="foundations">Foundations</TabsTrigger>
                <TabsTrigger value="inputs">Inputs & Forms</TabsTrigger>
                <TabsTrigger value="navigation">Navigation</TabsTrigger>
                <TabsTrigger value="feedback">Feedback</TabsTrigger>
                <TabsTrigger value="business">Business</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
                <TabsTrigger value="showcase">Showcase</TabsTrigger>
              </TabsList>
            </div>

            {/* Foundations */}
            <TabsContent value="foundations" className="space-y-12">
              <Section title="Foundation Components" description="Essential building blocks for any application">
                <div className="space-y-12">
                  {/* Typography & Colors */}
                  <div>
                    <h3 className="text-2xl font-bold mb-6">Typography & Colors</h3>
                    <Grid cols={3} gap={6}>
                      <Card>
                        <CardHeader>
                          <CardTitle>Typography Scale</CardTitle>
                          <CardDescription>Consistent text sizing</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="text-4xl font-bold">Heading 1</div>
                          <div className="text-3xl font-semibold">Heading 2</div>
                          <div className="text-2xl font-medium">Heading 3</div>
                          <div className="text-xl">Heading 4</div>
                          <div className="text-lg">Large Text</div>
                          <div className="text-base">Body Text</div>
                          <div className="text-sm text-muted-foreground">Small Text</div>
                          <div className="text-xs text-muted-foreground">Caption Text</div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Color Palette</CardTitle>
                          <CardDescription>Semantic color system</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary"></div>
                            <span className="text-sm">Primary</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-secondary"></div>
                            <span className="text-sm">Secondary</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-destructive"></div>
                            <span className="text-sm">Destructive</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-green-500"></div>
                            <span className="text-sm">Success</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-yellow-500"></div>
                            <span className="text-sm">Warning</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-muted"></div>
                            <span className="text-sm">Muted</span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Spacing System</CardTitle>
                          <CardDescription>Consistent spacing scale</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {[1, 2, 4, 6, 8, 12, 16, 24].map(space => (
                            <div key={space} className="flex items-center gap-4">
                              <div 
                                className="bg-primary h-4 rounded"
                                style={{ width: `${space * 4}px` }}
                              />
                              <span className="text-sm font-mono">{space} ({space * 4}px)</span>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </Grid>
                  </div>

                  {/* Buttons & Interactive Elements */}
                  <div>
                    <h3 className="text-2xl font-bold mb-6">Buttons & Interactive Elements</h3>
                    <Grid cols={2} gap={8}>
                      <Card>
                        <CardHeader>
                          <CardTitle>Button Variants</CardTitle>
                          <CardDescription>All button styles and states</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="space-y-3">
                            <h4 className="font-medium">Primary Buttons</h4>
                            <HStack gap={3} wrap>
                              <Button size="sm">Small</Button>
                              <Button>Default</Button>
                              <Button size="lg">Large</Button>
                              <Button disabled>Disabled</Button>
                            </HStack>
                          </div>
                          
                          <div className="space-y-3">
                            <h4 className="font-medium">Variants</h4>
                            <VStack gap={3}>
                              <HStack gap={3} wrap>
                                <Button variant="default">Default</Button>
                                <Button variant="secondary">Secondary</Button>
                                <Button variant="outline">Outline</Button>
                                <Button variant="ghost">Ghost</Button>
                              </HStack>
                              <HStack gap={3} wrap>
                                <Button variant="destructive">Destructive</Button>
                                <Button variant="success">Success</Button>
                                <Button variant="warning">Warning</Button>
                              </HStack>
                            </VStack>
                          </div>

                          <div className="space-y-3">
                            <h4 className="font-medium">With Icons</h4>
                            <HStack gap={3} wrap>
                              <Button><Mail className="size-4 mr-2" />Email</Button>
                              <Button variant="outline"><Phone className="size-4 mr-2" />Call</Button>
                              <Button variant="ghost"><Share className="size-4 mr-2" />Share</Button>
                            </HStack>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Interactive States</CardTitle>
                          <CardDescription>Hover, focus, and active states</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="space-y-3">
                            <h4 className="font-medium">Hover Effects</h4>
                            <HStack gap={4}>
                              <Hover effect="lift">
                                <div className="bg-muted p-4 rounded-lg cursor-pointer text-center">
                                  Lift on Hover
                                </div>
                              </Hover>
                              <Hover effect="scale">
                                <div className="bg-accent p-4 rounded-lg cursor-pointer text-center">
                                  Scale on Hover
                                </div>
                              </Hover>
                            </HStack>
                          </div>

                          <div className="space-y-3">
                            <h4 className="font-medium">Click Effects</h4>
                            <HStack gap={4}>
                              <Click effect="ripple">
                                <Button variant="outline" className="w-32">
                                  Click Ripple
                                </Button>
                              </Click>
                              <Click effect="bounce">
                                <Button variant="secondary" className="w-32">
                                  Click Bounce
                                </Button>
                              </Click>
                            </HStack>
                          </div>

                          <div className="space-y-3">
                            <h4 className="font-medium">Switches & Toggles</h4>
                            <VStack gap={4}>
                              <HStack justify="between" className="w-full">
                                <span className="text-sm">Enable notifications</span>
                                <Switch />
                              </HStack>
                              <HStack justify="between" className="w-full">
                                <span className="text-sm">Dark mode</span>
                                <Switch />
                              </HStack>
                              <HStack justify="between" className="w-full">
                                <span className="text-sm">Auto-save</span>
                                <Switch defaultChecked />
                              </HStack>
                            </VStack>
                          </div>
                        </CardContent>
                      </Card>
                    </Grid>
                  </div>

                  {/* Layout Components */}
                  <div>
                    <h3 className="text-2xl font-bold mb-6">Layout & Structure</h3>
                    <Grid cols={2} gap={8}>
                      <Card>
                        <CardHeader>
                          <CardTitle>Grid System</CardTitle>
                          <CardDescription>Responsive grid layouts</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <Grid cols={4} gap={2}>
                              {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="bg-primary/20 p-3 rounded text-center text-xs">
                                  {i + 1}
                                </div>
                              ))}
                            </Grid>
                            
                            <Grid cols={3} gap={4}>
                              {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="bg-secondary/30 p-4 rounded text-center text-sm">
                                  Item {i + 1}
                                </div>
                              ))}
                            </Grid>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Stack Layouts</CardTitle>
                          <CardDescription>Flexible stack containers</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div>
                            <h4 className="font-medium mb-3">Horizontal Stack</h4>
                            <HStack gap={3} justify="between" className="bg-muted/50 p-4 rounded">
                              <div className="bg-primary/20 px-3 py-2 rounded text-xs">Left</div>
                              <div className="bg-primary/20 px-3 py-2 rounded text-xs">Center</div>
                              <div className="bg-primary/20 px-3 py-2 rounded text-xs">Right</div>
                            </HStack>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-3">Vertical Stack</h4>
                            <VStack gap={3} className="bg-muted/50 p-4 rounded">
                              <div className="bg-secondary/30 px-3 py-2 rounded text-xs text-center w-full">Top</div>
                              <div className="bg-secondary/30 px-3 py-2 rounded text-xs text-center w-full">Middle</div>
                              <div className="bg-secondary/30 px-3 py-2 rounded text-xs text-center w-full">Bottom</div>
                            </VStack>
                          </div>
                        </CardContent>
                      </Card>
                    </Grid>
                  </div>
                </div>
              </Section>
            </TabsContent>

            {/* Inputs & Forms */}
            <TabsContent value="inputs" className="space-y-12">
              <Section title="Input & Form Components" description="Comprehensive form controls and validation">
                <Grid cols={2} gap={8}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Form Inputs</CardTitle>
                      <CardDescription>Various input types and states</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Default Input</label>
                        <Input placeholder="Enter your name" />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email Input</label>
                        <Input type="email" placeholder="john@example.com" leftIcon={<Mail className="size-4" />} />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Password Input</label>
                        <Input type="password" placeholder="Enter password" />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Phone Input</label>
                        <Input type="tel" placeholder="+1 (555) 000-0000" leftIcon={<Phone className="size-4" />} />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Search Input</label>
                        <Input type="search" placeholder="Search..." leftIcon={<SearchIcon className="size-4" />} />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Advanced Search</CardTitle>
                      <CardDescription>Powerful search with filters</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <SearchComponent
                        placeholder="Search transactions, wallets, users..."
                        filters={[
                          {
                            id: "type",
                            label: "Type",
                            type: "select",
                            options: [
                              { label: "All", value: "" },
                              { label: "Transaction", value: "transaction" },
                              { label: "Wallet", value: "wallet" },
                              { label: "User", value: "user" },
                            ],
                          },
                          {
                            id: "status",
                            label: "Status",
                            type: "select",
                            options: [
                              { label: "All", value: "" },
                              { label: "Active", value: "active" },
                              { label: "Pending", value: "pending" },
                              { label: "Completed", value: "completed" },
                            ],
                          },
                        ]}
                        sortOptions={[
                          { field: "date", label: "Date" },
                          { field: "amount", label: "Amount" },
                          { field: "name", label: "Name" },
                        ]}
                        results={247}
                        onSearch={(state) => console.log("Search:", state)}
                      />
                      
                      <div>
                        <h4 className="font-medium mb-3">Quick Search</h4>
                        <QuickSearch
                          placeholder="Quick search..."
                          onSearch={(query) => console.log("Quick search:", query)}
                          results={demoSearchItems}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
              </Section>
            </TabsContent>

            {/* Navigation */}
            <TabsContent value="navigation" className="space-y-12">
              <Section title="Navigation Components" description="Navigation patterns and user guidance">
                <div className="space-y-8">
                  <Grid cols={2} gap={8}>
                    <Card>
                      <CardHeader>
                        <CardTitle>Command Palette</CardTitle>
                        <CardDescription>Keyboard-driven navigation</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Button onClick={() => commandPalette.toggle()} className="w-full">
                          <Command className="size-4 mr-2" />
                          Open Command Palette (⌘K)
                        </Button>
                        
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <p>Features:</p>
                          <ul className="list-disc list-inside space-y-1">
                            <li>Fuzzy search across all pages</li>
                            <li>Keyboard navigation</li>
                            <li>Categorized results</li>
                            <li>Custom actions and shortcuts</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Pagination</CardTitle>
                        <CardDescription>Navigate through large datasets</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <PaginationInfo
                          currentPage={pagination.currentPage}
                          totalPages={pagination.totalPages}
                          totalItems={1000}
                          itemsPerPage={50}
                        />
                        
                        <Pagination
                          totalPages={pagination.totalPages}
                          currentPage={pagination.currentPage}
                          onPageChange={pagination.goToPage}
                        />
                        
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={pagination.previousPage}
                            disabled={!pagination.canGoPrevious}
                          >
                            <ChevronLeft className="size-4" />
                          </Button>
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={pagination.nextPage}
                            disabled={!pagination.canGoNext}
                          >
                            <ChevronRight className="size-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Breadcrumb Example */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Breadcrumb Navigation</CardTitle>
                      <CardDescription>Show user location in app hierarchy</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Home className="size-4" />
                        <span>Home</span>
                        <ChevronRight className="size-4 text-muted-foreground" />
                        <span>Dashboard</span>
                        <ChevronRight className="size-4 text-muted-foreground" />
                        <span>Wallets</span>
                        <ChevronRight className="size-4 text-muted-foreground" />
                        <span className="font-medium">Bitcoin Wallet</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </Section>
            </TabsContent>

            {/* Feedback */}
            <TabsContent value="feedback" className="space-y-12">
              <Section title="Feedback & Status Components" description="User feedback and system status indicators">
                <div className="space-y-8">
                  <Grid cols={2} gap={8}>
                    <Card>
                      <CardHeader>
                        <CardTitle>Toast Notifications</CardTitle>
                        <CardDescription>Contextual feedback messages</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => addToast({ title: "Success!", description: "Operation completed successfully", variant: "success" })}
                          >
                            Success Toast
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => addToast({ title: "Error occurred", description: "Something went wrong", variant: "error" })}
                          >
                            Error Toast
                          </Button>
                          <Button 
                            size="sm"
                            variant="secondary"
                            onClick={() => addToast({ title: "Warning", description: "Please check your input", variant: "warning" })}
                          >
                            Warning Toast
                          </Button>
                          <Button 
                            size="sm"
                            variant="outline"
                            onClick={() => addToast({ title: "Information", description: "Here's some helpful info", variant: "info" })}
                          >
                            Info Toast
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Progress Indicators</CardTitle>
                        <CardDescription>Show progress and loading states</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Upload Progress</span>
                            <span>75%</span>
                          </div>
                          <Progress value={75} />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Storage Used</span>
                            <span>60%</span>
                          </div>
                          <Progress value={60} className="h-2" />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Portfolio Health</span>
                            <span>92%</span>
                          </div>
                          <Progress value={92} className="[&>div]:bg-green-500" />
                        </div>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Card>
                    <CardHeader>
                      <CardTitle>Badges & Status</CardTitle>
                      <CardDescription>Status indicators and labels</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-3">
                        <h4 className="font-medium">Badge Variants</h4>
                        <HStack gap={2} wrap>
                          <Badge>Default</Badge>
                          <Badge variant="secondary">Secondary</Badge>
                          <Badge variant="outline">Outline</Badge>
                          <Badge variant="destructive">Error</Badge>
                          <Badge variant="success">Success</Badge>
                          <Badge variant="warning">Warning</Badge>
                        </HStack>
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="font-medium">Status Examples</h4>
                        <VStack gap={3}>
                          <HStack gap={3} className="items-center">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-sm">Online</span>
                            <Badge variant="success">Active</Badge>
                          </HStack>
                          <HStack gap={3} className="items-center">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <span className="text-sm">Away</span>
                            <Badge variant="warning">Idle</Badge>
                          </HStack>
                          <HStack gap={3} className="items-center">
                            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                            <span className="text-sm">Offline</span>
                            <Badge variant="secondary">Inactive</Badge>
                          </HStack>
                        </VStack>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </Section>
            </TabsContent>

            {/* Business */}
            <TabsContent value="business" className="space-y-12">
              <Section title="Business Components" description="Specialized components for business applications">
                <div className="space-y-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>File Upload</CardTitle>
                      <CardDescription>Drag & drop file uploads with preview</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <FileUpload
                        maxFiles={5}
                        maxSize={5 * 1024 * 1024}
                        accept="image/*,.pdf,.docx"
                        onUpload={handleFileUpload}
                        showPreview
                      />
                    </CardContent>
                  </Card>

                  <div>
                    <h3 className="text-2xl font-bold mb-6">Pricing Comparison</h3>
                    <ComparisonTable
                      plans={saasPricingPlans}
                      features={saasPricingFeatures}
                      showYearly
                      highlightDifferences
                      maxColumns={4}
                    />
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold mb-6">Customer Testimonials</h3>
                    <Testimonials
                      testimonials={sampleTestimonials.slice(0, 6)}
                      layout="grid"
                      columns={3}
                      cardVariant="elevated"
                      showRating
                      showSource
                      showTags
                    />
                  </div>
                </div>
              </Section>
            </TabsContent>

            {/* Advanced */}
            <TabsContent value="advanced" className="space-y-12">
              <Section title="Advanced Components" description="Complex interactive components">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold mb-6">Interactive Charts</h3>
                    <Grid cols={2} gap={6}>
                      <AdvancedChart
                        data={chartData}
                        type="line"
                        title="Revenue Trend"
                        description="Monthly revenue performance"
                        trend={{ value: 12.5, period: "vs last month" }}
                        exportable
                        interactive
                      />
                      
                      <AdvancedChart
                        data={pieChartData}
                        type="pie"
                        title="Portfolio Allocation"
                        description="Asset distribution"
                        interactive
                      />

                      <AdvancedChart
                        data={chartData}
                        type="bar"
                        title="Monthly Transactions"
                        description="Transaction volume"
                        showValues
                        interactive
                      />

                      <AdvancedChart
                        data={gaugeData}
                        type="gauge"
                        title="System Health"
                        description="Overall system status"
                      />
                    </Grid>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Animation System</CardTitle>
                      <CardDescription>Smooth entrance and interaction animations</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <Button onClick={animation.reset} className="w-full">
                        Restart All Animations
                      </Button>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <h4 className="font-medium mb-3">Stagger Animation</h4>
                          <Stagger delay={100}>
                            {Array.from({ length: 4 }).map((_, i) => (
                              <div key={i} className={`p-3 rounded text-center text-sm bg-primary/${20 + i * 10}`}>
                                Item {i + 1}
                              </div>
                            ))}
                          </Stagger>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-3">In-View Animation</h4>
                          <VStack gap={3}>
                            {Array.from({ length: 3 }).map((_, i) => (
                              <InViewAnimate key={i} delay={i * 200}>
                                <div className="bg-secondary/30 p-3 rounded text-center text-sm">
                                  Slide in {i + 1}
                                </div>
                              </InViewAnimate>
                            ))}
                          </VStack>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-3">Hover Effects</h4>
                          <VStack gap={3}>
                            <Hover effect="lift">
                              <div className="bg-muted p-3 rounded text-center text-sm cursor-pointer">
                                Hover Lift
                              </div>
                            </Hover>
                            <Hover effect="scale">
                              <div className="bg-accent p-3 rounded text-center text-sm cursor-pointer">
                                Hover Scale
                              </div>
                            </Hover>
                          </VStack>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </Section>
            </TabsContent>

            {/* Interactive Showcase */}
            <TabsContent value="showcase" className="space-y-12">
              <Section title="Interactive Showcase" description="Real-world component combinations">
                <div className="space-y-8">
                  {/* Dashboard Preview */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Dashboard Preview</CardTitle>
                      <CardDescription>Complete dashboard interface example</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                      <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="mb-8">
                          <TabsTrigger value="overview" className="gap-2">
                            <Home className="size-4" />
                            Overview
                          </TabsTrigger>
                          <TabsTrigger value="analytics" className="gap-2">
                            <BarChart3 className="size-4" />
                            Analytics
                          </TabsTrigger>
                          <TabsTrigger value="settings" className="gap-2">
                            <Settings className="size-4" />
                            Settings
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-6">
                          {/* KPI Cards */}
                          <Grid cols={4} gap={4}>
                            {[
                              { title: "Total Revenue", value: "$45,231", change: "+20.1%", icon: DollarSign },
                              { title: "Active Users", value: "2,350", change: "+180.1%", icon: Users },
                              { title: "Transactions", value: "12,234", change: "+19%", icon: Activity },
                              { title: "Growth Rate", value: "+573", change: "+201", icon: TrendingUp },
                            ].map((stat, index) => (
                              <Card key={index}>
                                <CardContent className="flex items-center justify-between p-6">
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                                    <div className="text-2xl font-bold">{stat.value}</div>
                                    <p className="text-xs text-muted-foreground">
                                      <span className="text-green-600">{stat.change}</span> from last month
                                    </p>
                                  </div>
                                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                                </CardContent>
                              </Card>
                            ))}
                          </Grid>

                          {/* Chart */}
                          <AdvancedChart
                            data={chartData}
                            type="line"
                            title="Monthly Revenue"
                            description="Revenue growth over time"
                            interactive
                            exportable
                          />
                        </TabsContent>

                        <TabsContent value="analytics" className="space-y-6">
                          <Grid cols={2} gap={6}>
                            <AdvancedChart
                              data={pieChartData}
                              type="pie"
                              title="Traffic Sources"
                              description="Visitor sources breakdown"
                              interactive
                            />
                            <Card>
                              <CardHeader>
                                <CardTitle>Performance Metrics</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                {[
                                  { label: "Page Load Time", value: 85 },
                                  { label: "User Engagement", value: 92 },
                                  { label: "Conversion Rate", value: 68 },
                                  { label: "Customer Satisfaction", value: 94 },
                                ].map((metric, index) => (
                                  <div key={index} className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                      <span>{metric.label}</span>
                                      <span>{metric.value}%</span>
                                    </div>
                                    <Progress value={metric.value} />
                                  </div>
                                ))}
                              </CardContent>
                            </Card>
                          </Grid>
                        </TabsContent>

                        <TabsContent value="settings" className="space-y-6">
                          <Grid cols={2} gap={6}>
                            <Card>
                              <CardHeader>
                                <CardTitle>Account Settings</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">Display Name</label>
                                  <Input defaultValue="John Doe" />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">Email</label>
                                  <Input type="email" defaultValue="john@example.com" />
                                </div>
                                <Button>Save Changes</Button>
                              </CardContent>
                            </Card>
                            
                            <Card>
                              <CardHeader>
                                <CardTitle>Preferences</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <HStack justify="between">
                                  <div>
                                    <div className="font-medium">Email Notifications</div>
                                    <div className="text-sm text-muted-foreground">Receive updates via email</div>
                                  </div>
                                  <Switch defaultChecked />
                                </HStack>
                                <HStack justify="between">
                                  <div>
                                    <div className="font-medium">Dark Mode</div>
                                    <div className="text-sm text-muted-foreground">Use dark theme</div>
                                  </div>
                                  <Switch />
                                </HStack>
                                <HStack justify="between">
                                  <div>
                                    <div className="font-medium">Auto Save</div>
                                    <div className="text-sm text-muted-foreground">Automatically save changes</div>
                                  </div>
                                  <Switch defaultChecked />
                                </HStack>
                              </CardContent>
                            </Card>
                          </Grid>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                </div>
              </Section>
            </TabsContent>
          </Tabs>

          {/* Footer Stats */}
          <div className="border-t pt-12">
            <div className="text-center space-y-8">
              <h2 className="text-3xl font-bold">Complete Design System</h2>
              
              <Grid cols={4} gap={8} className="max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary">100+</div>
                  <div className="text-sm text-muted-foreground">Components</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary">12</div>
                  <div className="text-sm text-muted-foreground">Categories</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary">99%</div>
                  <div className="text-sm text-muted-foreground">Accessibility</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary">0</div>
                  <div className="text-sm text-muted-foreground">Dependencies</div>
                </div>
              </Grid>

              <div className="space-y-4">
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Built with React, TypeScript, Tailwind CSS, and modern accessibility standards.
                  Ready for production use in your next SaaS application.
                </p>
                
                <HStack justify="center" gap={4}>
                  <Button size="lg" className="gap-2">
                    <Download className="size-5" />
                    Get Started
                  </Button>
                  <Button variant="outline" size="lg" className="gap-2">
                    <Globe className="size-5" />
                    View Documentation
                  </Button>
                </HStack>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Command Palette */}
      <CommandPalette
        open={commandPalette.open}
        onOpenChange={commandPalette.setOpen}
      />
    </div>
  )
}

export default UltimateShowcase