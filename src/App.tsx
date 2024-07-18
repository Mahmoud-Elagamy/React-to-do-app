import { useEffect, useState } from "react";

// Custom Components
import BackgroundImage from "./components/BackgroundImage";
import Header from "./components/Header";
import AddTasks from "./components/AddTasks";
import TasksList from "./components/TasksList";
import FilterTasks from "./components/FilterTasks";
import EditModal from "./components/EditModal";

type Task = {
  id: number;
  item: string;
  checked: boolean;
};

type Filter = "All" | "Active" | "Completed";

const App = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const storedTasks = localStorage.getItem("tasks");
    return storedTasks ? JSON.parse(storedTasks) : [];
  });

  const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks || []);

  const [currentFilter, setCurrentFilter] = useState<Filter>("All");

  const [editedTask, setEditedTask] = useState<Task | null>(null);

  const [isEditing, setIsEditing] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const filterTasks = (filter: Filter): Task[] => {
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
    setFilteredTasks(filterTasks(filter));
  };

  const toggleTheme = () => {
    setIsDarkMode((prevValue) => !prevValue);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDarkMode ? "light" : "dark");
  };

  // Save in Local Storage and Update the state
  const saveAndUpdate = (key: string, value: Task[], updatedTasks: Task[]) => {
    localStorage.setItem(key, JSON.stringify(value));
    setTasks(updatedTasks);
    setFilteredTasks(updatedTasks);
  };

  const handleCheck = (id: number) => {
    const listItems = filteredTasks.map((task: Task) => {
      return task.id === id ? { ...task, checked: !task.checked } : task;
    });

    saveAndUpdate("tasks", listItems, listItems);
  };

  const handleDelete = (id: number) => {
    const listItems = filteredTasks.filter((task) => task.id !== id);
    saveAndUpdate("tasks", listItems, listItems);
  };

  const handleUpdate = (id: number | undefined, newText: string) => {
    const listItems = filteredTasks.map((task) => {
      return task.id === id ? { ...task, item: newText } : task;
    });

    saveAndUpdate("tasks", listItems, listItems);

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

  useEffect(() => {
    const isDarkTheme = matchMedia("(prefers-color-scheme: dark)").matches;
    const storedTheme = localStorage.getItem("theme");

    if (storedTheme === "dark" || (isDarkTheme && storedTheme !== "light")) {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
      setIsLoading(false);
    }

    setIsLoading(false);
  }, []);

  return (
    <>
      {/* To prevent dark theme flickering. */}
      {isLoading ? (
        <h1 className="text-3xl absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          Loading...
        </h1>
      ) : (
        <main className="container max-w-[500px] text-sm md:text-lg">
          <BackgroundImage isDarkMode={isDarkMode} />

          <section className="content py-10">
            <h2 className="sr-only">To do List</h2>

            <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

            <AddTasks saveAndUpdate={saveAndUpdate} tasks={filteredTasks} />

            <EditModal
              editedTask={editedTask}
              handleUpdate={handleUpdate}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              closeEditModal={closeEditModal}
            />

            <TasksList
              tasks={tasks}
              filteredTasks={filteredTasks}
              handleCheck={handleCheck}
              handleDelete={handleDelete}
              saveAndUpdate={saveAndUpdate}
              enterEditMode={enterEditMode}
            />

            <FilterTasks
              handleFilterChange={handleFilterChange}
              currentFilter={currentFilter}
              setCurrentFilter={setCurrentFilter}
            />

            {/* <Footer /> */}
          </section>
        </main>
      )}
    </>
  );
};
export default App;
