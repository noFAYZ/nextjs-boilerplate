"use client"
import * as React from "react"

import { Home, User, Search, Heart, Bell, Settings, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { IconTabsList, IconTabsTrigger, StepIndicator, Tabs, TabsContent } from "../ui/tabs"

// Sample content component for tab panels
const TabPanelContent = ({ title }: { title: string }) => (
  <div className="p-6 bg-background rounded-lg shadow-sm">
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground">
      This is a sample content for the {title} tab. Customize this content as needed for your application.
    </p>
  </div>
)

// Main showcase component
const TabsShowcase: React.FC = () => {
  const variants = [
    "default",
    "floating",
    "segmented",
    "steps",
    "sidebar",
    "card",
    "minimal",
    "pill",
    "badge",
    "progress",
    "animated",
    "floatingAction",
    "iconOnly",
    "stacked",
    "timeline",
    "glass",
    "hologram",
    "cyber",
    "gradient",
    "neumorphic",
  ]

  const sizes = ["sm", "default", "lg", "xl"]

  return (
    <div className="p-8  min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center">Tabs Component Showcase</h1>
      
      {variants.map((variant) => (
        <div key={variant} className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 capitalize">{variant} Variant</h2>
          
          {/* Horizontal Tabs */}
          <div className="mb-8">
            <h3 className="text-xl font-medium mb-2">Horizontal Orientation</h3>
            <Tabs defaultValue="tab1" orientation="horizontal">
              <IconTabsList variant={variant} size="default">
                <IconTabsTrigger value="tab1" icon={<Home className="w-4 h-4" />}>
                  Home
                </IconTabsTrigger>
                <IconTabsTrigger value="tab2" icon={<User className="w-4 h-4" />} badge="3">
                  Profile
                </IconTabsTrigger>
                <IconTabsTrigger value="tab3" icon={<Search className="w-4 h-4" />}>
                  Search
                </IconTabsTrigger>
              </IconTabsList>
              <TabsContent value="tab1">
                <TabPanelContent title="Home" />
              </TabsContent>
              <TabsContent value="tab2">
                <TabPanelContent title="Profile" />
              </TabsContent>
              <TabsContent value="tab3">
                <TabPanelContent title="Search" />
              </TabsContent>
            </Tabs>
          </div>

          {/* Vertical Tabs (for applicable variants) */}
          {(variant === "sidebar" || variant === "timeline") && (
            <div className="mb-8">
              <h3 className="text-xl font-medium mb-2">Vertical Orientation</h3>
              <Tabs defaultValue="tab1" orientation="vertical" className="flex">
                <IconTabsList variant={variant} size="default" orientation="vertical">
                  <IconTabsTrigger value="tab1" icon={<Home className="w-4 h-4" />}>
                    Home
                  </IconTabsTrigger>
                  <IconTabsTrigger value="tab2" icon={<User className="w-4 h-4" />} badge="3">
                    Profile
                  </IconTabsTrigger>
                  <IconTabsTrigger value="tab3" icon={<Search className="w-4 h-4" />}>
                    Search
                  </IconTabsTrigger>
                </IconTabsList>
                <div className="flex-1">
                  <TabsContent value="tab1">
                    <TabPanelContent title="Home" />
                  </TabsContent>
                  <TabsContent value="tab2">
                    <TabPanelContent title="Profile" />
                  </TabsContent>
                  <TabsContent value="tab3">
                    <TabPanelContent title="Search" />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          )}

          {/* Steps Variant Specific Showcase */}
          {variant === "steps" && (
            <div className="mb-8">
              <h3 className="text-xl font-medium mb-2">Steps Variant with Indicators</h3>
              <Tabs defaultValue="step1">
                <IconTabsList variant="steps">
                  <IconTabsTrigger value="step1">
                    <StepIndicator step={1} completed={true} />
                    Step 1
                  </IconTabsTrigger>
                  <IconTabsTrigger value="step2">
                    <StepIndicator step={2} completed={false} />
                    Step 2
                  </IconTabsTrigger>
                  <IconTabsTrigger value="step3">
                    <StepIndicator step={3} completed={false} />
                    Step 3
                  </IconTabsTrigger>
                </IconTabsList>
                <TabsContent value="step1">
                  <TabPanelContent title="Step 1" />
                </TabsContent>
                <TabsContent value="step2">
                  <TabPanelContent title="Step 2" />
                </TabsContent>
                <TabsContent value="step3">
                  <TabPanelContent title="Step 3" />
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Icon-Only Variant Specific Showcase */}
          {variant === "iconOnly" && (
            <div className="mb-8">
              <h3 className="text-xl font-medium mb-2">Icon-Only Variant</h3>
              <Tabs defaultValue="tab1">
                <IconTabsList variant="iconOnly">
                  <IconTabsTrigger value="tab1" icon={<Home className="w-4 h-4" />} />
                  <IconTabsTrigger value="tab2" icon={<User className="w-4 h-4" />} badge="3" />
                  <IconTabsTrigger value="tab3" icon={<Search className="w-4 h-4" />} />
                </IconTabsList>
                <TabsContent value="tab1">
                  <TabPanelContent title="Home" />
                </TabsContent>
                <TabsContent value="tab2">
                  <TabPanelContent title="Profile" />
                </TabsContent>
                <TabsContent value="tab3">
                  <TabPanelContent title="Search" />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      ))}

      {/* Size Variations Showcase (using default variant) */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Size Variations</h2>
        {sizes.map((size) => (
          <div key={size} className="mb-8">
            <h3 className="text-xl font-medium mb-2 capitalize">{size} Size</h3>
            <Tabs defaultValue="tab1">
              <IconTabsList variant="default" size={size}>
                <IconTabsTrigger value="tab1" icon={<Home className="w-4 h-4" />}>
                  Home
                </IconTabsTrigger>
                <IconTabsTrigger value="tab2" icon={<User className="w-4 h-4" />} badge="3">
                  Profile
                </IconTabsTrigger>
                <IconTabsTrigger value="tab3" icon={<Search className="w-4 h-4" />}>
                  Search
                </IconTabsTrigger>
              </IconTabsList>
              <TabsContent value="tab1">
                <TabPanelContent title="Home" />
              </TabsContent>
              <TabsContent value="tab2">
                <TabPanelContent title="Profile" />
              </TabsContent>
              <TabsContent value="tab3">
                <TabPanelContent title="Search" />
              </TabsContent>
            </Tabs>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TabsShowcase