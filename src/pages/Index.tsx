import React from "react";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { MainContent } from "@/components/ui/MainContent";

const Index = () => {
  return (
    <div className="flex flex-col items-center w-full max-w-[430px] h-screen bg-white mx-auto my-0 max-md:w-full max-sm:w-full">
      <Header />
      <MainContent
        imageUrl="https://cdn.builder.io/api/v1/image/assets/TEMP/b4fcca08618062d33eb67fee4b4c56cb0d66b188"
        title="TCU Grad 2025"
      />
      <BottomNav />
    </div>
  );
};

export default Index;
