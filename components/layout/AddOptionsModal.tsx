"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Wallet,
  CreditCard,
  Building2,
  TrendingUp,
  Coins,
  DollarSign,
  ArrowRightLeft,
  PiggyBank,
  Target,
  Landmark,
  Globe
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AddOption {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  category: "crypto" | "banking" | "investment" | "goal"
  href: string
  badge?: string
  popular?: boolean
}

const ADD_OPTIONS: AddOption[] = [
  // Crypto Options
  {
    id: "crypto-wallet",
    title: "Crypto Wallet",
    description: "Connect Bitcoin, Ethereum, and other cryptocurrency wallets",
    icon: <Coins className="w-5 h-5" />,
    category: "crypto",
    href: "/crypto/wallets/add",
    popular: true
  },
  {
    id: "exchange-account",
    title: "Exchange Account",
    description: "Connect Binance, Coinbase, Kraken, and other exchanges",
    icon: <ArrowRightLeft className="w-5 h-5" />,
    category: "crypto",
    href: "/crypto/exchanges/add"
  },
  
  // Banking Options
  {
    id: "bank-account",
    title: "Bank Account",
    description: "Connect your checking and savings accounts",
    icon: <Landmark className="w-5 h-5" />,
    category: "banking",
    href: "/accounts/bank/add",
    popular: true
  },
  {
    id: "credit-card",
    title: "Credit Card",
    description: "Add credit cards to track spending and payments",
    icon: <CreditCard className="w-5 h-5" />,
    category: "banking",
    href: "/accounts/cards/add"
  },
  {
    id: "digital-wallet",
    title: "Digital Wallet",
    description: "Connect PayPal, Apple Pay, Google Pay, and more",
    icon: <Wallet className="w-5 h-5" />,
    category: "banking",
    href: "/accounts/digital/add"
  },
  
  // Investment Options
  {
    id: "investment-account",
    title: "Investment Account",
    description: "Connect brokerages like Robinhood, E*TRADE, TD Ameritrade",
    icon: <TrendingUp className="w-5 h-5" />,
    category: "investment",
    href: "/accounts/investments/add"
  },
  {
    id: "retirement-account",
    title: "Retirement Account",
    description: "Add 401(k), IRA, Roth IRA, and other retirement accounts",
    icon: <PiggyBank className="w-5 h-5" />,
    category: "investment",
    href: "/accounts/retirement/add"
  },
  
  // Goal Options
  {
    id: "savings-goal",
    title: "Savings Goal",
    description: "Set and track financial goals like emergency fund, vacation",
    icon: <Target className="w-5 h-5" />,
    category: "goal",
    href: "/goals/add"
  },
  {
    id: "budget-category",
    title: "Budget Category",
    description: "Create custom spending categories and limits",
    icon: <DollarSign className="w-5 h-5" />,
    category: "goal",
    href: "/dashboard/budgets/add"
  }
]

const CATEGORY_COLORS = {
  crypto: "bg-orange-500/10 text-orange-700 dark:text-orange-300",
  banking: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  investment: "bg-green-500/10 text-green-700 dark:text-green-300",
  goal: "bg-purple-500/10 text-purple-700 dark:text-purple-300"
}

const CATEGORY_LABELS = {
  crypto: "Crypto",
  banking: "Banking",
  investment: "Investment",
  goal: "Goals"
}

interface AddOptionsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddOptionsModal({ open, onOpenChange }: AddOptionsModalProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const router = useRouter()

  // Filter options based on search query
  const filteredOptions = React.useMemo(() => {
    if (!searchQuery.trim()) return ADD_OPTIONS

    const query = searchQuery.toLowerCase()
    return ADD_OPTIONS.filter(option =>
      option.title.toLowerCase().includes(query) ||
      option.description.toLowerCase().includes(query) ||
      CATEGORY_LABELS[option.category].toLowerCase().includes(query)
    )
  }, [searchQuery])

  // Group by category
  const groupedOptions = React.useMemo(() => {
    const groups: Record<string, AddOption[]> = {}
    filteredOptions.forEach(option => {
      if (!groups[option.category]) {
        groups[option.category] = []
      }
      groups[option.category].push(option)
    })
    return groups
  }, [filteredOptions])

  const handleOptionClick = (option: AddOption) => {
    router.push(option.href)
    onOpenChange(false)
    setSearchQuery("") // Reset search when closing
  }

  const handleClose = () => {
    onOpenChange(false)
    setSearchQuery("") // Reset search when closing
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Add Account or Asset
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 flex-1 min-h-0">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground z-40" />
            <Input
              placeholder="Search wallets, accounts, exchanges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Options Grid */}
          <div className="flex-1 space-y-6">
            {Object.entries(groupedOptions).map(([category, options]) => (
              <div key={category}>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                    {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]}
                  </h3>
                  <div className="flex-1 h-px bg-border" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {options.map((option) => (
                    <Card
                      key={option.id}
                      className={cn(
                        "p-4 cursor-pointer transition-all duration-0 hover:shadow-md border",
                        "hover:scale-[1.02] active:scale-[0.98]",
                        "hover:border-primary/20"
                      )}
                      onClick={() => handleOptionClick(option)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "p-2 rounded-lg",
                          CATEGORY_COLORS[option.category]
                        )}>
                          {option.icon}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm truncate">
                              {option.title}
                            </h4>
                            {option.popular && (
                              <Badge variant="secondary" className="text-xs px-1.5 py-0">
                                Popular
                              </Badge>
                            )}
                            {option.badge && (
                              <Badge variant="outline" className="text-xs px-1.5 py-0">
                                {option.badge}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {option.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
            
            {filteredOptions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Globe className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No options found for "{searchQuery}"</p>
                <p className="text-xs mt-1">Try searching for wallet, account, or exchange</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}