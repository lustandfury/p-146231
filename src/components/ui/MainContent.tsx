import React from "react";

interface MainContentProps {
  imageUrl: string;
  title: string;
}

export const MainContent: React.FC<MainContentProps> = ({
  imageUrl,
  title,
}) => {
  return (
    <main className="flex flex-col flex-1 w-full max-w-[390px] px-0 py-5 max-md:p-[15px] max-sm:p-2.5">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-[390px] object-cover shadow-[0px_4px_6px_1px_rgba(0,0,0,0.10),0px_2px_4px_-1px_rgba(0,0,0,0.06)] rounded-md max-md:h-[350px] max-sm:h-[300px]"
      />
      <div className="text-sm font-medium text-neutral-900 mt-2.5">{title}</div>
    </main>
  );
};
