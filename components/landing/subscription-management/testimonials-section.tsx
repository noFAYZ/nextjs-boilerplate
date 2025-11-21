"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { TwitterIcon } from "lucide-react"

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
  maxDisplayed = 6,
}: TestimonialsProps) {
  const [showAll, setShowAll] = useState(false)

  const openInNewTab = (url: string) => {
    window.open(url, "_blank")?.focus()
  }

  return (
    <div className={className}>
      <div className="flex flex-col items-center justify-center pt-5">
    

        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
          {title}
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
          {description.split("<br />").map((line, i) => (
              <span key={i}>
                {line}
                {i !== description.split("<br />").length - 1 && <br />}
              </span>
            ))}
          </p>
        </div>
      </div>

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
      text: 'I\'m blown away by the versatility of the components in this library. They make UI development a breeze!',
      name: 'Alice Johnson',
      username: '@alicejohnson',
      social: 'https://i.imgur.com/VRtqhGC.png'
    },
    {
      image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      text: 'Using this component library has significantly speed up our development process. The quality and ease of integration are remarkable!',
      name: 'David Smith',
      username: '@davidsmith',
      social: 'https://i.imgur.com/VRtqhGC.png'
    },
    {
      image: 'https://i.imgur.com/kaDy9hV.jpeg',
      text: 'The components in this library are not just well-designed but also highly customizable. It\'s a developer\'s dream!',
      name: 'Emma Brown',
      username: '@emmabrown',
      social: 'https://i.imgur.com/VRtqhGC.png'
    },
    {
      image: 'https://i.imgur.com/cRwFxtE.png',
      text: 'I love  how intuitive and well-documented this component library is. It has significantly improved our UI consistency across projects.',
      name: 'James Wilson',
      username: '@jameswilson',
      social: 'https://i.imgur.com/VRtqhGC.png'
    },
    {
      image: 'https://i.imgur.com/TQIqsob.png',
      text: 'Implementing this component library was a game-changer for our team. It has elevated our product\'s UI to a whole new level!',
      name: 'Sophia Lee',
      username: '@sophialee',
      social: 'https://i.imgur.com/VRtqhGC.png'
    },
    {
      image: 'https://i.imgur.com/3ROmJ0S.png',
      text: 'Using this library has been a game-changer for our product development.',
      name: 'Michael Davis',
      username: '@michaeldavis',
      social: 'https://i.imgur.com/VRtqhGC.png'
    },
    {
      image: 'https://i.imgur.com/6fKCuVC.png',
      text: 'The components are highly responsive and work seamlessly across different devices and screen sizes.',
      name: 'Emily Chen',
      username: '@emilychen',
      social: 'https://i.imgur.com/VRtqhGC.png'
    },
    {
      image: 'https://i.imgur.com/Jjqe7St.png',
      text: 'I love how easy it is to customize the components  to fit our brand\'s style. The design is clean and modern.',
      name: 'Robert Lee',
      username: '@robertlee',
      social: 'https://i.imgur.com/VRtqhGC.png'
    },
    {
      image: 'https://i.imgur.com/bG88vHI.png',
      text: 'This library has saved us a significant amount of time and effort. The components are well-documented and easy to integrate.',
      name: 'Sarah Taylor',
      username: '@sarahtaylor',
      social: 'https://i.imgur.com/VRtqhGC.png'
    },
    {
      image: 'https://i.imgur.com/tjmS77j.png',
      text: 'I appreciate the attention to detail in the design. The components are visually appealing and professional.',
      name: 'Kevin White',
      username: '@kevinwhite',
      social: 'https://i.imgur.com/VRtqhGC.png'
    },
    {
      image: 'https://i.imgur.com/yTsomza.png',
      text: 'The components are highly customizable and can be easily integrated with our existing UI framework.',
      name: 'Rachel Patel',
      username: '@rachelpatel',
      social: 'https://i.imgur.com/VRtqhGC.png'
    },
    {
      image: 'https://i.imgur.com/pnsLqpq.png',
      text: 'I love how the components are designed to be highly responsive and work well across different screen sizes.',
      name: 'Brian Kim',
      username: '@briankim',
      social: 'https://i.imgur.com/VRtqhGC.png'
    }
  ];
  
  export function TestimonialsDemo() {
    return (
      <div className="container mx-auto py-10">
        <Testimonials testimonials={testimonials} />
      </div>
    )
  }