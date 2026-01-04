import { GameIconsUpgrade } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Crown } from 'lucide-react'
import router from 'next/router'
 

const UpgradeBanner = ({isExpanded}) => {
  return (
    <div className="w-full  space-y-2 ">
    {isExpanded ? (
      <Card className="  border shadow-none  ">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted border ">
              <GameIconsUpgrade className="h-4.5 w-4.5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-foreground">Upgrade to Pro</h3>
             {/*  <p className="text-[11px] text-muted-foreground">Unlock advanced features</p> */}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <span className="text-[10px] text-muted-foreground font-medium">14-day free trial</span>
            <Button
              size="xs"
              className="  h-6 text-[10px] px-2 font-semibold"
              onClick={() => router.push('/subscription')}
            >
              Upgrade
            </Button>
          </div>
        </div>
      </Card>
    ) : (
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 mx-auto rounded-lg bg-primary/5 hover:bg-primary/10 border border-primary/20 group relative"
        onClick={() => router.push('/subscription')}
      >
        <Crown className="h-4.5 w-4.5 text-primary" />

        {/* Tooltip */}
        <div className="absolute left-full ml-2 px-3 py-2.5 bg-popover text-popover-foreground text-xs rounded-lg shadow-lg border border-border opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 min-w-[180px]">
          <div className="space-y-2">
            <div className="font-semibold text-xs flex items-center gap-2 pb-2 border-b border-border">
              <Crown className="h-3.5 w-3.5" />
              Upgrade to Pro
            </div>
            <ul className="space-y-1.5 text-[11px] text-muted-foreground">
              <li>• Advanced Analytics</li>
              <li>• API Access</li>
              <li>• Priority Support</li>
            </ul>
            <div className="text-[10px] font-medium border-t border-border pt-2">
              14-day free trial available
            </div>
          </div>
        </div>
      </Button>
    )}
      

  </div>  

  )
}

export default UpgradeBanner