import { motion, AnimatePresence } from "framer-motion";
import TaskItem from "./TaskItem";

type Task = {
  id: number;
  item: string;
  checked: boolean;
};

export type Motion = typeof motion;

type TasksListProps = {
  filteredTasks: Task[];
  tasks: Task[];
  handleCheck: (id: number) => void;
  handleDelete: (id: number) => void;
  saveAndUpdate: (key: string, value: Task[], updatedTasks: Task[]) => void;
  enterEditMode: (task: Task) => void;
};

const TasksList = ({
  filteredTasks,
  tasks,
  handleCheck,
  handleDelete,
  saveAndUpdate,
  enterEditMode,
}: TasksListProps) => {
  const NumberOfTasksInProgress = () => {
    const tasksNumbers = filteredTasks.filter(
      (task: Task) => !task.checked
    ).length;
    return tasksNumbers > 1
      ? `${tasksNumbers} items left`
      : `${tasksNumbers} item left`;
  };

  const deleteCompletedTasks = () => {
    const completedTasks = filteredTasks.filter((task: Task) => !task.checked);
    saveAndUpdate("tasks", completedTasks, completedTasks);
  };

  const listItems = filteredTasks
    .sort((a, b) => {
      // If a task is completed, it should go to the bottom.
      if (a.checked && !b.checked) return 1;
      if (!a.checked && b.checked) return -1;

      // If both tasks are completed or both are not completed, sort by ID.
      return b.id - a.id;
    })
    .map((task: Task) => (
      <TaskItem
        key={task.id}
        task={task}
        handleCheck={handleCheck}
        handleDelete={handleDelete}
        enterEditMode={enterEditMode}
        motion={motion}
      />
    ));

  return (
    <ul
      className={`bg-white text-gray-500 dark:bg-[#25273D] dark:text-ace transition  shadow-xl rounded-[5px] *:border-b *:border-b-slate-200 dark:*:border-b-slate-700 *:p-3 *:flex *:items-center *:justify-between max-h-[45vh] overflow-x-hidden ${
        tasks.length > 6 ? "overflow-y-auto" : "overflow-y-hidden"
      } md:max-h-[50vh]`}
    >
      {tasks.length ? (
        <AnimatePresence>{listItems}</AnimatePresence>
      ) : (
        <motion.li
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="horizontal-center"
        >
          What's your plan for today?
        </motion.li>
      )}

      <li className="text-slate-500 dark:text-slate-400 text-sm bg-white dark:bg-[#25273D] rounded-b-[5px] transition  sticky bottom-0 left-0 z-10">
        <pre>{NumberOfTasksInProgress()}</pre>
        <button
          type="button"
          title="Clear all completed tasks"
          aria-label="Clear all completed tasks"
          className="transition hover:text-slate-600 dark:hover:text-slate-300"
          onClick={deleteCompletedTasks}
        >
          Clear Completed
        </button>
      </li>
    </ul>
  );
};
export default TasksList;
