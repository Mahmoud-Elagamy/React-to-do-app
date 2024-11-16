// Types
type TaskStatusProps = {
  NumberOfTasksInProgress: () => string;
  deleteCompletedTasks: () => void;
};

function TaskStatus({
  NumberOfTasksInProgress,
  deleteCompletedTasks,
}: TaskStatusProps) {
  return (
    <section className="text-slate-500 border-t dark:border-slate-700 flex items-center justify-between p-3 shadow-xl dark:text-slate-400 text-xs md:text-sm bg-white dark:bg-[#25273D] rounded-b-[5px] sticky bottom-0 left-0 z-10">
      <h2 className="sr-only">Task Status</h2>
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
    </section>
  );
}
export default TaskStatus;
