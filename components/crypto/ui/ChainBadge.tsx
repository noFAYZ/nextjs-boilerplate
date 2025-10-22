'use client'

import { Badge } from '@/components/ui/badge'
import { ZERION_CHAINS } from '@/lib/constants/chains'
import Image from 'next/image'

interface ChainBadgeProps {
  network: string

  size?: number
  className?: string
}

export function ChainBadge({ network,  size = 14, className = '' }: ChainBadgeProps) {
  const chain = ZERION_CHAINS.find(
    (c) => c.attributes?.name?.toLowerCase() === network.toLowerCase()
  )

  if (!chain) return null



  return (
    <Badge className=' flex items-center gap-1' variant={'outline'} size={'sm'} left={
      <Image
        src={chain.attributes.icon.url}
        alt={chain.attributes.name}
        width={size}
        height={size}
        className="object-contain rounded-2xl"
      />} >
    
     <span className="text-xs font-medium">{chain.attributes.name}</span>
    </Badge>
  )
}
