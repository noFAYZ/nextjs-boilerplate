"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Search,
  Wallet,
  User,
  Bell,
  Settings,
  Moon,
  Sun,
  Globe,
  TrendingUp,
  Shield,
  BarChart3,
  Menu,
  X,
  Copy,
  ExternalLink,
  QrCode,
  Activity,
  Network,
  DollarSign,
  Bitcoin,
  ArrowUpRight,
  ArrowDownRight,
  EarthIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";

const WalletHeader = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [notifications, setNotifications] = useState([
    { id: 1, type: "transaction", message: "Received 0.5 ETH", read: false, value: "+$1,250" },
    { id: 2, type: "alert", message: "BTC price alert triggered", read: true, value: "-2.5%" },
    { id: 3, type: "security", message: "New wallet connection", read: false, value: "New Device" },
  ]);
  const [portfolioValue, setPortfolioValue] = useState({
    crypto: "12.45 ETH",
    fiat: "$24,580.32",
    change: "+2.4%",
  });

  useEffect(() => {
    setMounted(true);
    // Simulate wallet connection
    if (isConnected) {
      setWalletAddress("0x742d35Cc6634C0532925a3b844Bc9e7595f8A1Fc");
    }
  }, [isConnected]);

  const connectWallet = async () => {
    setIsConnected(true);
    setWalletAddress("0x742d...Fc1D");
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress("");
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    // Add toast notification here
  };

  const toggleNotificationRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: !n.read } : n
    ));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="relative h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 p-1">
                <Image
                  src="/logo.png"
                  alt="Arkham Tracker"
                  fill
                  className="object-contain rounded-md"
                />
              </div>
              <span className="hidden font-bold sm:inline-block text-xl">
                Arkham Tracker
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              <Button variant="ghost" className="gap-2 px-4">
                <BarChart3 className="h-4 w-4" />
                <span>Analytics</span>
              </Button>
              <Button variant="ghost" className="gap-2 px-4">
                <TrendingUp className="h-4 w-4" />
                <span>Markets</span>
              </Button>
              <Button variant="ghost" className="gap-2 px-4">
                <Activity className="h-4 w-4" />
                <span>Activity</span>
              </Button>
              <Button variant="ghost" className="gap-2 px-4">
                <Shield className="h-4 w-4" />
                <span>Security</span>
              </Button>
            </nav>
          </div>

          {/* Center Section - Portfolio Value */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{portfolioValue.fiat}</div>
              <div className="flex items-center justify-center gap-1 text-sm">
                {portfolioValue.change.startsWith('+') ? 
                  <ArrowUpRight className="h-4 w-4 text-green-500" /> : 
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                }
                <span className={portfolioValue.change.startsWith('+') ? "text-green-500" : "text-red-500"}>
                  {portfolioValue.change}
                </span>
                <span className="text-muted-foreground">24h</span>
              </div>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-sm text-muted-foreground">
              {portfolioValue.crypto}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search wallets, addresses..."
                  className="pl-10 w-64"
                />
              </div>
            </div>

            {/* Network Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Network className="h-4 w-4" />
                  <span>Ethereum</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <EarthIcon className="mr-2 h-4 w-4" />
                  Ethereum
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bitcoin className="mr-2 h-4 w-4" />
                  Bitcoin
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Network className="mr-2 h-4 w-4" />
                  Solana
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex justify-between items-center">
                  <span>Notifications</span>
                  <span className="text-xs text-muted-foreground">{unreadCount} unread</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-muted-foreground">
                    No notifications
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className="flex-col items-start p-4"
                      onClick={() => toggleNotificationRead(notification.id)}
                    >
                      <div className="flex w-full justify-between items-start">
                        <div>
                          <span className="font-medium">{notification.message}</span>
                          {!notification.read && (
                            <span className="h-2 w-2 rounded-full bg-primary ml-2 inline-block"></span>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          2h ago
                        </span>
                      </div>
                      <div className="flex items-center justify-between w-full mt-2">
                        <span className={`text-sm font-medium ${notification.value.startsWith('+') ? "text-green-500" : "text-red-500"}`}>
                          {notification.value}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {notification.type}
                        </span>
                      </div>
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Wallet Connection */}
            {isConnected ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Wallet className="h-4 w-4" />
                    <span className="hidden sm:inline">{walletAddress}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Wallet className="h-5 w-5 text-primary" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">Connected Wallet</div>
                        <div className="text-xs text-muted-foreground">{walletAddress}</div>
                      </div>
                    </div>
                    <div className="text-sm font-medium">{portfolioValue.fiat}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={copyAddress}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Address
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <QrCode className="mr-2 h-4 w-4" />
                    Show QR Code
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View on Explorer
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={disconnectWallet}>
                    Disconnect Wallet
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={connectWallet} className="gap-2">
                <Wallet className="h-4 w-4" />
                <span>Connect Wallet</span>
              </Button>
            )}

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {mounted && theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* User Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Globe className="mr-2 h-4 w-4" />
                  Language
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Sign Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle>Navigation</SheetTitle>
                  <SheetDescription>
                    Access all features and settings
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-8 space-y-4">
                  <div className="text-center py-4 border-b">
                    <div className="text-2xl font-bold">{portfolioValue.fiat}</div>
                    <div className="text-sm text-muted-foreground">
                      {portfolioValue.crypto}
                    </div>
                  </div>
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Analytics
                  </Button>
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Markets
                  </Button>
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <Activity className="h-4 w-4" />
                    Activity
                  </Button>
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <Shield className="h-4 w-4" />
                    Security
                  </Button>
                  <div className="border-t pt-4 mt-4">
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <Settings className="h-4 w-4" />
                      Settings
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <Globe className="h-4 w-4" />
                      Language
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default WalletHeader;