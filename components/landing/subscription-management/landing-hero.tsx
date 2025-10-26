'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { useTheme } from 'next-themes';
import { WaitlistFormCompact } from '@/components/coming-soon/waitlist-form-compact';
import {
  DuoIconsCreditCard,
  SolarChartSquareBoldDuotone,
  SolarClockCircleBoldDuotone,
  SolarShieldBoldDuotone,
} from '@/components/icons/icons';
import { ScrollReveal } from '../scroll-reveal';
import { Button } from '@/components/ui/button';
import { getLogoUrl } from '@/lib/services/logo-service';

gsap.registerPlugin(MotionPathPlugin);

export function LandingHero() {
  const { theme } = useTheme();
  const svgRef = useRef<SVGSVGElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const [svgDimensions, setSvgDimensions] = useState({ width: 1920, height: 550 });

  // Sample logo URLs from logo.dev (replace with actual API calls or static assets)
  const logos = [
    'https://netflix.com',
    'https://spotify.com',
    'https://apple.com',
    'https://amazon.com',
    'https://adobe.com',
    'https://dropbox.com',
  ];

  useEffect(() => {
    const updateDimensions = () => {
      const svg = svgRef.current;
      const dashboard = dashboardRef.current;
      if (!svg || !dashboard) return;

      // Get viewport width and dashboard position
      const vw = window.innerWidth;
      const dashboardRect = dashboard.getBoundingClientRect();
      const sectionRect = svg.parentElement?.getBoundingClientRect();
      if (!sectionRect) return;

      // Calculate SVG height to end just above dashboard
      const svgTop = sectionRect.top;
      const dashboardTop = dashboardRect.top;
      const relativeHeight = dashboardTop - svgTop + 20; // 20px offset above dashboard
      const height = Math.min(relativeHeight, window.innerHeight * 0.6); // Cap at 60vh

      setSvgDimensions({ width: vw, height });
    };

    // Initial calculation
    updateDimensions();

    // Update on resize
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    const glow = glowRef.current;
    if (!svg || !glow) return;

    const paths = svg.querySelectorAll('.data-line');
    const logoDivs = svg.querySelectorAll('.logo-div');

    // Draw lines
    gsap.set(paths, { strokeDasharray: 1000, strokeDashoffset: 1000 });
    gsap.to(paths, {
      strokeDashoffset: 0,
      duration: 3,
      ease: 'power2.out',
      stagger: 0.3,
    });

    // Animate logo divs continuously along each path
    logoDivs.forEach((logoDiv, i) => {
      const path = paths[i % paths.length];
      const duration = 4 + Math.random() * 2;

      gsap.to(logoDiv, {
        motionPath: {
          path,
          align: path,
          alignOrigin: [0.5, 0.5],
          autoRotate: false,
          start: 0,
          end: 1,
        },
        duration,
        ease: 'none',
        repeat: -1,
        delay: i * 0.5,
        onUpdate: function () {
          const progress = this.progress();
          if (progress > 0.95) {
            gsap.to(glow, {
              opacity: 1,
              scale: 1.2,
              duration: 0.5,
              ease: 'power1.out',
              onComplete: () => {
                gsap.to(glow, {
                  opacity: 0,
                  scale: 1,
                  duration: 0.5,
                  ease: 'power1.in',
                  delay: 0.3,
                });
              },
            });
          }
        },
      });
    });
  }, [svgDimensions]);

  // Dynamic path endpoints based on viewport
  const getPath = (startX: number, startY: number, endX: number, endY: number) => {
    const midX1 = startX + (endX - startX) * 0.3;
    const midX2 = startX + (endX - startX) * 0.6;
    return `M${startX},${startY} C${midX1},${startY + 100} ${midX2},${endY - 100} ${endX},${endY}`;
  };

  return (
    <section className="relative pt-40 pb-32 overflow-hidden">
      {/* === Background Overlays === */}
      <div className="absolute inset-0 bg-gradient-to-b from-background dark:via-muted/50 via-muted to-background" />
      <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-[0.85] bg-[length:80px_80px] " />

      <svg
        ref={svgRef}
        className="absolute top-[150px] left-0 w-full pointer-events-none"
        style={{ height: `${svgDimensions.height}px` }}
        viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
        </defs>

        {/* LEFT → CENTER lines */}
        <path
          className="data-line data-line-left"
          d={getPath(0, svgDimensions.height * 0.2, svgDimensions.width * 0.5, svgDimensions.height)}
          stroke="url(#grad1)"
          strokeWidth="1.5"
          fill="none"
          opacity="0.6"
        />
        <path
          className="data-line data-line-left"
          d={getPath(0, svgDimensions.height * 0.4, svgDimensions.width * 0.49, svgDimensions.height)}
          stroke="url(#grad1)"
          strokeWidth="1.5"
          fill="none"
          opacity="0.5"
        />
        <path
          className="data-line data-line-left"
          d={getPath(0, svgDimensions.height * 0.6, svgDimensions.width * 0.51, svgDimensions.height)}
          stroke="url(#grad1)"
          strokeWidth="1.5"
          fill="none"
          opacity="0.4"
        />

        {/* RIGHT → CENTER lines */}
        <path
          className="data-line data-line-right"
          d={getPath(svgDimensions.width, svgDimensions.height * 0.2, svgDimensions.width * 0.5, svgDimensions.height)}
          stroke="url(#grad1)"
          strokeWidth="1.5"
          fill="none"
          opacity="0.6"
        />
        <path
          className="data-line data-line-right"
          d={getPath(svgDimensions.width, svgDimensions.height * 0.4, svgDimensions.width * 0.49, svgDimensions.height)}
          stroke="url(#grad1)"
          strokeWidth="1.5"
          fill="none"
          opacity="0.5"
        />
        <path
          className="data-line data-line-right"
          d={getPath(svgDimensions.width, svgDimensions.height * 0.6, svgDimensions.width * 0.51, svgDimensions.height)}
          stroke="url(#grad1)"
          strokeWidth="1.5"
          fill="none"
          opacity="0.4"
        />

        {/* Animated Logo Divs */}
        {logos.map((logoUrl, i) => (
          <foreignObject
            key={i}
            x="0"
            y="0"
            width={Math.min(40, svgDimensions.width * 0.025)} // Responsive size: ~1.5vw, max 24px
            height={Math.min(40, svgDimensions.width * 0.025)}
            className="logo-div"
          >
            <div
            className='rounded-full shadow  bg-transparent'
          
            >
              <Image
                src={getLogoUrl(logoUrl)}
                alt={`Logo ${i + 1}`}
                fill
               className='rounded-full'
              />
            </div>
          </foreignObject>
        ))}
      </svg>

      {/* === Main Content === */}
      <div className="relative z-10 mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]"
          >
            Take Control of Your{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
                Subscriptions
              </span>
              <motion.span
                className="absolute -bottom-1 left-0 right-0 h-[6px] bg-orange-200 dark:bg-orange-900/50 rounded-sm"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                style={{ transformOrigin: 'left' }}
              />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mx-auto mt-6 mb-10 max-w-xl text-base md:text-lg text-muted-foreground"
          >
            Track and manage every recurring payment in one place.
            Get smart alerts, spending insights, and predictive analytics — before your money disappears.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <WaitlistFormCompact />
          </motion.div>

          <p className="mt-6 text-xs text-muted-foreground uppercase tracking-wide">
            Unified Billing • AI Insights • Smart Spend Alerts
          </p>
        </div>

        {/* === Dashboard Preview === */}
        <ScrollReveal>
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="relative mt-20 flex justify-center"
          >
            <div
              ref={dashboardRef}
              className="relative w-full max-w-7xl rounded-2xl border border-border/90 bg-background/70 backdrop-blur-lg shadow-2xl overflow-hidden"
            >
              {/* Glow Effect at Top Center */}
              <div
                ref={glowRef}
                className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-[min(3px,0.5vw)] opacity-0 -z-10"
                style={{
                  background: 'radial-gradient(circle, rgba(249, 115, 22, 0.8) 0%, rgba(249, 115, 22, 0) 70%)',
                  pointerEvents: 'none',
                }}
              />

              {/* Browser Frame */}
              <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 border-b border-border/50">
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-400" />
                  <span className="h-3 w-3 rounded-full bg-yellow-400" />
                  <span className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <div className="mx-auto text-xs text-muted-foreground bg-muted rounded-md px-3 py-0.5 w-[220px] truncate">
                  https://app.moneymappr.com
                </div>
              </div>

              {/* Dashboard Image */}
              <div className="relative aspect-[15/10] overflow-hidden">
                {theme && (
                  <Image
                    src={
                      theme === 'dark' || theme === 'dark-pro'
                        ? '/landing/subscription-management-dark.PNG'
                        : '/landing/subscription-management.PNG'
                    }
                    alt="Subscription Management Dashboard"
                    fill
                    className="object-cover"
                    priority
                  />
                )}
              </div>
            </div>
          </motion.div>
        </ScrollReveal>

        {/* === Feature Highlights === */}
        <div className="mt-14 flex flex-wrap justify-center gap-5 text-xs sm:text-sm text-muted-foreground">
          {[
            { Icon: SolarShieldBoldDuotone, label: 'Bank-Level Encryption', color: 'text-green-700' },
            { Icon: SolarClockCircleBoldDuotone, label: 'Instant Alerts', color: 'text-blue-700' },
            { Icon: DuoIconsCreditCard, label: 'Smart Spend Insights', color: 'text-orange-700' },
            { Icon: SolarChartSquareBoldDuotone, label: 'Predictive Analytics', color: 'text-purple-700' },
          ].map(({ Icon, label, color }, i) => (
            <div key={i} className="flex items-center gap-2">
              <Icon className={`h-5 w-5 ${color}`} />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}