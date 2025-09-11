"use client"

import * as React from "react"
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Activity,
  Download,
  Settings,
  Edit,
  Trash2,
  Search,
  Mail,
  Lock,
  User,
  Calendar,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { LoadingButton, useLoadingButton } from "@/components/ui/loading-button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MetricCard, MetricCardGrid } from "@/components/ui/metric-card"
import { DataTable, sortableHeader, actionsCell } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample data for the data table
const sampleData = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    status: "active",
    role: "admin",
    lastSeen: "2024-01-15",
    revenue: 5420.50,
  },
  {
    id: "2", 
    name: "Jane Smith",
    email: "jane@example.com",
    status: "inactive",
    role: "user",
    lastSeen: "2024-01-10",
    revenue: 2315.75,
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com", 
    status: "active",
    role: "user",
    lastSeen: "2024-01-16",
    revenue: 1850.25,
  },
]

const columns = [
  {
    accessorKey: "name",
    header: sortableHeader("Name"),
  },
  {
    accessorKey: "email", 
    header: sortableHeader("Email"),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: any) => {
      const status = row.getValue("status")
      return (
        <Badge variant={status === "active" ? "default" : "secondary"}>
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "role",
    header: sortableHeader("Role"),
    cell: ({ row }: any) => {
      const role = row.getValue("role")
      return (
        <Badge variant={role === "admin" ? "premium" : "outline"}>
          {role}
        </Badge>
      )
    },
  },
  {
    accessorKey: "revenue",
    header: sortableHeader("Revenue"),
    cell: ({ row }: any) => {
      const amount = parseFloat(row.getValue("revenue"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
      return <div className="font-medium">{formatted}</div>
    },
  },
  {
    id: "actions",
    cell: actionsCell(
      (id) => console.log("Edit:", id),
      (id) => console.log("Delete:", id)
    ),
  },
]

export function EnhancedUIShowcase() {
  const [searchValue, setSearchValue] = React.useState("")
  const [passwordValue, setPasswordValue] = React.useState("")
  const loadingButton = useLoadingButton()

  const handleAsyncAction = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    if (Math.random() > 0.5) {
      throw new Error("Simulated error")
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Enhanced UI Showcase</h1>
        <p className="text-muted-foreground">
          Enterprise-grade shadcn/ui components for modern SaaS applications
        </p>
      </div>

      <Tabs defaultValue="buttons" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="buttons">Buttons</TabsTrigger>
          <TabsTrigger value="inputs">Inputs</TabsTrigger>
          <TabsTrigger value="cards">Cards</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="tables">Tables</TabsTrigger>
        </TabsList>

        <TabsContent value="buttons" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Enhanced Buttons</CardTitle>
              <CardDescription>
                Modern button variants with loading states, icons, and enterprise styling
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold mb-3">Variants</h4>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="default">Default</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="destructive">Destructive</Button>
                    <Button variant="success">Success</Button>
                    <Button variant="warning">Warning</Button>
                    <Button variant="premium">Premium</Button>
                    <Button variant="enterprise">Enterprise</Button>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-3">Sizes</h4>
                  <div className="flex items-center gap-2">
                    <Button size="xs">Extra Small</Button>
                    <Button size="sm">Small</Button>
                    <Button size="default">Default</Button>
                    <Button size="lg">Large</Button>
                    <Button size="xl">Extra Large</Button>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-3">With Icons</h4>
                  <div className="flex gap-2">
                    <Button icon={<Download className="size-4" />}>
                      Download
                    </Button>
                    <Button 
                      variant="outline" 
                      icon={<Settings className="size-4" />}
                      iconPosition="right"
                    >
                      Settings
                    </Button>
                    <Button size="icon" variant="outline">
                      <Search className="size-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-3">Loading States</h4>
                  <div className="flex gap-2">
                    <Button loading>Loading...</Button>
                    <Button loading loadingText="Saving...">Save</Button>
                    <LoadingButton
                      loadingState={loadingButton.state}
                      onClick={handleAsyncAction}
                      loadingText="Processing..."
                      successText="Success!"
                      errorText="Failed!"
                    >
                      Async Action
                    </LoadingButton>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inputs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Enhanced Inputs</CardTitle>
              <CardDescription>
                Advanced input components with icons, states, and validation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Default Input</label>
                    <Input placeholder="Enter text..." />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">With Left Icon</label>
                    <Input
                      placeholder="Search..."
                      leftIcon={<Search className="size-4" />}
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      clearable
                      onClear={() => setSearchValue("")}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Password Input</label>
                    <Input
                      type="password"
                      placeholder="Enter password..."
                      leftIcon={<Lock className="size-4" />}
                      value={passwordValue}
                      onChange={(e) => setPasswordValue(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Email Input</label>
                    <Input
                      type="email"
                      placeholder="Enter email..."
                      leftIcon={<Mail className="size-4" />}
                      rightIcon={<CheckCircle className="size-4 text-emerald-500" />}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Variants</label>
                    <div className="space-y-3">
                      <Input variant="default" placeholder="Default" />
                      <Input variant="filled" placeholder="Filled" />
                      <Input variant="underlined" placeholder="Underlined" />
                      <Input variant="premium" placeholder="Premium" />
                      <Input variant="enterprise" placeholder="Enterprise" />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">States</label>
                    <div className="space-y-3">
                      <Input state="default" placeholder="Default state" />
                      <Input 
                        state="success" 
                        placeholder="Success state" 
                        rightIcon={<CheckCircle className="size-4" />}
                      />
                      <Input 
                        state="error" 
                        placeholder="Error state"
                        rightIcon={<XCircle className="size-4" />}
                      />
                      <Input 
                        state="warning" 
                        placeholder="Warning state"
                        rightIcon={<AlertTriangle className="size-4" />}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cards" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Enhanced Cards</CardTitle>
              <CardDescription>
                Modern card variants with enterprise styling and interactive states
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card variant="default">
                  <CardHeader>
                    <CardTitle>Default Card</CardTitle>
                    <CardDescription>Standard card styling</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      This is a default card with standard styling and hover effects.
                    </p>
                  </CardContent>
                </Card>

                <Card variant="elevated">
                  <CardHeader>
                    <CardTitle>Elevated Card</CardTitle>
                    <CardDescription>Enhanced shadow effects</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      This card has enhanced shadow effects for better visual hierarchy.
                    </p>
                  </CardContent>
                </Card>

                <Card variant="outlined">
                  <CardHeader>
                    <CardTitle>Outlined Card</CardTitle>
                    <CardDescription>Strong border emphasis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      This card features a prominent border with hover effects.
                    </p>
                  </CardContent>
                </Card>

                <Card variant="gradient">
                  <CardHeader>
                    <CardTitle>Gradient Card</CardTitle>
                    <CardDescription>Modern gradient background</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Features a subtle gradient background with backdrop blur.
                    </p>
                  </CardContent>
                </Card>

                <Card variant="premium">
                  <CardHeader>
                    <CardTitle>Premium Card</CardTitle>
                    <CardDescription>Premium tier styling</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Designed for premium features with purple/blue gradients.
                    </p>
                  </CardContent>
                </Card>

                <Card variant="enterprise">
                  <CardHeader>
                    <CardTitle>Enterprise Card</CardTitle>
                    <CardDescription>Enterprise-grade appearance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Professional styling suited for enterprise applications.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-semibold mb-3">Interactive Cards</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card variant="default" interactive>
                    <CardHeader>
                      <CardTitle>Interactive Card</CardTitle>
                      <CardDescription>Click me for interaction</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        This card has interactive hover and click effects.
                      </p>
                    </CardContent>
                  </Card>

                  <Card variant="default" loading>
                    <CardHeader>
                      <CardTitle>Loading Card</CardTitle>
                      <CardDescription>Loading state demonstration</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        This card shows the loading pulse animation.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Metric Cards</CardTitle>
              <CardDescription>
                Dashboard-ready metric cards with trends and interactive features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MetricCardGrid className="mb-6">
                <MetricCard
                  title="Total Users"
                  value="2,543"
                  previousValue={2401}
                  description="from last month"
                  icon={<Users className="size-4" />}
                  actions={[
                    { label: "View Details", onClick: () => console.log("View details") },
                    { label: "Export", onClick: () => console.log("Export") },
                  ]}
                />

                <MetricCard
                  title="Revenue"
                  value="$45,230"
                  trend={{
                    value: 12.5,
                    direction: "up",
                    period: "vs last month"
                  }}
                  icon={<DollarSign className="size-4" />}
                  variant="success"
                />

                <MetricCard
                  title="Active Sessions"
                  value="1,234"
                  trend={{
                    value: 5.2,
                    direction: "down",
                    period: "vs yesterday"
                  }}
                  icon={<Activity className="size-4" />}
                  variant="warning"
                />

                <MetricCard
                  title="Conversion Rate"
                  value="3.2%"
                  trend={{
                    value: 0.8,
                    direction: "up",
                    period: "vs last week"
                  }}
                  icon={<TrendingUp className="size-4" />}
                />
              </MetricCardGrid>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MetricCard
                  title="Loading Metric"
                  value="Loading..."
                  loading
                  icon={<Users className="size-4" />}
                />

                <MetricCard
                  title="Premium Metric"
                  value="$12,450"
                  trend={{
                    value: 15.3,
                    direction: "up",
                    period: "this quarter"
                  }}
                  variant="premium"
                  icon={<DollarSign className="size-4" />}
                >
                  <div className="mt-2 text-xs text-muted-foreground">
                    Premium subscription revenue
                  </div>
                </MetricCard>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tables" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Enhanced Data Table</CardTitle>
              <CardDescription>
                Feature-rich data table with sorting, filtering, and pagination
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={sampleData}
                searchable
                searchColumn="users"
                filterable
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}