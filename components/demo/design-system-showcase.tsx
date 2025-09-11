"use client"

import * as React from "react"
import {
  Calendar,
  Users,
  TrendingUp,
  DollarSign,
  Activity,
  Bell,
  Search,
  Filter,
  Download,
  Settings,
  Home,
  BarChart3,
  Wallet,
  CreditCard,
  PieChart,
} from "lucide-react"
import { z } from "zod"

// Layout Components
import { Container } from "@/components/ui/container"
import { Section } from "@/components/ui/section"
import { Grid, GridItem } from "@/components/ui/grid"
import { HStack, VStack, Center, Spacer } from "@/components/ui/stack"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { PageLayout, PageHeader, PageSection, EmptyState } from "@/components/layouts/page-layout"

// Enhanced Form System
import { FormField, FormSection, FormGrid } from "@/components/ui/form-field"
import { FormBuilder, useFormConfig, validationSchemas } from "@/components/ui/form-builder"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { LoadingButton } from "@/components/ui/loading-button"

// Notification System
import { ToastProvider, useToast, toastPresets } from "@/components/ui/toast"
import { NotificationList, NotificationCenter } from "@/components/ui/notification"

// Data Visualization
import { Chart, SimpleBarChart, SimplePieChart, TrendChart } from "@/components/ui/chart"
import { MetricCard, MetricCardGrid } from "@/components/ui/metric-card"
import { StatsCard, StatsGrid, ComparisonStatsCard } from "@/components/ui/stats-card"
import { DataTable, sortableHeader, actionsCell } from "@/components/ui/data-table"

// Navigation & Search
import { Navigation, type NavigationItem } from "@/components/ui/navigation"
import { Sidebar, SidebarProvider, SidebarHeader, SidebarContent, SidebarNav } from "@/components/ui/sidebar"
import { Search as SearchComponent, QuickSearch } from "@/components/ui/search"
import { FilterBar } from "@/components/ui/filter-bar"

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

// Base Components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

// Sample data
const navigationItems: NavigationItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
    icon: <Home className="size-4" />,
  },
  {
    id: "analytics",
    label: "Analytics",
    href: "/analytics",
    icon: <BarChart3 className="size-4" />,
    badge: { text: "New", variant: "destructive" },
  },
  {
    id: "wallets",
    label: "Wallets",
    href: "/wallets",
    icon: <Wallet className="size-4" />,
    children: [
      { id: "crypto", label: "Crypto Wallets", href: "/wallets/crypto" },
      { id: "bank", label: "Bank Accounts", href: "/wallets/bank" },
    ],
  },
  {
    id: "transactions",
    label: "Transactions",
    href: "/transactions",
    icon: <CreditCard className="size-4" />,
  },
]

const sampleNotifications = [
  {
    id: "1",
    title: "Welcome to MoneyMappr!",
    description: "Your financial journey starts here.",
    variant: "info" as const,
    timestamp: new Date(),
    read: false,
  },
  {
    id: "2", 
    title: "New transaction detected",
    description: "$1,250.00 received from Salary",
    variant: "success" as const,
    timestamp: new Date(Date.now() - 3600000),
    read: false,
  },
  {
    id: "3",
    title: "Budget limit reached",
    description: "You've reached 90% of your monthly budget",
    variant: "warning" as const,
    timestamp: new Date(Date.now() - 7200000),
    read: true,
  },
]

const chartData = [
  { label: "Jan", value: 1200 },
  { label: "Feb", value: 1900 },
  { label: "Mar", value: 800 },
  { label: "Apr", value: 1500 },
  { label: "May", value: 2000 },
  { label: "Jun", value: 1700 },
]

const pieData = [
  { label: "Food", value: 35, color: "#ef4444" },
  { label: "Transport", value: 25, color: "#f97316" },
  { label: "Entertainment", value: 20, color: "#eab308" },
  { label: "Shopping", value: 20, color: "#22c55e" },
]

const metricsData = [
  {
    title: "Total Balance",
    value: "$24,350.75",
    change: { value: 12.5, period: "vs last month" },
    icon: <DollarSign className="size-4" />,
    chart: { type: "trend" as const, data: chartData, color: "#22c55e" },
  },
  {
    title: "Active Wallets",
    value: "8",
    change: { value: 2, period: "new this month", isPercentage: false },
    icon: <Wallet className="size-4" />,
    chart: { type: "bar" as const, data: chartData.slice(0, 4) },
  },
  {
    title: "Transactions",
    value: "156",
    change: { value: -5.2, period: "vs last week" },
    icon: <Activity className="size-4" />,
  },
  {
    title: "Growth Rate",
    value: "23.1%",
    change: { value: 8.3, period: "this quarter" },
    icon: <TrendingUp className="size-4" />,
  },
]

const formConfig = {
  title: "Enhanced Form Example",
  description: "Demonstration of the advanced form builder system",
  schema: z.object({
    firstName: validationSchemas.required,
    lastName: validationSchemas.required,
    email: validationSchemas.email,
    phone: validationSchemas.phone,
    website: validationSchemas.url.optional(),
    bio: z.string().optional(),
    notifications: z.boolean().default(true),
    plan: z.enum(["free", "pro", "enterprise"]),
  }),
  sections: [
    {
      title: "Personal Information",
      description: "Basic details about yourself",
      fields: [
        {
          name: "firstName",
          type: "text" as const,
          label: "First Name",
          placeholder: "John",
          required: true,
          cols: 1,
        },
        {
          name: "lastName", 
          type: "text" as const,
          label: "Last Name",
          placeholder: "Doe",
          required: true,
          cols: 1,
        },
        {
          name: "email",
          type: "email" as const,
          label: "Email Address",
          placeholder: "john@example.com",
          required: true,
          cols: 2,
        },
      ],
      cols: 2,
    },
    {
      title: "Contact & Preferences",
      fields: [
        {
          name: "phone",
          type: "tel" as const,
          label: "Phone Number",
          placeholder: "+1 (555) 000-0000",
        },
        {
          name: "website",
          type: "url" as const,
          label: "Website",
          placeholder: "https://example.com",
          optional: true,
        },
        {
          name: "bio",
          type: "textarea" as const,
          label: "Bio",
          placeholder: "Tell us about yourself...",
          cols: 2,
        },
        {
          name: "plan",
          type: "select" as const,
          label: "Subscription Plan", 
          options: [
            { value: "free", label: "Free" },
            { value: "pro", label: "Pro" },
            { value: "enterprise", label: "Enterprise" },
          ],
        },
        {
          name: "notifications",
          type: "checkbox" as const,
          label: "Email Notifications",
        },
      ],
      cols: 2,
    },
  ],
  submitText: "Save Changes",
  resetText: "Reset Form",
}

function DesignSystemShowcaseContent() {
  const { toast } = useToast()
  const animation = useAnimation()
  
  const handleFormSubmit = (data: any) => {
    console.log("Form submitted:", data)
    toast(toastPresets.success("Form saved successfully!"))
  }

  const handleToastDemo = (type: string) => {
    switch (type) {
      case "success":
        toast(toastPresets.success("Operation completed successfully!"))
        break
      case "error":
        toast(toastPresets.error("Something went wrong. Please try again."))
        break
      case "warning":
        toast(toastPresets.warning("Please check your input and try again."))
        break
      case "info":
        toast(toastPresets.info("Here's some helpful information."))
        break
    }
  }

  return (
      <div className="min-h-screen bg-background">
        <Container size="full" className="py-8">
          <div className="space-y-12">
            {/* Header */}
            <Entrance type="hero">
              <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold tracking-tight">
                  Enhanced Design System
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  A comprehensive collection of modern, enterprise-grade components for SaaS applications
                </p>
                <Badge variant="secondary" className="text-sm px-4 py-2">
                  v2.0.0 - Enterprise Ready
                </Badge>
              </div>
            </Entrance>

            <Separator />

            {/* Component Showcase */}
            <Tabs defaultValue="layouts" className="space-y-8">
              <div className="flex justify-center">
                <TabsList className="grid w-full max-w-4xl grid-cols-4 lg:grid-cols-8">
                  <TabsTrigger value="layouts">Layouts</TabsTrigger>
                  <TabsTrigger value="forms">Forms</TabsTrigger>
                  <TabsTrigger value="notifications">Alerts</TabsTrigger>
                  <TabsTrigger value="charts">Charts</TabsTrigger>
                  <TabsTrigger value="navigation">Navigation</TabsTrigger>
                  <TabsTrigger value="search">Search</TabsTrigger>
                  <TabsTrigger value="animations">Animations</TabsTrigger>
                  <TabsTrigger value="components">Components</TabsTrigger>
                </TabsList>
              </div>

              {/* Layout Components */}
              <TabsContent value="layouts" className="space-y-8">
                <Section title="Layout Components" description="Flexible layout primitives for building consistent interfaces">
                  <Grid cols={2} gap={6}>
                    <Card>
                      <CardHeader>
                        <CardTitle>Container & Section</CardTitle>
                        <CardDescription>Responsive containers with consistent spacing</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="bg-muted rounded p-4 text-center text-sm">
                            Container (Responsive)
                          </div>
                          <div className="bg-accent rounded p-4 text-center text-sm">
                            Section (Pattern Background)
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Grid & Stack</CardTitle>
                        <CardDescription>Flexible grid and stack layouts</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <VStack gap={4}>
                          <Grid cols={3} gap={2}>
                            {Array.from({ length: 6 }).map((_, i) => (
                              <div key={i} className="bg-primary/20 rounded p-2 text-center text-xs">
                                Grid {i + 1}
                              </div>
                            ))}
                          </Grid>
                          <HStack justify="between" className="bg-muted rounded p-2">
                            <span className="text-xs">Left</span>
                            <span className="text-xs">Center</span>
                            <span className="text-xs">Right</span>
                          </HStack>
                        </VStack>
                      </CardContent>
                    </Card>
                  </Grid>
                </Section>
              </TabsContent>

              {/* Form System */}
              <TabsContent value="forms" className="space-y-8">
                <Section title="Enhanced Form System" description="Advanced form builder with validation and state management">
                  <div className="max-w-2xl mx-auto">
                    <FormBuilder
                      config={formConfig}
                      onSubmit={handleFormSubmit}
                      defaultValues={{
                        firstName: "John",
                        email: "john@example.com",
                        notifications: true,
                        plan: "pro",
                      }}
                    />
                  </div>
                </Section>
              </TabsContent>

              {/* Notifications */}
              <TabsContent value="notifications" className="space-y-8">
                <Section title="Notification System" description="Toast notifications and notification centers">
                  <Grid cols={2} gap={6}>
                    <Card>
                      <CardHeader>
                        <CardTitle>Toast Notifications</CardTitle>
                        <CardDescription>Contextual feedback messages</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <HStack gap={2} wrap={true}>
                          <Button size="sm" onClick={() => handleToastDemo("success")}>
                            Success
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleToastDemo("error")}>
                            Error
                          </Button>
                          <Button size="sm" variant="warning" onClick={() => handleToastDemo("warning")}>
                            Warning
                          </Button>
                          <Button size="sm" variant="secondary" onClick={() => handleToastDemo("info")}>
                            Info
                          </Button>
                        </HStack>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Notification Center</CardTitle>
                        <CardDescription>Centralized notification management</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="max-h-64 overflow-auto">
                          <NotificationList notifications={sampleNotifications} compact />
                        </div>
                      </CardContent>
                    </Card>
                  </Grid>
                </Section>
              </TabsContent>

              {/* Charts & Visualization */}
              <TabsContent value="charts" className="space-y-8">
                <Section title="Data Visualization" description="Charts, metrics, and statistics components">
                  <VStack gap={8}>
                    {/* Metrics Grid */}
                    <div>
                      <h3 className="text-lg font-medium mb-4">Metric Cards</h3>
                      <MetricCardGrid>
                        {metricsData.map((metric, index) => (
                          <MetricCard
                            key={index}
                            title={metric.title}
                            value={metric.value}
                            trend={metric.change}
                            icon={metric.icon}
                          />
                        ))}
                      </MetricCardGrid>
                    </div>

                    {/* Charts */}
                    <Grid cols={2} gap={6}>
                      <Chart title="Revenue Trend" description="Monthly revenue overview">
                        <TrendChart data={chartData} showDots />
                      </Chart>

                      <Chart title="Expense Breakdown" description="Spending by category">
                        <SimplePieChart data={pieData} />
                      </Chart>

                      <Chart title="Monthly Growth" description="User acquisition metrics" className="col-span-2">
                        <SimpleBarChart data={chartData} showValues />
                      </Chart>
                    </Grid>

                    {/* Stats Cards */}
                    <div>
                      <h3 className="text-lg font-medium mb-4">Enhanced Stats Cards</h3>
                      <StatsGrid cols={3}>
                        <StatsCard
                          data={{
                            title: "Total Users",
                            value: "12,459",
                            change: { value: 12.3, period: "vs last month" },
                            icon: <Users className="size-4" />,
                            chart: { type: "trend", data: chartData.slice(0, 5) },
                          }}
                          showChart
                          animated
                        />
                        <StatsCard
                          data={{
                            title: "Revenue",
                            value: "$89,432",
                            change: { value: -2.1, period: "vs last week" },
                            icon: <DollarSign className="size-4" />,
                          }}
                          variant="gradient"
                        />
                        <StatsCard
                          data={{
                            title: "Conversion Rate",
                            value: "3.24%",
                            change: { value: 0.8, period: "vs last month" },
                            icon: <TrendingUp className="size-4" />,
                          }}
                          variant="elevated"
                          trend="positive"
                        />
                      </StatsGrid>
                    </div>
                  </VStack>
                </Section>
              </TabsContent>

              {/* Navigation */}
              <TabsContent value="navigation" className="space-y-8">
                <Section title="Navigation Components" description="Advanced navigation patterns and sidebar layouts">
                  <Grid cols={2} gap={6}>
                    <Card>
                      <CardHeader>
                        <CardTitle>Navigation Menu</CardTitle>
                        <CardDescription>Flexible navigation with badges and icons</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Navigation
                          items={navigationItems}
                          orientation="vertical"
                          itemVariant="ghost"
                          collapsible
                        />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Sidebar Preview</CardTitle>
                        <CardDescription>Collapsible sidebar with sections</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-64 bg-muted/30 rounded-lg p-4">
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 font-medium">
                              <div className="size-6 bg-primary rounded"></div>
                              MoneyMappr
                            </div>
                            <div className="space-y-1">
                              {navigationItems.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex items-center gap-2 p-2 rounded hover:bg-muted text-sm"
                                >
                                  {item.icon}
                                  {item.label}
                                  {item.badge && (
                                    <Badge variant={item.badge.variant} className="ml-auto text-xs">
                                      {item.badge.text}
                                    </Badge>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Grid>
                </Section>
              </TabsContent>

              {/* Search & Filtering */}
              <TabsContent value="search" className="space-y-8">
                <Section title="Search & Filter Patterns" description="Advanced search and filtering capabilities">
                  <VStack gap={6}>
                    <Card>
                      <CardHeader>
                        <CardTitle>Enhanced Search</CardTitle>
                        <CardDescription>Search with filters, sorting, and results</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <SearchComponent
                          placeholder="Search transactions, wallets, or users..."
                          filters={[
                            {
                              id: "type",
                              label: "Type",
                              type: "select",
                              options: [
                                { label: "All", value: "" },
                                { label: "Income", value: "income" },
                                { label: "Expense", value: "expense" },
                              ],
                            },
                            {
                              id: "amount",
                              label: "Amount Range",
                              type: "range",
                            },
                          ]}
                          sortOptions={[
                            { field: "date", label: "Date" },
                            { field: "amount", label: "Amount" },
                            { field: "name", label: "Name" },
                          ]}
                          results={156}
                          onSearch={(state) => console.log("Search:", state)}
                        />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Quick Search</CardTitle>
                        <CardDescription>Instant search with autocomplete</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <QuickSearch
                          placeholder="Quick search..."
                          onSearch={(query) => console.log("Quick search:", query)}
                          results={[
                            { id: "1", title: "Crypto Wallet #1", description: "Bitcoin, Ethereum" },
                            { id: "2", title: "Bank Account", description: "Chase Checking" },
                            { id: "3", title: "Investment Portfolio", description: "Stock portfolio" },
                          ]}
                        />
                      </CardContent>
                    </Card>
                  </VStack>
                </Section>
              </TabsContent>

              {/* Animations */}
              <TabsContent value="animations" className="space-y-8">
                <Section title="Animation System" description="Smooth animations and micro-interactions">
                  <Grid cols={2} gap={6}>
                    <Card>
                      <CardHeader>
                        <CardTitle>Entrance Animations</CardTitle>
                        <CardDescription>Various entrance effects</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <Button onClick={animation.reset} className="w-full">
                            Restart Animations
                          </Button>
                          <Stagger>
                            <div className="bg-primary/20 rounded p-3 text-center">Slide Up 1</div>
                            <div className="bg-primary/30 rounded p-3 text-center">Slide Up 2</div>
                            <div className="bg-primary/40 rounded p-3 text-center">Slide Up 3</div>
                            <div className="bg-primary/50 rounded p-3 text-center">Slide Up 4</div>
                          </Stagger>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Hover Effects</CardTitle>
                        <CardDescription>Interactive hover states</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <Hover effect="lift">
                            <div className="bg-muted rounded p-4 text-center cursor-pointer">
                              Hover Lift
                            </div>
                          </Hover>
                          <Hover effect="scale">
                            <div className="bg-accent rounded p-4 text-center cursor-pointer">
                              Hover Scale
                            </div>
                          </Hover>
                          <Hover effect="glow">
                            <div className="bg-primary/20 rounded p-4 text-center cursor-pointer">
                              Hover Glow
                            </div>
                          </Hover>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="col-span-2">
                      <CardHeader>
                        <CardTitle>Animation Sequence</CardTitle>
                        <CardDescription>Coordinated animation sequences</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Sequence delay={500}>
                          <div className="bg-emerald-100 dark:bg-emerald-900/20 rounded p-4 text-center">
                            Step 1: Initialize
                          </div>
                          <div className="bg-blue-100 dark:bg-blue-900/20 rounded p-4 text-center">
                            Step 2: Process
                          </div>
                          <div className="bg-purple-100 dark:bg-purple-900/20 rounded p-4 text-center">
                            Step 3: Complete
                          </div>
                        </Sequence>
                      </CardContent>
                    </Card>
                  </Grid>
                </Section>
              </TabsContent>

              {/* Enhanced Components */}
              <TabsContent value="components" className="space-y-8">
                <Section title="Enhanced Components" description="Modern variants of base components">
                  <VStack gap={8}>
                    {/* Enhanced Buttons */}
                    <div>
                      <h3 className="text-lg font-medium mb-4">Enhanced Buttons</h3>
                      <div className="flex flex-wrap gap-3">
                        <Button variant="default">Default</Button>
                        <Button variant="secondary">Secondary</Button>
                        <Button variant="outline">Outline</Button>
                        <Button variant="ghost">Ghost</Button>
                        <Button variant="success">Success</Button>
                        <Button variant="warning">Warning</Button>
                        <Button variant="premium">Premium</Button>
                        <Button variant="enterprise">Enterprise</Button>
                        <LoadingButton loading>Loading...</LoadingButton>
                      </div>
                    </div>

                    {/* Enhanced Inputs */}
                    <div>
                      <h3 className="text-lg font-medium mb-4">Enhanced Inputs</h3>
                      <Grid cols={2} gap={4}>
                        <Input variant="default" placeholder="Default input" />
                        <Input variant="filled" placeholder="Filled input" />
                        <Input
                          variant="premium"
                          placeholder="Premium input"
                          leftIcon={<Search className="size-4" />}
                        />
                        <Input
                          variant="enterprise"
                          placeholder="Enterprise input"
                          type="password"
                        />
                      </Grid>
                    </div>

                    {/* Enhanced Cards */}
                    <div>
                      <h3 className="text-lg font-medium mb-4">Enhanced Cards</h3>
                      <Grid cols={3} gap={4}>
                        <Card variant="default">
                          <CardContent className="p-6">
                            <h4 className="font-medium">Default Card</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Standard card styling
                            </p>
                          </CardContent>
                        </Card>
                        <Card variant="elevated">
                          <CardContent className="p-6">
                            <h4 className="font-medium">Elevated Card</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Enhanced shadows
                            </p>
                          </CardContent>
                        </Card>
                        <Card variant="premium">
                          <CardContent className="p-6">
                            <h4 className="font-medium">Premium Card</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Premium styling
                            </p>
                          </CardContent>
                        </Card>
                      </Grid>
                    </div>
                  </VStack>
                </Section>
              </TabsContent>
            </Tabs>
          </div>
        </Container>
      </div>
  )
}

export function DesignSystemShowcase() {
  return (
    <ToastProvider>
      <DesignSystemShowcaseContent />
    </ToastProvider>
  )
}