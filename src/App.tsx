import { useLayoutEffect, useState } from "react";

// Custom Components
import BackgroundImage from "./components/BackgroundImage";
import Header from "./components/Header";
import AddTasks from "./components/AddTasks";
import TasksList from "./components/TasksList";
import FilterTasks from "./components/FilterTasks";
import EditModal from "./components/EditModal";
import LoadingIndicator from "./components/LoadingIndicator";

// Utils
import applyTheme from "./components/utils/applyTheme";
import syncTasksWithLocalStorage from "./components/utils/syncTasksWithLocalStorage";

// Types
export type Task = {
  id: number;
  item: string;
  checked: boolean;
};
export type Filter = "All" | "Active" | "Completed";

const App = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const storedTasks = localStorage.getItem("tasks");
    return storedTasks ? JSON.parse(storedTasks) : [];
  });
  const [currentFilter, setCurrentFilter] = useState<Filter>("All");
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Task | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const filterTasks = (filter: Filter, tasks: Task[]): Task[] => {
    switch (filter) {
      case "All":
        return tasks;
      case "Active":
        return tasks.filter((task) => !task.checked);
      case "Completed":
        return tasks.filter((task) => task.checked);
      default:
        return tasks;
    }
  };

  const handleFilterChange = (filter: Filter) => {
    setCurrentFilter(filter);
  };

  // Function to get the message to display when no tasks match the current filter
  const getFilteredTasksMessage = (filter: Filter): string => {
    switch (filter) {
      case "Active":
        return "You have no active tasks. Great job!";
      case "Completed":
        return "No completed tasks yet. Keep going!";
      default:
        return "";
    }
  };

  const toggleTheme = () => {
    setIsDarkMode((prevValue) => !prevValue);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDarkMode ? "light" : "dark");
  };

  const handleCheck = (id: number) => {
    const listItems = tasks.map((task: Task) => {
      return task.id === id ? { ...task, checked: !task.checked } : task;
    });
    const sortedTasks = listItems.sort((a, b) => {
      if (a.checked && !b.checked) return 1;
      if (!a.checked && b.checked) return -1;
      return b.id - a.id;
    });
    syncTasksWithLocalStorage("tasks", sortedTasks, setTasks, sortedTasks);
  };

  const handleDelete = (id: number) => {
    const listItems = tasks.filter((task) => task.id !== id);
    syncTasksWithLocalStorage("tasks", listItems, setTasks, listItems);
  };

  const handleUpdate = (id: number | undefined, newText: string) => {
    const listItems = tasks.map((task) => {
      return task.id === id ? { ...task, item: newText } : task;
    });
    syncTasksWithLocalStorage("tasks", listItems, setTasks, listItems);
    setTasks(listItems);
    closeEditModal();
    setEditedTask(null);
  };

  const closeEditModal = () => {
    setIsEditing(false);
    setEditedTask(null);
  };

  const enterEditMode = (task: Task) => {
    setIsEditing(true);
    setEditedTask(task);
  };

  useLayoutEffect(() => {
    applyTheme(setIsDarkMode, setIsLoading);
  }, []);

  return (
    <>
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <main className="container max-w-[500px] text-sm md:text-lg">
          <BackgroundImage isDarkMode={isDarkMode} />

          <section className="content py-10">
            <h2 className="sr-only">To do List</h2>

            <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

            <AddTasks tasks={tasks} setTasks={setTasks} />

            <EditModal
              editedTask={editedTask}
              handleUpdate={handleUpdate}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              closeEditModal={closeEditModal}
            />

            <TasksList
              tasks={tasks}
              filteredTasks={filterTasks(currentFilter, tasks)}
              setTasks={setTasks}
              handleCheck={handleCheck}
              handleDelete={handleDelete}
              enterEditMode={enterEditMode}
              currentFilter={currentFilter}
              getFilteredTasksMessage={getFilteredTasksMessage}
            />

            <FilterTasks
              handleFilterChange={handleFilterChange}
              currentFilter={currentFilter}
              setCurrentFilter={setCurrentFilter}
            />
          </section>
        </main>
      )}
    </>
  );
};
export default App;
