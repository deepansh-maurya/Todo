interface Task {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  dueDate: string | null;
  status: string;
}

const priorityOrder: { [key in Task["priority"]]: number } = {
  high: 1,
  medium: 2,
  low: 3,
};

export function sortTasksByDate(tasks: Task[]): Task[] {
  return tasks.sort((a, b) => {
    //@ts-ignore
    const dateA = new Date(a.dueDate);
    //@ts-ignore

    const dateB = new Date(b.dueDate);

    return dateA.getTime() - dateB.getTime();
  });
}
export function sortTasksByPriorityAndDate(tasks: Task[]): Task[] {
  return tasks.sort((a, b) => {
    const priorityComparison =
      priorityOrder[a.priority] - priorityOrder[b.priority];

    if (priorityComparison !== 0) {
      return priorityComparison;
    }
    //@ts-ignore

    const dateA = new Date(a.dueDate);
    //@ts-ignore

    const dateB = new Date(b.dueDate);

    return dateA.getTime() - dateB.getTime();
  });
}

export function searchTasks(tasks: Task[], keyword: string): Task[] {
  const lowercasedKeyword = keyword.toLowerCase();

  return tasks.filter((task) =>
    task.title.toLowerCase().includes(lowercasedKeyword)
  );
}
