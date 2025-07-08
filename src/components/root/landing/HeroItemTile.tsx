import type { HeroItem } from "../../../types/rootTypes";

const HeroItemTile = ({ item }: { item: HeroItem }) => {
  return (
    <div className="w-full h-max flex justify-start items-center gap-3 sm:gap-4 lg:gap-5">
      <span className="w-max h-max flex-shrink-0">{item.icon}</span>
      <span className="w-full h-max flex flex-col justify-start items-start gap-1 sm:gap-2">
        <p className="text-xs sm:text-sm lg:text-base font-semibold text-light-text-primary dark:text-dark-text-primary">
          {item.title}
        </p>
        <p className="text-xs sm:text-sm font-normal text-light-text-tertiary dark:text-dark-text-tertiary leading-relaxed">
          {item.subtitle}
        </p>
      </span>
    </div>
  );
};

export default HeroItemTile;
