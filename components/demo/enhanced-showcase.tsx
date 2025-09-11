"use client"

import * as React from "react"
import {
  Calendar,
  Users,
  TrendingUp,
  DollarSign,
  Activity,
  Bell,
  Search as SearchIcon,
  Filter,
  Download,
  Settings,
  Home,
  BarChart3,
  Wallet,
  CreditCard,
  PieChart,
  Command,
  Upload,
  MessageSquare,
  Star,
  Zap,
  Shield,
  Database,
  Globe,
  Mail,
  Phone,
  MapPin,
  Clock,
} from "lucide-react"

// Layout Components
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

// Advanced Components
import { CommandPalette, useCommandPalette } from "@/components/ui/command-palette"
import { FileUpload } from "@/components/ui/file-upload"
import { AdvancedChart } from "@/components/ui/advanced-chart"
import { ComparisonTable, saasPricingPlans, saasPricingFeatures } from "@/components/ui/comparison-table"
import { Testimonials, sampleTestimonials } from "@/components/ui/testimonials"
import { Search as SearchComponent, QuickSearch } from "@/components/ui/search"

// Enhanced Form System
import { FormField, FormSection, FormGrid } from "@/components/ui/form-field"
import { LoadingButton } from "@/components/ui/loading-button"

// Data Visualization
import { MetricCard, MetricCardGrid } from "@/components/ui/metric-card"
import { StatsCard, StatsGrid } from "@/components/ui/stats-card"

// Animation System
import { 
  Animate, 
  Stagger, 
  InViewAnimate, 
  Hover, 
  Click, 
  Transition, 
  Entrance,
  Sequence,
  useAnimation 
} from "@/components/ui/animate"

// Sample data
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

const metricsData = [
  {
    title: "Total Balance",
    value: "$124,350.75",
    change: { value: 12.5, period: "vs last month" },
    icon: <DollarSign className="size-4" />,
  },
  {
    title: "Active Wallets", 
    value: "12",
    change: { value: 3, period: "new this month", isPercentage: false },
    icon: <Wallet className="size-4" />,
  },
  {
    title: "Total Transactions",
    value: "2,847",
    change: { value: -2.3, period: "vs last week" },
    icon: <Activity className="size-4" />,
  },
  {
    title: "ROI",
    value: "+23.4%",
    change: { value: 8.7, period: "this quarter" },
    icon: <TrendingUp className="size-4" />,
  },
]

export function EnhancedShowcase() {
  const animation = useAnimation()
  const commandPalette = useCommandPalette()
  const [uploadedFiles, setUploadedFiles] = React.useState<File[]>([])

  const handleFileUpload = async (files: File[]) => {
    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log("Files uploaded:", files)
  }

  const demoSearchItems = [
    { id: "1", title: "Bitcoin Wallet", description: "Main BTC holding wallet" },
    { id: "2", title: "Ethereum DeFi", description: "Staking and DeFi positions" },
    { id: "3", title: "Trading Account", description: "Active trading portfolio" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Container size="full" className="py-8">
        <div className="space-y-12">
          {/* Hero Section */}
          <Entrance type="hero">
            <div className="text-center space-y-6">
              <div className="space-y-4">
                <Badge variant="secondary" className="text-sm px-4 py-2">
                  v3.0.0 - Advanced Component Library
                </Badge>
                <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                  Enhanced Design System
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  A comprehensive collection of production-ready components designed for modern SaaS applications. 
                  Built with React, TypeScript, and Tailwind CSS.
                </p>
              </div>
              
              <HStack justify="center" gap={4} className="flex-wrap">
                <Button size="lg" className="gap-2">
                  <Command className="size-4" />
                  Open Command Palette
                  <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-2">
                    ⌘K
                  </kbd>
                </Button>
                <Button variant="outline" size="lg">
                  View Components
                </Button>
              </HStack>
            </div>
          </Entrance>

          <Separator />

          {/* Advanced Components Showcase */}
          <Tabs defaultValue="command" className="space-y-8">
            <div className="flex justify-center">
              <TabsList className="grid w-full max-w-6xl grid-cols-2 lg:grid-cols-6">
                <TabsTrigger value="command">Command</TabsTrigger>
                <TabsTrigger value="charts">Advanced Charts</TabsTrigger>
                <TabsTrigger value="files">File Upload</TabsTrigger>
                <TabsTrigger value="pricing">Pricing Tables</TabsTrigger>
                <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
                <TabsTrigger value="interactive">Interactive</TabsTrigger>
              </TabsList>
            </div>

            {/* Command Palette Demo */}
            <TabsContent value="command" className="space-y-8">
              <Section 
                title="Command Palette" 
                description="Fast, keyboard-driven navigation and actions"
              >
                <Grid cols={2} gap={6}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Command Palette Demo</CardTitle>
                      <CardDescription>
                        Press Ctrl/Cmd + K to open the command palette
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-muted/30 rounded-lg p-4 border-2 border-dashed">
                        <div className="text-center space-y-2">
                          <Command className="size-8 mx-auto text-muted-foreground" />
                          <p className="font-medium">Command Palette</p>
                          <p className="text-sm text-muted-foreground">
                            Keyboard shortcut: <kbd className="bg-muted px-2 py-1 rounded text-xs">⌘K</kbd>
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Features:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Fuzzy search across all pages and actions</li>
                          <li>• Keyboard navigation with arrow keys</li>
                          <li>• Categorized results with icons</li>
                          <li>• Keyboard shortcuts display</li>
                          <li>• Recent actions and quick access</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Search Component</CardTitle>
                      <CardDescription>Advanced search with filters and sorting</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <SearchComponent
                        placeholder="Search wallets, transactions..."
                        filters={[
                          {
                            id: "type",
                            label: "Type",
                            type: "select",
                            options: [
                              { label: "All", value: "" },
                              { label: "Wallet", value: "wallet" },
                              { label: "Transaction", value: "transaction" },
                            ],
                          },
                        ]}
                        sortOptions={[
                          { field: "date", label: "Date" },
                          { field: "amount", label: "Amount" },
                        ]}
                        results={156}
                        onSearch={(state) => console.log("Search:", state)}
                      />
                      
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Quick Search</h4>
                        <QuickSearch
                          placeholder="Type to search..."
                          onSearch={(query) => console.log("Quick search:", query)}
                          results={demoSearchItems}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
              </Section>
            </TabsContent>

            {/* Advanced Charts */}
            <TabsContent value="charts" className="space-y-8">
              <Section 
                title="Advanced Charts" 
                description="Interactive data visualization components"
              >
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
                    description="Transaction volume by month"
                    showValues
                    interactive
                  />

                  <AdvancedChart
                    data={gaugeData}
                    type="gauge"
                    title="Portfolio Health Score"
                    description="Overall portfolio performance indicator"
                  />
                </Grid>

                {/* Metrics Grid */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Key Metrics</h3>
                  <MetricCardGrid>
                    {metricsData.map((metric, index) => (
                      <InViewAnimate key={index} delay={index * 100}>
                        <MetricCard
                          title={metric.title}
                          value={metric.value}
                          trend={metric.change}
                          icon={metric.icon}
                        />
                      </InViewAnimate>
                    ))}
                  </MetricCardGrid>
                </div>
              </Section>
            </TabsContent>

            {/* File Upload */}
            <TabsContent value="files" className="space-y-8">
              <Section 
                title="File Upload System" 
                description="Drag & drop file uploads with preview and validation"
              >
                <Grid cols={2} gap={6}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Dropzone Upload</CardTitle>
                      <CardDescription>
                        Drag & drop files or click to browse
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <FileUpload
                        maxFiles={5}
                        maxSize={5 * 1024 * 1024} // 5MB
                        accept="image/*,.pdf,.docx"
                        onFilesChange={setUploadedFiles}
                        onUpload={handleFileUpload}
                        showPreview
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Button Upload</CardTitle>
                      <CardDescription>
                        Simple button-based file selection
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <FileUpload
                        variant="button"
                        maxFiles={3}
                        multiple
                        onFilesChange={(files) => console.log("Button upload:", files)}
                      />
                      
                      <div className="mt-6 space-y-2">
                        <h4 className="text-sm font-medium">Features:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• File type validation</li>
                          <li>• Size limits with user feedback</li>
                          <li>• Image preview generation</li>
                          <li>• Upload progress indicators</li>
                          <li>• Drag & drop support</li>
                          <li>• Error handling and validation</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
              </Section>
            </TabsContent>

            {/* Pricing Tables */}
            <TabsContent value="pricing" className="space-y-8">
              <Section 
                title="Pricing Comparison" 
                description="Feature comparison tables for SaaS pricing"
              >
                <ComparisonTable
                  plans={saasPricingPlans}
                  features={saasPricingFeatures}
                  showYearly
                  highlightDifferences
                  maxColumns={4}
                />
              </Section>
            </TabsContent>

            {/* Testimonials */}
            <TabsContent value="testimonials" className="space-y-8">
              <Section 
                title="Social Proof & Testimonials" 
                description="Customer testimonials and reviews"
              >
                <div className="space-y-12">
                  {/* Featured Layout */}
                  <div>
                    <h3 className="text-lg font-semibold mb-6">Featured Testimonials</h3>
                    <Testimonials
                      testimonials={sampleTestimonials}
                      layout="featured"
                      showRating
                      showSource
                      showTags
                    />
                  </div>

                  {/* Grid Layout */}
                  <div>
                    <h3 className="text-lg font-semibold mb-6">Customer Reviews</h3>
                    <Testimonials
                      testimonials={sampleTestimonials.slice(0, 6)}
                      layout="grid"
                      columns={3}
                      cardVariant="elevated"
                      showRating
                      showTags
                    />
                  </div>

                  {/* Carousel Layout */}
                  <div>
                    <h3 className="text-lg font-semibold mb-6">Testimonial Carousel</h3>
                    <Testimonials
                      testimonials={sampleTestimonials}
                      layout="carousel"
                      autoplay
                      autoplayDelay={4000}
                      showRating
                      showSource
                    />
                  </div>
                </div>
              </Section>
            </TabsContent>

            {/* Interactive Demos */}
            <TabsContent value="interactive" className="space-y-8">
              <Section 
                title="Interactive Components" 
                description="Animations, hover effects, and micro-interactions"
              >
                <div className="space-y-8">
                  {/* Animation Showcase */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Animation System</CardTitle>
                      <CardDescription>
                        Smooth entrance animations and micro-interactions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <Button onClick={animation.reset} className="w-full">
                          Restart Animations
                        </Button>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h4 className="font-medium mb-3">Stagger Animation</h4>
                            <Stagger>
                              <div className="bg-primary/10 rounded-lg p-4 text-center">Item 1</div>
                              <div className="bg-primary/20 rounded-lg p-4 text-center">Item 2</div>
                              <div className="bg-primary/30 rounded-lg p-4 text-center">Item 3</div>
                              <div className="bg-primary/40 rounded-lg p-4 text-center">Item 4</div>
                            </Stagger>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-3">Hover Effects</h4>
                            <div className="space-y-2">
                              <Hover effect="lift">
                                <div className="bg-muted rounded-lg p-4 text-center cursor-pointer">
                                  Hover Lift
                                </div>
                              </Hover>
                              <Hover effect="scale">
                                <div className="bg-accent rounded-lg p-4 text-center cursor-pointer">
                                  Hover Scale
                                </div>
                              </Hover>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-3">Click Effects</h4>
                            <Click effect="ripple">
                              <Button variant="outline" className="w-full">
                                Click for Ripple
                              </Button>
                            </Click>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Enhanced Form Components */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Enhanced Form Components</CardTitle>
                      <CardDescription>
                        Modern form inputs with validation and states
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <FormGrid cols={2} gap={4}>
                        <FormField label="Standard Input" required>
                          <Input placeholder="Enter your name" />
                        </FormField>
                        
                        <FormField label="Premium Input">
                          <Input
                            variant="premium"
                            placeholder="Premium styling"
                            leftIcon={<Mail className="size-4" />}
                          />
                        </FormField>
                        
                        <FormField label="Password Input">
                          <Input
                            type="password"
                            placeholder="Enter password"
                            variant="filled"
                          />
                        </FormField>
                        
                        <FormField label="Phone Number">
                          <Input
                            type="tel"
                            placeholder="+1 (555) 000-0000"
                            leftIcon={<Phone className="size-4" />}
                          />
                        </FormField>
                      </FormGrid>
                      
                      <div className="mt-6 flex gap-3">
                        <Button>Submit Form</Button>
                        <LoadingButton loading>Processing...</LoadingButton>
                        <Button variant="outline">Cancel</Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Component Variations */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Component Variations</CardTitle>
                      <CardDescription>
                        Different styles and variants for various use cases
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Button Variations */}
                        <div>
                          <h4 className="font-medium mb-3">Button Variants</h4>
                          <HStack gap={2} wrap>
                            <Button variant="default">Default</Button>
                            <Button variant="secondary">Secondary</Button>
                            <Button variant="outline">Outline</Button>
                            <Button variant="ghost">Ghost</Button>
                            <Button variant="success">Success</Button>
                            <Button variant="warning">Warning</Button>
                            <Button variant="premium">Premium</Button>
                            <Button variant="enterprise">Enterprise</Button>
                          </HStack>
                        </div>

                        {/* Badge Variations */}
                        <div>
                          <h4 className="font-medium mb-3">Badge Variants</h4>
                          <HStack gap={2} wrap>
                            <Badge variant="default">Default</Badge>
                            <Badge variant="secondary">Secondary</Badge>
                            <Badge variant="destructive">Destructive</Badge>
                            <Badge variant="outline">Outline</Badge>
                            <Badge variant="success">Success</Badge>
                            <Badge variant="warning">Warning</Badge>
                          </HStack>
                        </div>

                        {/* Avatar Examples */}
                        <div>
                          <h4 className="font-medium mb-3">Avatar Examples</h4>
                          <HStack gap={2}>
                            <Avatar>
                              <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                            <Avatar>
                              <AvatarFallback className="bg-primary text-primary-foreground">
                                AB
                              </AvatarFallback>
                            </Avatar>
                            <Avatar>
                              <AvatarFallback className="bg-green-100 text-green-700">
                                XY
                              </AvatarFallback>
                            </Avatar>
                          </HStack>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </Section>
            </TabsContent>
          </Tabs>

          {/* Footer */}
          <Separator />
          <div className="text-center text-sm text-muted-foreground">
            <p>Built with React, TypeScript, Tailwind CSS, and ❤️</p>
            <p className="mt-1">
              Press <kbd className="bg-muted px-2 py-1 rounded">⌘K</kbd> to open the command palette
            </p>
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