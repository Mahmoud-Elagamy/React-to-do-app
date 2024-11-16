// Custom Components
import TaskItem from "./TaskItem";
import TaskStatus from "./TaskStatus";

// Utils
import syncTasksWithLocalStorage from "./utils/syncTasksWithLocalStorage";

// Types
import { Task } from "../App";
import { Filter } from "../App";
import { MotionType, AnimatePresenceType, ReorderType } from "../App";
type TasksListProps = {
  tasks: Task[];
  filteredTasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  handleCheck: (id: number) => void;
  handleDelete: (id: number) => void;
  enterEditMode: (task: Task) => void;
  currentFilter: Filter;
  getFilteredTasksMessage: (filter: Filter) => string;
  motion: MotionType;
  AnimatePresence: AnimatePresenceType;
  Reorder: ReorderType;
};

const TasksList = ({
  tasks,
  filteredTasks,
  setTasks,
  handleCheck,
  handleDelete,
  enterEditMode,
  currentFilter,
  getFilteredTasksMessage,
  motion,
  AnimatePresence,
  Reorder,
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

  const listItems = filteredTasks.map((task: Task) => (
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
        className={`bg-white text-gray-500 dark:bg-[#25273D] divide-y dark:divide-slate-700 dark:text-ace  rounded-t-[5px] *:p-3 *:flex *:items-center *:justify-between max-h-[45vh] overflow-x-hidden ${
          tasks.length > 6 ? "overflow-y-auto" : "overflow-y-hidden"
        } md:max-h-[50vh]`}
      >
        {!tasks.length ? (
          <motion.li
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="horizontal-center text-sm md:text-base"
          >
            What's your plan for today?
          </motion.li>
        ) : !filteredTasks.length ? (
          <motion.li
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="horizontal-center text-sm md:text-base"
          >
            {getFilteredTasksMessage(currentFilter)}
          </motion.li>
        ) : (
          <AnimatePresence>{listItems}</AnimatePresence>
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
