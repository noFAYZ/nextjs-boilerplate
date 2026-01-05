import React from "react";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

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
      <section className="w-full flex justify-center">
        <div
          className={`max-w-[1280px] w-full flex items-center gap-[200px] space-y-4 ${
            reverse ? "flex-row-reverse" : "flex-row"
          }`}
        >
          {/* Image Block */}
          <div className="relative">
            <div className="w-[420px] h-[420px] rounded-[48px] border-[12px] border-border shadow-[0_10px_30px_rgba(0,0,0,0.12)] overflow-hidden">
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
          <div className="max-w-[450px]">
            <h2 className="text-4xl font-semibold mb-4 text-foreground  ">
              {title}
            </h2>
  
            <p className="text-base leading-relaxed text-muted-foreground mb-8">
              {description}
            </p>
  
            <a href={buttonLink}>
              <Button className="group  px-2 text-sm rounded-full " size="lg" variant="steel" icon={
                <div className="p-1.5 group bg-white rounded-full"><ArrowRight className="w-4.5 h-4.5 text-black group-hover:-rotate-30 transition duration-75" /></div>
            } iconPosition="right">
                {buttonText}
              </Button>
            </a>
          </div>
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