"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Camera,
  Shield,
  Bell,
  CreditCard,
  Zap,
  Star,
  Crown,
  Check,
  X,
  Upload,
  Download,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  Settings,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const profileVariants = cva(
  "transition-all duration-200",
  {
    variants: {
      variant: {
        default: "",
        compact: "space-y-4",
        detailed: "space-y-6",
        card: "p-6 border rounded-lg",
      },
      size: {
        sm: "max-w-md",
        default: "max-w-2xl",
        lg: "max-w-4xl",
        full: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface UserData {
  id: string
  name: string
  email: string
  avatar?: string
  phone?: string
  location?: string
  timezone?: string
  bio?: string
  website?: string
  joinDate: Date
  lastActive: Date
  plan: "free" | "pro" | "ultimate"
  isVerified: boolean
  settings: {
    notifications: {
      email: boolean
      push: boolean
      sms: boolean
      marketing: boolean
    }
    privacy: {
      profilePublic: boolean
      showActivity: boolean
      showBalance: boolean
    }
    preferences: {
      currency: string
      language: string
      theme: "light" | "dark" | "system"
    }
  }
  stats: {
    walletsConnected: number
    totalValue: number
    accountsLinked: number
    transactionsTracked: number
  }
}

interface UserProfileProps extends VariantProps<typeof profileVariants> {
  user: UserData
  editable?: boolean
  showStats?: boolean
  showSettings?: boolean
  className?: string
  onUpdate?: (data: Partial<UserData>) => void
  onUploadAvatar?: (file: File) => void
  onDeleteAccount?: () => void
}

function PlanBadge({ plan }: { plan: string }) {
  const configs = {
    free: { label: "Free", icon: User, className: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200" },
    pro: { label: "Pro", icon: Zap, className: "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200" },
    ultimate: { label: "Ultimate", icon: Crown, className: "bg-gradient-to-r from-purple-500 to-pink-500 text-white" },
  }
  
  const config = configs[plan as keyof typeof configs] || configs.free
  const Icon = config.icon

  return (
    <Badge className={cn("gap-1", config.className)}>
      <Icon className="size-3" />
      {config.label}
    </Badge>
  )
}

function ProfileHeader({ user, editable, onUpdate, onUploadAvatar }: {
  user: UserData
  editable?: boolean
  onUpdate?: (data: Partial<UserData>) => void
  onUploadAvatar?: (file: File) => void
}) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [editData, setEditData] = React.useState({
    name: user.name,
    bio: user.bio || "",
    website: user.website || "",
    location: user.location || "",
  })
  
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleSave = () => {
    onUpdate?.(editData)
    setIsEditing(false)
  }

  const handleAvatarClick = () => {
    if (editable) {
      fileInputRef.current?.click()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onUploadAvatar?.(file)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          {/* Avatar */}
          <div className="relative">
            <Avatar 
              className={cn(
                "size-24 cursor-pointer",
                editable && "hover:opacity-80 transition-opacity"
              )}
              onClick={handleAvatarClick}
            >
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-2xl">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {editable && (
              <Button
                size="sm"
                variant="secondary"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                onClick={handleAvatarClick}
              >
                <Camera className="size-3" />
              </Button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* User Info */}
          <div className="flex-1 space-y-4">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={editData.name}
                    onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={editData.bio}
                    onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell us about yourself..."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={editData.website}
                      onChange={(e) => setEditData(prev => ({ ...prev, website: e.target.value }))}
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={editData.location}
                      onChange={(e) => setEditData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="City, Country"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave}>Save Changes</Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold">{user.name}</h1>
                  <PlanBadge plan={user.plan} />
                  {user.isVerified && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Check className="size-5 text-blue-500 bg-blue-100 rounded-full p-1" />
                        </TooltipTrigger>
                        <TooltipContent>Verified Account</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="size-4" />
                  <span>{user.email}</span>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Copy className="size-3" />
                  </Button>
                </div>

                {user.bio && (
                  <p className="text-muted-foreground">{user.bio}</p>
                )}

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {user.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="size-4" />
                      <span>{user.location}</span>
                    </div>
                  )}
                  {user.website && (
                    <div className="flex items-center gap-1">
                      <ExternalLink className="size-4" />
                      <a 
                        href={user.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-foreground"
                      >
                        {user.website.replace(/^https?:\/\//, "")}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="size-4" />
                    <span>Joined {user.joinDate.toLocaleDateString()}</span>
                  </div>
                </div>

                {editable && (
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    <Edit className="mr-2 size-4" />
                    Edit Profile
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ProfileStats({ stats }: { stats: UserData["stats"] }) {
  const statItems = [
    { label: "Wallets Connected", value: stats.walletsConnected, icon: CreditCard },
    { label: "Total Value", value: `$${stats.totalValue.toLocaleString()}`, icon: Star },
    { label: "Accounts Linked", value: stats.accountsLinked, icon: User },
    { label: "Transactions", value: stats.transactionsTracked.toLocaleString(), icon: Zap },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statItems.map((item) => (
            <div key={item.label} className="text-center space-y-2">
              <div className="size-12 mx-auto rounded-full bg-muted flex items-center justify-center">
                <item.icon className="size-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{item.value}</p>
                <p className="text-sm text-muted-foreground">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function ProfileSettings({ user, onUpdate }: {
  user: UserData
  onUpdate?: (data: Partial<UserData>) => void
}) {
  const [settings, setSettings] = React.useState(user.settings)

  const updateSetting = (path: string, value: boolean | string) => {
    const keys = path.split(".")
    const newSettings = { ...settings }
    let current: Record<string, unknown> = newSettings as Record<string, unknown>
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]]
    }
    
    current[keys[keys.length - 1]] = value
    setSettings(newSettings)
    onUpdate?.({ settings: newSettings })
  }

  return (
    <div className="space-y-6">
      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="size-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Choose how you want to be notified about account activity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground">Receive notifications via email</p>
            </div>
            <Switch
              checked={settings.notifications.email}
              onCheckedChange={(checked) => updateSetting("notifications.email", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Push Notifications</p>
              <p className="text-sm text-muted-foreground">Receive push notifications in browser</p>
            </div>
            <Switch
              checked={settings.notifications.push}
              onCheckedChange={(checked) => updateSetting("notifications.push", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">SMS Notifications</p>
              <p className="text-sm text-muted-foreground">Receive important alerts via SMS</p>
            </div>
            <Switch
              checked={settings.notifications.sms}
              onCheckedChange={(checked) => updateSetting("notifications.sms", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Marketing Emails</p>
              <p className="text-sm text-muted-foreground">Receive product updates and tips</p>
            </div>
            <Switch
              checked={settings.notifications.marketing}
              onCheckedChange={(checked) => updateSetting("notifications.marketing", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="size-5" />
            Privacy & Security
          </CardTitle>
          <CardDescription>
            Control who can see your information and activity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Public Profile</p>
              <p className="text-sm text-muted-foreground">Allow others to find your profile</p>
            </div>
            <Switch
              checked={settings.privacy.profilePublic}
              onCheckedChange={(checked) => updateSetting("privacy.profilePublic", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Show Activity</p>
              <p className="text-sm text-muted-foreground">Display recent transaction activity</p>
            </div>
            <Switch
              checked={settings.privacy.showActivity}
              onCheckedChange={(checked) => updateSetting("privacy.showActivity", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Show Balance</p>
              <p className="text-sm text-muted-foreground">Display portfolio balance publicly</p>
            </div>
            <Switch
              checked={settings.privacy.showBalance}
              onCheckedChange={(checked) => updateSetting("privacy.showBalance", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="size-5" />
            Preferences
          </CardTitle>
          <CardDescription>
            Customize your experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={settings.preferences.currency}
                onValueChange={(value) => updateSetting("preferences.currency", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="JPY">JPY (¥)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="language">Language</Label>
              <Select
                value={settings.preferences.language}
                onValueChange={(value) => updateSetting("preferences.language", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="theme">Theme</Label>
              <Select
                value={settings.preferences.theme}
                onValueChange={(value) => updateSetting("preferences.theme", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function UserProfile({
  user,
  editable = false,
  showStats = true,
  showSettings = false,
  variant,
  size,
  className,
  onUpdate,
  onUploadAvatar,
  onDeleteAccount,
}: UserProfileProps) {
  return (
    <div className={cn(profileVariants({ variant, size }), className)}>
      <ProfileHeader
        user={user}
        editable={editable}
        onUpdate={onUpdate}
        onUploadAvatar={onUploadAvatar}
      />

      {showStats && (
        <ProfileStats stats={user.stats} />
      )}

      {showSettings && (
        <ProfileSettings user={user} onUpdate={onUpdate} />
      )}

      {editable && (
        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible and destructive actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive">Delete Account</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Account</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove all your data from our servers.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button variant="destructive" onClick={onDeleteAccount}>
                    Yes, delete my account
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export { profileVariants }
export type { UserProfileProps, UserData }