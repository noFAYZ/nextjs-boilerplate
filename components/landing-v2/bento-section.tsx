import React from "react";
import { Card } from "../ui/card";
import { BgGradient } from "../landing/bg/bg-gradient";

const features = [
  {
    title: "Intelligent Task Organizer",
    description: "Unique saas landing page designs, illustrations, and graphic elements",
    image: "https://framerusercontent.com/images/KvVIVEs8B4vprOR6xx3jbpHCVo.png?width=1200",
  },
  {
    title: "Smooth Teamwork",
    description: "Facilitate instant communication and seamless exchange high-quality data",
    image: "https://framerusercontent.com/images/ecUVchNLQqvDIdicQpYJvVsXFZs.png?width=1200",
  },
  {
    title: "Smart Workflow Automation",
    description: "Eliminate manual work, smart triggers that keep projects automatically.",
    image: "https://framerusercontent.com/images/6qglhEqXenVCuq4WxffMQiLGoo.png?width=1200",
  },
  {
    title: "Advanced Reporting",
    description: "Boost performance and streamline efficiency effortlessly",
    image: "https://framerusercontent.com/images/Kn9KVwXDLHrVfVQnu2XOuAVX0.png?width=1800",
    large: true,
  },
  {
    title: "Integration-ready Platform",
    description: "Seamlessly connect Centra with Slack, Trello or any tool in your stack",
    image: "https://framerusercontent.com/images/B4bZCHrCRmhA2jJF39FEKB3HbuM.png?width=1200",
  },
];

export default function FeaturesGrid() {
  return (
    <>
      <section className="py-20 px-6  mx-auto relative">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 max-w-5xl mx-auto">
          {/* Top Row - 3 cards */}
          {features.slice(0, 3).map((feature, index) => (
            <Card
              key={index}
              className="lg:col-span-4 group relative overflow-hidden border-border/50 rounded-3xl bg-white shadow-none hover:shadow-2xl transition-all duration-75"
            >
              <div className="aspect-[4/3.5] overflow-hidden rounded-2xl">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200 rounded-2xl"
                />
              </div>
              <div className="p-8">
                <h3 className="text-base font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-[13px]">
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}

          {/* Bottom Row - Large card + small card */}
          <div className="lg:col-span-7 lg:row-span-2">
            <Card className="h-full group relative overflow-hidden border-border/50 rounded-3xl shadow-none hover:shadow-2xl transition-all duration-100">
              <div className="aspect-[4/2]  rounded-2xl overflow-hidden">
                <img
                  src={features[3].image}
                  alt={features[3].title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-200 rounded-2xl"
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-background/70 to-transparent">
                <h3 className="text-base font-bold  mb-3">
                  {features[3].title}
                </h3>
                <p className="  text-[13px]">
                  {features[3].description}
                </p>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-5 lg:row-span-2">
            <Card className="h-full group relative overflow-hidden rounded-3xl    transition-all duration-100 shadow-none border-border/50">
              <div className="aspect-[4/2] rounded-2xl overflow-hidden">
                <img
                  src={features[4].image}
                  alt={features[4].title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200 rounded-2xl"
                />
              </div>
              

              <div className="p-8">
                <h3 className="text-base font-bold text-gray-900 mb-3">
                  {features[4].title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-[13px]">
                  {features[4].description}
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}