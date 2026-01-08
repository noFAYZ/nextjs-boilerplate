import React from "react";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { WalletLogoIconOpenRed } from "../icons/icons";
import { cn } from "@/lib/utils";

const FeatureSection = ({
    title,
    description,
    buttonText,
    buttonLink,
    mainImage,
    floatingImage,
    reverse = false,
  }) => {
    return (
      <section className="w-full flex justify-center px-4 sm:px-6 lg:px-8">
        <div
          className={`max-w-[1280px] w-full flex flex-col lg:flex-row items-center gap-6 sm:gap-8 md:gap-12 lg:gap-16 xl:gap-[200px] py-8 sm:py-12 md:py-16 lg:py-20 relative ${
            reverse ? "lg:flex-row-reverse" : ""
          }`}
        >
          {/* Image Block */}
          <div className="relative w-full lg:w-auto flex-shrink-0">
            <div className="w-full sm:w-80 md:w-96 lg:w-[420px] aspect-square rounded-2xl sm:rounded-3xl lg:rounded-[48px] border-4 sm:border-6 lg:border-[12px] border-border shadow-[0_10px_30px_rgba(0,0,0,0.12)] overflow-hidden">
           {/*    <img
                src={mainImage}
                alt={title}
                className="w-full h-full object-cover"
              />*/}
               <video
                    src={mainImage}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full rounded-lg object-cover"
                />
            </div>

            {/* Floating Card
            <div
              className={`absolute top-1/2 -translate-y-1/2 w-[310px] rounded-xl overflow-hidden bg-white shadow-[0_1px_2px_rgba(0,0,0,0.08),0_16px_32px_rgba(0,0,0,0.2)]
                ${reverse ? "left-[-120px]" : "right-[-120px]"}`}
            >
              <img
                src={floatingImage}
                alt="Preview"
                className="w-full block"
              />
            </div> */}
          </div>

          {/* Content */}
          <div className="w-full lg:w-auto lg:max-w-[450px] relative">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-semibold mb-3 sm:mb-4 text-foreground">
              {title}
            </h2>

            <p className="text-sm sm:text-base leading-relaxed text-muted-foreground mb-6 sm:mb-8">
              {description}
            </p>
        
            <a href={buttonLink}>
              <Button className="group px-2 text-xs sm:text-sm rounded-full" size="lg" variant="steel" icon={
                <div className="p-1.5 group bg-white rounded-full"><ArrowRight className="w-4 sm:w-4.5 h-4 sm:h-4.5 text-black group-hover:-rotate-30 transition duration-75" /></div>
            } iconPosition="right">
                {buttonText}
              </Button>
            </a>   
          </div> <WalletLogoIconOpenRed className={cn("h-80 w-80   absolute  opacity-30 ",
reverse? 'top-[28%] -left-40 rotate-270  ': 'rotate-90 top-[17%] -right-40' )} fill={reverse? 'red' : '#BCC987'} />
        </div>
      </section>
    );
  };

const MapprFeatures = () => {
    return (
      <>
        {/* 1. Tracking Financials */}
        <FeatureSection
          title="Track your finances in real time"
          description="Mappr brings all your accounts together so you always know where your money stands. Track balances, transactions, and cash flow effortlessly in one clear dashboard."
          buttonText="Track finances"
          buttonLink="/features/financial-tracking"
          mainImage="/vids/3.mp4"
          floatingImage="https://framerusercontent.com/images/EaZuPKvdoD8EH0KH5ZT8h1bD7A.png"
        />
  
        {/* 2. Spending Insights */}
        <FeatureSection
          reverse
          title="Understand your spending habits"
          description="See exactly where your money goes with smart categories and insights. Mappr highlights patterns, alerts you to unusual activity, and helps you stay in control every day."
          buttonText="View insights"
          buttonLink="/features/spending"
          mainImage="/vids/4.mp4"
          floatingImage="https://framerusercontent.com/images/D1so8TjhLlV5L0jDBbRLkEl9Tok.png"
        />
  
        {/* 3. Planning & Goals */}
        <FeatureSection
          title="Plan and automate your financial goals"
          description="Set goals, plan ahead, and let Mappr do the heavy lifting. Automate savings, prepare for upcoming expenses, and move confidently toward financial freedom."
          buttonText="Start planning"
          buttonLink="/features/planning"
          mainImage="/vids/5.mp4"
          floatingImage="https://framerusercontent.com/images/k64sWbi8XhmK30XPxDbmwWAlIeo.png"
        />
      </>
    );
  };
  
  export default MapprFeatures;