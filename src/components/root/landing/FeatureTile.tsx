import type { FeatureItem } from "../../../types/rootTypes";

function FeatureTile({ item }: { item: FeatureItem }) {
  return (
    <div className="w-full xl:w-[25%] h-max border border-gray-500 rounded-lg flex flex-col justify-center items-center gap-2 sm:gap-3 p-3 sm:p-4 lg:p-5">
      <span className="p-1.5 sm:p-2 rounded-full bg-accent-200 flex-shrink-0">{item.icon}</span>
      <p className="text-light-text-primary dark:text-dark-text-primary text-xs sm:text-sm lg:text-base font-semibold text-center">
        {item.title}
      </p>
      <p className="text-light-text-muted dark:text-dark-text-muted text-xs sm:text-sm font-medium text-center leading-relaxed">
        {item.subtitle}
      </p>
    </div>
  );
}

export default FeatureTile;
