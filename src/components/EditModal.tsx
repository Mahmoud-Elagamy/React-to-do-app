import { CheckIcon, XIcon } from "lucide-react";
import { FormEvent, useEffect, useState, useRef } from "react";

type Task = {
  id: number;
  item: string;
  checked: boolean;
};

type EditModalProps = {
  editedTask: null | Task;
  handleUpdate: (id: number | undefined, newText: string) => void;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  closeEditModal: () => void;
};

const EditModal = ({
  editedTask,
  handleUpdate,
  isEditing,
  setIsEditing,
  closeEditModal,
}: EditModalProps) => {
  const [text, setText] = useState<string>(editedTask?.item || "");

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editedTask?.item) {
      setText(editedTask.item);
    }
  }, [editedTask]);

  useEffect(() => {
    const closeModalIfEscaped = (e: KeyboardEvent) => {
      e.key === "Escape" && closeEditModal();
    };

    addEventListener("keydown", closeModalIfEscaped);

    return () => removeEventListener("keydown", closeModalIfEscaped);
  }, [closeEditModal]);

  useEffect(() => {
    if (isEditing) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);

      return () => clearTimeout(timer); // Clean up the timeout if the component unmounts
    }
  }, [isEditing]);

  //* Need explanation here.
  // if (!isEditing) {
  //   return null;
  // }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Verify if the name of the task has been changed.
    if (text === editedTask?.item) {
      setIsEditing(false);
      return;
    }

    handleUpdate(editedTask?.id, text);
  };

  return (
    // backdrop
    <div
      onClick={() => setIsEditing(false)}
      className={`
     fixed inset-0 z-20 flex justify-center items-center transition-all  ${
       isEditing ? `visible bg-black/50` : `invisible`
     }
     `}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white/70 dark:bg-[#25273D]/70 rounded-md shadow-md p-3 transition  ${
          isEditing ? `scale-100 opacity-100` : `scale-125 opacity-0`
        }`}
        role="dialog"
        tabIndex={0}
      >
        <button
          type="button"
          className="absolute -top-2 -right-2 bg-slate-400 rounded-md md:p-[1px]"
          title="Cancel"
          onClick={() => setIsEditing(false)}
        >
          <XIcon className="transition text-white size-5 hover:text-red-600" />
        </button>
        <h2 className="dark:text-white mb-2">Update Task:</h2>
        <form
          className="flex items-center p-2 pl-1 bg-white dark:bg-[#25273D] shadow-lg rounded-md transition hover:ring-1 focus-within:ring-1 ring-blue-600 dark:hover:ring-1 dark:focus-within:ring-1 dark:ring-blue-600"
          onSubmit={handleSubmit}
        >
          <label className="sr-only" htmlFor="update-task">
            Update Task
          </label>
          <input
            ref={inputRef}
            id="update-task"
            className="w-full rounded-[5px] bg-transparent indent-1 dark:text-slate-50  caret-bright-blue tracking-wide transition  outline-none"
            type="text"
            placeholder="Update Task"
            required
            autoFocus
            dir="auto"
            maxLength={25}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            type="submit"
            aria-label={`Confirm edited task to now read ${text}`}
            title="Update Task"
            className="bg-green-500 md:p-[1px] rounded-md transition hover:bg-green-600"
          >
            <CheckIcon className="text-white size-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
export default EditModal;
