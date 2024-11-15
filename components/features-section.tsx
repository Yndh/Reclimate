"use client";

import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import surveyImage from "@/assets/survey.png";
import surveyResultImage from "@/assets/surveyResult.png";
import carbonImage from "@/assets/carbon.png";
import chartImage from "@/assets/chart.png";
import challengesImage from "@/assets/challenges.png";
import challengesPage from "@/assets/challengesPage.png";
import rankingImage from "@/assets/ranking.png";
import chatImage from "@/assets/aichat.png";
import chatImage2 from "@/assets/aichat2.png";

export default function FeaturesSection() {
  const features = [
    {
      title: "Interaktywna Ankieta Ekologiczna",
      description: "Odpowiedz na kilka pytań i poznaj swój ślad węglowy.",
      skeleton: <FeatureOne />,
      className:
        "col-span-1 lg:col-span-4 border-b lg:border-r dark:border-border h-full",
    },
    {
      title: "Centrum ekologii",
      description: "Śledź swoje wyniki i postępy na dashboardzie.",
      skeleton: <FeatureTwo />,
      className: "border-b col-span-1 lg:col-span-2 dark:border-border",
    },
    {
      title: "Społeczność i rywalizacja ekologiczna",
      description:
        "Wykonuj zadania i rywalizuj z użytkownikami w rankingu punktów.",
      skeleton: <FeatureThree />,
      className: "col-span-1 lg:col-span-3 lg:border-r  dark:border-border",
    },
    {
      title: "Asystent AI",
      description:
        "Poszerzaj swoją więdzę dzięki asystencie AI który odpowie na twoje pytania i doradzi, jak życ bardziej ekologicznie.",
      skeleton: <FeatureFour />,
      className: "col-span-1 lg:col-span-3 border-b lg:border-none",
    },
  ];
  return (
    <div className="relative z-20 mt-10 max-w-7xl mx-auto">
      <div className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-6 xl:border rounded-md">
          {features.map((feature) => (
            <FeatureCard key={feature.title} className={feature.className}>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
              <div className=" h-full w-full">{feature.skeleton}</div>
            </FeatureCard>
          ))}
        </div>
      </div>
    </div>
  );
}

const FeatureCard = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn(`p-4 sm:p-8 relative overflow-hidden`, className)}>
      {children}
    </div>
  );
};

const FeatureTitle = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p className=" max-w-5xl mx-auto text-left tracking-tight text-black dark:text-white text-xl md:text-2xl md:leading-snug">
      {children}
    </p>
  );
};

const FeatureDescription = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p
      className={cn(
        "text-sm md:text-base  max-w-4xl text-left mx-auto",
        "text-neutral-500 text-center font-normal dark:text-neutral-300",
        "text-left max-w-sm mx-0 md:text-sm my-2"
      )}
    >
      {children}
    </p>
  );
};

export const FeatureOne = () => {
  const images = [surveyImage, surveyResultImage];

  return (
    <div className="relative flex flex-col items-start p-8 -space-y-[200px] h-fit overflow-hidden">
      {images.map((image, index) => (
        <Image
          src={image}
          alt="feature image"
          className={`w-2/3 hover:scale-105 duration-300 cursor-pointer ${
            index != 0 ? "ml-auto w-1/2" : ""
          }`}
        />
      ))}
    </div>
  );
};

export const FeatureTwo = () => {
  const images = [carbonImage, chartImage, challengesImage];

  return (
    <div className="relative flex flex-col items-start p-8 -space-y-5 h-fit overflow-hidden">
      {images.map((image, index) => (
        <Image
          src={image}
          alt="feature image"
          className={`${
            index % 2 != 0 ? "translate-x-8" : "-translate-x-4"
          } hover:scale-105 duration-300 cursor-pointer`}
        />
      ))}
    </div>
  );
};

export const FeatureThree = () => {
  const images = [challengesPage, rankingImage];
  return (
    <div className="relative flex flex-col items-start p-8 -space-y-20 h-fit overflow-hidden">
      {images.map((image, index) => (
        <Image
          src={image}
          alt="feature image"
          className={`w-full hover:scale-105 duration-300 cursor-pointer ${
            index != 0 ? "translate-x-6 hover:scale-125 !w-[400px] ml-auto" : ""
          }`}
        />
      ))}
    </div>
  );
};

export const FeatureFour = () => {
  const images = [chatImage2, chatImage];
  return (
    <div className="relative flex flex-col items-start p-8 -space-y-[400px] h-fit overflow-hidden">
      {images.map((image, index) => (
        <Image
          src={image}
          alt="feature image"
          className={`w-[300px] hover:scale-105 duration-300 cursor-pointer ${
            index != 0 ? "ml-auto w-[250px]" : ""
          }`}
        />
      ))}
    </div>
  );
};
