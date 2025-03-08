"use client";
import { useEffect, useState } from "react";
import { Task } from "@/app/lib/Task";
import { remult } from "remult";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const taskRepo = remult.repo(Task);

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  useEffect(() => {
    taskRepo.find().then(setTasks);
  }, []);

  const addTask = async () => {
    if (!newTaskTitle.trim()) {
      toast.error("Пожалуйста, введите название задачи.");
      return;
    }

    const tempTask = { id: Date.now().toString(), title: newTaskTitle, completed: false };

    setTasks([...tasks, tempTask]);
    setNewTaskTitle("");

    try {
      const newTask = await taskRepo.insert({ title: newTaskTitle });
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === tempTask.id ? newTask : t))
      );
      toast.success("Задача успешно добавлена!");
    } catch (error) {
      console.error("Не удалось добавить задачу:", error);
      setTasks((prevTasks) => prevTasks.filter((t) => t.id !== tempTask.id));
      toast.error("Не удалось добавить задачу. Пожалуйста, попробуйте снова.");
    }
  };

  const deleteTask = async (taskId: string) => {
    if (confirm("Вы уверены, что хотите удалить это задание?")) {
      const previousTasks = tasks;
      setTasks(tasks.filter((t) => t.id !== taskId));

      try {
        await taskRepo.delete(taskId);
        toast.success("Задача успешно удалена!");
      } catch (error) {
        console.error("Не удалось удалить задачу:", error);
        setTasks(previousTasks);
        toast.error("Не удалось удалить задачу. Пожалуйста, попробуйте снова.");
      }
    }
  };

  const deleteSelectedTasks = async () => {
    if (selectedTasks.length === 0) {
      toast.error("Выберите хотя бы одну задачу для удаления.");
      return;
    }

    const previousTasks = tasks;
    setTasks(tasks.filter((t) => !selectedTasks.includes(t.id)));
    setSelectedTasks([]);

    try {
      await Promise.all(selectedTasks.map((taskId) => taskRepo.delete(taskId)));
      toast.success("Выбранные задачи успешно удалены!");
    } catch (error) {
      console.error("Не удалось удалить задачи:", error);
      setTasks(previousTasks);
      toast.error("Не удалось удалить задачи. Пожалуйста, попробуйте снова.");
    }
  };

  const handleTaskSelect = (taskId: string) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  return (
    <div>
      <h1>Tasks</h1>
      <input
        value={newTaskTitle}
        onChange={(e) => setNewTaskTitle(e.target.value)}
        placeholder="New task"
      />
      <button onClick={addTask}>Add Task</button>
      <button onClick={deleteSelectedTasks} disabled={selectedTasks.length === 0}>
        Удалить выбранные
      </button>
      <ul>
        <AnimatePresence>
          {tasks.map((task) => (
            <motion.li
              key={task.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <input
                type="checkbox"
                checked={selectedTasks.includes(task.id)}
                onChange={() => handleTaskSelect(task.id)}
              />
              <span
                style={{
                  textDecoration: task.completed ? "line-through" : "none",
                  color: task.completed ? "gray" : "inherit",
                }}
              >
                {task.title}
              </span>
              <button onClick={() => deleteTask(task.id)}>Delete</button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      <ToastContainer
        position="bottom-right"
        autoClose={500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}