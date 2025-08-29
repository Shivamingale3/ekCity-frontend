import { Input } from "@/components/ui/input";
import { type Dispatch, type SetStateAction } from "react";

const SearchBar = ({
  search,
  setSearch,
}: {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <Input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search by Title"
      className="border border-white text-white p-5"
    />
  );
};

export default SearchBar;
