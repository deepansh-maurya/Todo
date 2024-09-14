export async function useTodo(url: string, task: string, data: any) {
  try {
    const token = localStorage.getItem("token");
    let response;
    if (task == "gettodos") {
      response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } else if (task == "update-todo") {
      console.log(data);

      response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description || null,
          priority: data.priority || "medium",
          dueDate: data.dueDate.toString(),
          status: data.status,
          id: data.id,
        }),
      });
    } else if (task == "delete-todo") {
      console.log(data);

      response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: data,
        }),
      });
    } else if (task == "search") {
      console.log(data);

      response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          search: data.toString(),
        }),
      });
    } else
      response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description || null,
          priority: data.priority || "medium",
          dueDate: data.dueDate.toString(),
          status: status || "inprogress",
        }),
      });

    const injson = await response.json();
    if (injson.success) return injson;
    else return null;
  } catch (error) {
    return null;
  }
}
