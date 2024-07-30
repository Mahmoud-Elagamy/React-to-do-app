// Types
import { Task } from "../../App";

const syncTasksWithLocalStorage = (
  key: string,
  value: Task[],
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>,
  updatedState: Task[]
) => {
  localStorage.setItem(key, JSON.stringify(value));
  setTasks(updatedState);
};

export default syncTasksWithLocalStorage;
