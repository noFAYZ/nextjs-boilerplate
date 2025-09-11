"use client"

import * as React from "react"
import {
  Calendar as CalendarIcon,
  Search as SearchIcon,
  Upload,
  Star,
  Mail,
  Phone,
  Globe,
  Building,
  Users,
  CreditCard,
  DollarSign,
  TrendingUp,
  Activity,
  CheckCircle,
  AlertCircle,
  X,
  ChevronRight,
  Download,
  Filter,
  Settings,
  MoreHorizontal,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Container } from "@/components/ui/container"
import { Section } from "@/components/ui/section"
import { Grid, GridItem } from "@/components/ui/grid"

// New Components
import { DatePicker, DateRangePicker } from "@/components/ui/date-picker"
import { MultiSelect, useMultiSelect } from "@/components/ui/multi-select"
import { Combobox, useCombobox } from "@/components/ui/combobox"
import { NumberInput, useNumberInput } from "@/components/ui/number-input"
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter, useModal } from "@/components/ui/modal"
import { LoadingSpinner, LoadingOverlay, LoadingSkeleton } from "@/components/ui/loading-spinner"
import { PricingTable, PricingBillingToggle, usePricing } from "@/components/ui/pricing-table"
import { DataTableAdvanced, createSortableHeader, createActionsCell } from "@/components/ui/data-table-advanced"
import { Pagination, PaginationInfo, usePagination } from "@/components/ui/pagination"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function CompleteShowcase() {
  const [selectedDate, setSelectedDate] = React.useState<Date>()
  const [dateRange, setDateRange] = React.useState<{ from?: Date; to?: Date }>({})
  const multiSelect = useMultiSelect(["react", "nextjs"])
  const combobox = useCombobox("nextjs")
  const numberInput = useNumberInput(100)
  const modal = useModal()
  const pricing = usePricing("monthly")
  const [isLoading, setIsLoading] = React.useState(false)

  // Sample data for components
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
        { name: "Up to 3 projects", included: true },
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
      description: "Best for growing businesses",
      price: { monthly: 29, yearly: 290 },
      features: [
        { name: "Unlimited projects", included: true },
        { name: "Advanced analytics", included: true },
        { name: "Priority email support", included: true },
        { name: "Advanced features", included: true },
        { name: "24/7 support", included: false },
      ],
      highlighted: true,
      popular: true,
      buttonText: "Start Free Trial",
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "For large scale applications",
      price: { monthly: 99, yearly: 990 },
      features: [
        { name: "Everything in Pro", included: true },
        { name: "Custom integrations", included: true },
        { name: "Dedicated support", included: true },
        { name: "SLA guarantee", included: true },
        { name: "24/7 phone support", included: true },
      ],
      buttonText: "Contact Sales",
      buttonVariant: "outline" as const,
    },
  ]

  const sampleTableData = [
    { id: 1, name: "John Doe", email: "john@example.com", status: "Active", role: "Admin" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", status: "Inactive", role: "User" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", status: "Active", role: "User" },
  ]

  const tableColumns = [
    {
      accessorKey: "name",
      header: createSortableHeader("Name"),
    },
    {
      accessorKey: "email",
      header: createSortableHeader("Email"),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => (
        <Badge variant={row.getValue("status") === "Active" ? "default" : "secondary"}>
          {row.getValue("status")}
        </Badge>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
    },
    {
      id: "actions",
      enableHiding: false,
      cell: createActionsCell([
        {
          label: "Edit",
          onClick: (row) => console.log("Edit", row),
        },
        {
          label: "Delete",
          onClick: (row) => console.log("Delete", row),
          variant: "destructive" as const,
        },
      ]),
    },
  ]

  const pagination = usePagination({
    totalItems: 100,
    itemsPerPage: 10,
  })

  const simulateLoading = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 2000)
  }

  return (
    <Container size="full" className="py-8">
      <div className="space-y-12">
        {/* Header */}
        <Section className="text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Complete Component Showcase
          </h1>
          <p className="text-xl text-muted-foreground mb-6 max-w-3xl mx-auto">
            Comprehensive collection of all components including advanced forms, data tables, 
            pricing tables, modals, loading states, and business components.
          </p>
          <Badge variant="secondary" className="text-sm px-4 py-2">
            All Components • Production Ready
          </Badge>
        </Section>

        <Tabs defaultValue="forms" className="space-y-8">
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-4xl grid-cols-6">
              <TabsTrigger value="forms">Advanced Forms</TabsTrigger>
              <TabsTrigger value="navigation">Navigation</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
              <TabsTrigger value="data">Data Display</TabsTrigger>
              <TabsTrigger value="business">Business</TabsTrigger>
              <TabsTrigger value="overlays">Overlays</TabsTrigger>
            </TabsList>
          </div>

          {/* Advanced Forms Tab */}
          <TabsContent value="forms" className="space-y-8">
            <Section>
              <h2 className="text-2xl font-bold mb-6">Advanced Form Components</h2>
              
              <Grid cols={2} gap={6} className="mb-8">
                <GridItem>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CalendarIcon className="h-5 w-5" />
                        Date Pickers
                      </CardTitle>
                      <CardDescription>Single date and date range selection</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Single Date</label>
                        <DatePicker 
                          date={selectedDate} 
                          onSelect={setSelectedDate}
                          placeholder="Pick a date"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Date Range</label>
                        <DateRangePicker
                          from={dateRange.from}
                          to={dateRange.to}
                          onSelect={setDateRange}
                          placeholder="Pick a date range"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </GridItem>

                <GridItem>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Multi-Select & Combobox
                      </CardTitle>
                      <CardDescription>Advanced selection components</CardDescription>
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
                </GridItem>
              </Grid>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Number Input with Controls
                  </CardTitle>
                  <CardDescription>Advanced number input with increment/decrement buttons</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Grid cols={3} gap={4}>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Basic Number Input</label>
                      <NumberInput
                        value={numberInput.value}
                        onChange={numberInput.onChange}
                        min={0}
                        max={1000}
                        step={10}
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
                  </Grid>
                </CardContent>
              </Card>
            </Section>
          </TabsContent>

          {/* Navigation Tab */}
          <TabsContent value="navigation" className="space-y-8">
            <Section>
              <h2 className="text-2xl font-bold mb-6">Navigation Components</h2>
              
              <Grid cols={1} gap={6}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ChevronRight className="h-5 w-5" />
                      Breadcrumb Navigation
                    </CardTitle>
                    <CardDescription>Hierarchical navigation component</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Breadcrumb>
                      <BreadcrumbList>
                        <BreadcrumbItem>
                          <BreadcrumbLink href="#">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          <BreadcrumbLink href="#">Components</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          <BreadcrumbPage>Navigation</BreadcrumbPage>
                        </BreadcrumbItem>
                      </BreadcrumbList>
                    </Breadcrumb>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Advanced Pagination</CardTitle>
                    <CardDescription>Pagination with info and controls</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <PaginationInfo
                      currentPage={pagination.currentPage}
                      totalPages={pagination.totalPages}
                      totalItems={100}
                      itemsPerPage={10}
                    />
                    <Pagination
                      currentPage={pagination.currentPage}
                      totalPages={pagination.totalPages}
                      onPageChange={pagination.goToPage}
                      showFirstLast
                      size="default"
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Section>
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value="feedback" className="space-y-8">
            <Section>
              <h2 className="text-2xl font-bold mb-6">Feedback & Loading States</h2>
              
              <Grid cols={2} gap={6}>
                <Card>
                  <CardHeader>
                    <CardTitle>Loading Components</CardTitle>
                    <CardDescription>Various loading states and animations</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium mb-2">Default Spinner</p>
                        <LoadingSpinner text="Loading..." />
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-2">Dots Animation</p>
                        <LoadingSpinner variant="dots" text="Processing..." />
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-2">Pulse Animation</p>
                        <LoadingSpinner variant="pulse" size="lg" />
                      </div>
                    </div>
                    <Button onClick={simulateLoading} disabled={isLoading}>
                      {isLoading ? <LoadingSpinner size="sm" /> : "Test Loading"}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Loading Skeletons</CardTitle>
                    <CardDescription>Placeholder loading states</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Text Skeleton</p>
                      <LoadingSkeleton lines={3} />
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Circular Skeleton</p>
                      <LoadingSkeleton variant="circular" />
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Rectangular Skeleton</p>
                      <LoadingSkeleton variant="rectangular" />
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            </Section>
          </TabsContent>

          {/* Data Display Tab */}
          <TabsContent value="data" className="space-y-8">
            <Section>
              <h2 className="text-2xl font-bold mb-6">Advanced Data Components</h2>
              
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Data Table</CardTitle>
                  <CardDescription>
                    Full-featured data table with sorting, filtering, pagination, and export
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DataTableAdvanced
                    columns={tableColumns}
                    data={sampleTableData}
                    searchable
                    filterable
                    exportable
                    selectable
                    onRowSelect={(rows) => console.log("Selected rows:", rows)}
                    onExport={(data) => console.log("Export data:", data)}
                  />
                </CardContent>
              </Card>
            </Section>
          </TabsContent>

          {/* Business Components Tab */}
          <TabsContent value="business" className="space-y-8">
            <Section>
              <h2 className="text-2xl font-bold mb-6">Business Components</h2>
              
              <Card>
                <CardHeader className="text-center">
                  <CardTitle>Pricing Table</CardTitle>
                  <CardDescription>
                    Professional pricing table with billing toggle
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

          {/* Overlays Tab */}
          <TabsContent value="overlays" className="space-y-8">
            <Section>
              <h2 className="text-2xl font-bold mb-6">Overlay Components</h2>
              
              <Grid cols={2} gap={6}>
                <Card>
                  <CardHeader>
                    <CardTitle>Modal Dialog</CardTitle>
                    <CardDescription>Accessible modal with various sizes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={modal.openModal}>Open Modal</Button>
                    <Modal
                      open={modal.open}
                      onClose={modal.closeModal}
                      size="md"
                    >
                      <ModalHeader>
                        <ModalTitle>Example Modal</ModalTitle>
                      </ModalHeader>
                      <ModalBody>
                        <p>This is an example modal with proper accessibility support.</p>
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
                  </CardContent>
                </Card>

                <Card className="relative">
                  <CardHeader>
                    <CardTitle>Loading Overlay</CardTitle>
                    <CardDescription>Full overlay loading state</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={() => setIsLoading(!isLoading)}>
                      Toggle Loading Overlay
                    </Button>
                    <div className="mt-4 p-4 bg-muted rounded relative min-h-[100px]">
                      <p>Content behind the overlay</p>
                      <LoadingOverlay 
                        isVisible={isLoading} 
                        text="Loading data..." 
                        variant="dots"
                      />
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            </Section>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <Section className="text-center border-t pt-8">
          <p className="text-muted-foreground">
            Complete showcase of all MoneyMappr UI components • Built with React, TypeScript & Tailwind CSS
          </p>
        </Section>
      </div>
    </Container>
  )
}