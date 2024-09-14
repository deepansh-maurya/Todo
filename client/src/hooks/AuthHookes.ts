export async function useAuth(url: string, task: string, data: any) {
  try {
    let response;
    if (task == "signup") {
      response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });
    } else if (task == "login") {
      response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identity: data.email,
          password: data.password,
        }),
      });
    } else if (task == "authcheck") {
      const token = localStorage.getItem("token");
      console.log(token);

      response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    }
    let injson;
    if (response) injson = await response.json();
    if (injson.success) return injson;
    else return null;
  } catch (error) {
    console.log(error);

    return null;
  }
}
