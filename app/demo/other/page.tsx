import { CompleteShowcase } from '@/components/demo/complete-showcase'
import { EnhancedShowcase } from '@/components/demo/enhanced-showcase'
import { EnhancedUIShowcase } from '@/components/demo/enhanced-ui-showcase'
import { OrganizedShowcase } from '@/components/demo/organized-showcase'
import UltimateShowcase from '@/components/demo/ultimate-showcase'
import React from 'react'

const page = () => {
  return (
    <div>
        <CompleteShowcase />
        <EnhancedShowcase />
        <EnhancedUIShowcase />
        <UltimateShowcase />
    </div>
  )
}

export default page