import { FormEvent, useState, useRef, useEffect } from "react";
import { CirclePlus } from "lucide-react";

// Utils
import syncTasksWithLocalStorage from "./utils/syncTasksWithLocalStorage";

//  Types
import { Task } from "../App";
type AddTasksProps = {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
};

const AddTasks = ({ tasks, setTasks }: AddTasksProps) => {
  const [addTask, setAddTask] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const addNewItem = (task: string) => {
    const id = Date.now();
    const addedTask = {
      id,
      item: task,
      checked: false,
    };
    const listTasks = [addedTask, ...tasks];
    syncTasksWithLocalStorage("tasks", listTasks, setTasks, listTasks);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!addTask.trim()) return;
    addNewItem(addTask);
    setAddTask("");
  };

  useEffect(() => {
    if (!tasks.length) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);

      return () => clearTimeout(timer); // Clean up the timeout if the component unmounts
    }
  }, [tasks.length]);

  return (
    <form
      className="flex items-center p-2 md:p-3 pl-2 mb-4 shadow-lg  bg-slate-50 dark:bg-[#25273D] rounded-md  hover:ring-1 focus-within:ring-1 ring-slate-900 dark:hover:ring-1 dark:focus-within:ring-1 dark:ring-blue-600"
      onSubmit={handleSubmit}
    >
      <label className="sr-only" htmlFor="entry-item">
        Create a new todo
      </label>
      <input
        ref={inputRef}
        id="entry-item"
        className="w-full bg-transparent rounded-[5px] indent-1 dark:text-slate-50 caret-bright-blue tracking-wide  outline-none"
        type="text"
        placeholder="Create a new todo..."
        required
        autoFocus
        autoComplete="off"
        dir="auto"
        maxLength={25}
        value={addTask}
        onChange={(e) => setAddTask(e.target.value)}
      />
      <button
        type="submit"
        title="Add a to do task"
        aria-label="Add a to do task"
      >
        <CirclePlus className="text-neutral-400 dark:text-slate-400  dark:hover:text-slate-500 hover:text-neutral-500" />
      </button>
    </form>
  );
};
export default AddTasks;
