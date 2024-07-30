// Framer Motion Library
import { motion, AnimatePresence, Reorder } from "framer-motion";

// Custom Components
import TaskItem from "./TaskItem";
import TaskStatus from "./TaskStatus";

// Utils
import syncTasksWithLocalStorage from "./utils/syncTasksWithLocalStorage";

// Types
import { Task } from "../App";
export type ReorderType = typeof Reorder;
type TasksListProps = {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  handleCheck: (id: number) => void;
  handleDelete: (id: number) => void;
  enterEditMode: (task: Task) => void;
};

const TasksList = ({
  tasks,
  setTasks,
  handleCheck,
  handleDelete,
  enterEditMode,
}: TasksListProps) => {
  const NumberOfTasksInProgress = () => {
    const tasksNumbers = tasks.filter((task: Task) => !task.checked).length;
    return tasksNumbers > 1
      ? `${tasksNumbers} items left`
      : `${tasksNumbers} item left`;
  };

  const deleteCompletedTasks = () => {
    const completedTasks = tasks.filter((task: Task) => !task.checked);
    syncTasksWithLocalStorage(
      "tasks",
      completedTasks,
      setTasks,
      completedTasks
    );
  };

  const handleReordering = (newOrder: Task[]) => {
    syncTasksWithLocalStorage("tasks", newOrder, setTasks, newOrder);
  };

  // const sortedTasks = tasks.sort((a, b) => {
  //   // If a task is completed, it should go to the bottom.
  //   if (a.checked && !b.checked) return 1;
  //   if (!a.checked && b.checked) return -1;

  //   // If both tasks are completed or both are not completed, sort by ID.
  //   return b.id - a.id;
  // });

  const listItems = tasks.map((task: Task) => (
    <TaskItem
      key={task.id}
      task={task}
      handleCheck={handleCheck}
      handleDelete={handleDelete}
      enterEditMode={enterEditMode}
      reorder={Reorder}
    />
  ));

  return (
    <section>
      <h2 className="sr-only">Todo List</h2>
      <Reorder.Group
        axis="y"
        values={tasks}
        onReorder={handleReordering}
        className={`bg-white text-gray-500 dark:bg-[#25273D] divide-y dark:divide-slate-700 dark:text-ace transition rounded-t-[5px] *:p-3 *:flex *:items-center *:justify-between max-h-[45vh] overflow-x-hidden ${
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
            className="horizontal-center text-base md:text-lg"
          >
            What's your plan for today?
          </motion.li>
        )}
      </Reorder.Group>
      <TaskStatus
        NumberOfTasksInProgress={NumberOfTasksInProgress}
        deleteCompletedTasks={deleteCompletedTasks}
      ></TaskStatus>
    </section>
  );
};
export default TasksList;
