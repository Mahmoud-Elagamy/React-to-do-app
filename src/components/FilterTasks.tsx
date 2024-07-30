// Types
import { Filter } from "../App";
type FilterTasksProps = {
  handleFilterChange: (filter: Filter) => void;
  currentFilter: Filter;
  setCurrentFilter: React.Dispatch<React.SetStateAction<Filter>>;
};

const FilterTasks = ({
  handleFilterChange,
  currentFilter,
  setCurrentFilter,
}: FilterTasksProps) => {
  return (
    <section className="flex justify-evenly items-center font-bold bg-white dark:bg-[#25273D] shadow-lg mt-4 p-2 rounded-md text-slate-500 dark:text-slate-400 text-sm transition  *:transition  md:text-base">
      <h2 className="sr-only">Filter Tasks</h2>
      <button
        type="button"
        title="All available tasks"
        aria-label="Show all available tasks"
        className={`${
          currentFilter === "All" && "text-bright-blue"
        }  hover:text-bright-blue`}
        name="all"
        onClick={() => {
          handleFilterChange("All");
          setCurrentFilter("All");
        }}
      >
        All
      </button>
      <button
        type="button"
        title="Active tasks"
        aria-label="Show only active tasks"
        className={`${
          currentFilter === "Active" && "text-bright-blue"
        }  hover:text-bright-blue`}
        name="active"
        onClick={() => {
          handleFilterChange("Active");
          setCurrentFilter("Active");
        }}
      >
        Active
      </button>
      <button
        type="button"
        title="Completed tasks"
        aria-label="Show completed tasks"
        className={`${
          currentFilter === "Completed" && "text-bright-blue"
        }  hover:text-bright-blue`}
        name="completed"
        onClick={() => {
          handleFilterChange("Completed");
          setCurrentFilter("Completed");
        }}
      >
        Completed
      </button>
    </section>
  );
};
export default FilterTasks;
