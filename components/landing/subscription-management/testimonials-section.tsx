"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { TwitterIcon } from "lucide-react"
import { ScrollReveal } from "../scroll-reveal"

interface Testimonial {
  image: string
  name: string
  username: string
  text: string
  social: string
}

interface TestimonialsProps {
  testimonials: Testimonial[]
  className?: string
  title?: string
  description?: string
  maxDisplayed?: number
}

export function Testimonials({
  testimonials,
  className,
  title = "Read what people are saying",
  description = "Dummy feedback from virtual customers using our component library.",
  maxDisplayed = 5,
}: TestimonialsProps) {
  const [showAll, setShowAll] = useState(false)

  const openInNewTab = (url: string) => {
    window.open(url, "_blank")?.focus()
  }

  return (
    <div className={className}>
   

      <ScrollReveal>
       
          
       <div className="relative max-w-xl mx-auto  mb-8 text-center">
     <div className="mx-auto  text-center ">
       <h2 className="text-3xl md:text-4xl font-bold mb-4">
       {title}   </h2>
       <p className="text-sm md:text-base text-muted-foreground">
       {description.split("<br />").map((line, i) => (
              <span key={i}>
                {line}
                {i !== description.split("<br />").length - 1 && <br />}
              </span>
            ))}    </p>
     </div>
   </div>


     </ScrollReveal>

      <div className="relative">
        <div
          className={cn(
            "flex justify-center items-center gap-5 flex-wrap",
            !showAll &&
              testimonials.length > maxDisplayed &&
              "max-h-[720px] overflow-hidden",
          )}
        >
          {testimonials
            .slice(0, showAll ? undefined : maxDisplayed)
            .map((testimonial, index) => (
              <Card
                key={index}
                className="w-80 h-auto p-5 relative bg-card border-border"
              >
                <div className="flex items-center">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                  <div className="flex flex-col pl-4">
                    <span className="font-semibold text-base">
                      {testimonial.name}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {testimonial.username}
                    </span>
                  </div>
                </div>
                <div className="mt-5 mb-5">
                  <p className="text-foreground font-medium">
                    {testimonial.text}
                  </p>
                </div>
                <button
                  onClick={() => openInNewTab(testimonial.social)}
                  className="absolute top-4 right-4 hover:opacity-80 transition-opacity"
                >
                  <TwitterIcon className="h-4 w-4" aria-hidden="true" />
                </button>
              </Card>
            ))}
        </div>

        {testimonials.length > maxDisplayed && !showAll && (
          <>
            <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-background to-transparent" />
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20">
              <Button variant="secondary" onClick={() => setShowAll(true)}>
                Load More
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
const testimonials = [
  {
    image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    text: 'This app finally gave me a single place to track both my traditional accounts and my crypto wallets. The clarity it brings to my finances is unmatched.',
    name: 'Alice Johnson',
    username: '@alicejohnson',
    social: 'https://i.imgur.com/VRtqhGC.png'
  },
  {
    image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    text: 'Our team adopted this app internally, and the ability to link banks, exchanges, and cold wallets in one dashboard has transformed how we manage budgets.',
    name: 'David Smith',
    username: '@davidsmith',
    social: 'https://i.imgur.com/VRtqhGC.png'
  },
  {
    image: 'https://i.imgur.com/kaDy9hV.jpeg',
    text: 'The budgeting tools are intuitive, and the real-time crypto tracking is a huge bonus. It’s easily the most complete finance manager I’ve used.',
    name: 'Emma Brown',
    username: '@emmabrown',
    social: 'https://i.imgur.com/VRtqhGC.png'
  },
  {
    image: 'https://i.imgur.com/cRwFxtE.png',
    text: 'This app helped standardize financial reporting across my projects. I especially appreciate the accuracy of the exchange balance updates.',
    name: 'James Wilson',
    username: '@jameswilson',
    social: 'https://i.imgur.com/VRtqhGC.png'
  },
  {
    image: 'https://i.imgur.com/TQIqsob.png',
    text: 'The seamless integration with crypto accounts is a game-changer. I can finally see my entire net worth—including on-chain assets—at a glance.',
    name: 'Sophia Lee',
    username: '@sophialee',
    social: 'https://i.imgur.com/VRtqhGC.png'
  },
  {
    image: 'https://i.imgur.com/3ROmJ0S.png',
    text: 'I’ve tried several finance apps, but none handled both DeFi and bank accounts this well. Everything updates instantly and just works.',
    name: 'Michael Davis',
    username: '@michaeldavis',
    social: 'https://i.imgur.com/VRtqhGC.png'
  },
  {
    image: 'https://i.imgur.com/6fKCuVC.png',
    text: 'Whether I’m on my laptop or phone, the app feels fast and reliable. The cross-device syncing for crypto data is extremely impressive.',
    name: 'Emily Chen',
    username: '@emilychen',
    social: 'https://i.imgur.com/VRtqhGC.png'
  },
  {
    image: 'https://i.imgur.com/Jjqe7St.png',
    text: 'Customizing categories and dashboards for both fiat and crypto spending has made tracking my habits actually enjoyable.',
    name: 'Robert Lee',
    username: '@robertlee',
    social: 'https://i.imgur.com/VRtqhGC.png'
  },
  {
    image: 'https://i.imgur.com/bG88vHI.png',
    text: 'The documentation is excellent, and the setup was effortless. Connecting banks, exchanges, and wallets took minutes instead of hours.',
    name: 'Sarah Taylor',
    username: '@sarahtaylor',
    social: 'https://i.imgur.com/VRtqhGC.png'
  },
  {
    image: 'https://i.imgur.com/tjmS77j.png',
    text: 'The attention to detail is clear throughout the experience. The visual net worth graphs for both fiat and crypto are especially well-designed.',
    name: 'Kevin White',
    username: '@kevinwhite',
    social: 'https://i.imgur.com/VRtqhGC.png'
  },
  {
    image: 'https://i.imgur.com/yTsomza.png',
    text: 'I love how easily the app integrates with my existing setup. From centralized exchanges to cold wallets, everything syncs without issues.',
    name: 'Rachel Patel',
    username: '@rachelpatel',
    social: 'https://i.imgur.com/VRtqhGC.png'
  },
  {
    image: 'https://i.imgur.com/pnsLqpq.png',
    text: 'It’s rare to find a finance management app this thorough. The crypto support is not an afterthought—it’s built into every part of the product.',
    name: 'Brian Kim',
    username: '@briankim',
    social: 'https://i.imgur.com/VRtqhGC.png'
  }
];

  
  export function TestimonialsDemo() {
    return (
      <div className="max-w-7xl mx-auto py-10">
        <Testimonials testimonials={testimonials} />
      </div>
    )
  }