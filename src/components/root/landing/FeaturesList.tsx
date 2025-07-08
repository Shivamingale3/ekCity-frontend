import { featuresContent } from "../../../content/featuresContent";
import FeatureTile from "./FeatureTile";

function Features() {
  return (
    <div className="w-full h-max grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:flex xl:justify-start xl:items-center gap-3 sm:gap-4 lg:gap-5">
      {featuresContent.map((item) => (
        <FeatureTile key={item.title} item={item} />
      ))}
    </div>
  );
}

export default Features;
