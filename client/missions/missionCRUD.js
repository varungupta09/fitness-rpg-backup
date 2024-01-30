export async function createMission(id, title, des) {
  const response = await fetch("/missions/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, title, des }),
  });
  const data = await response.json();
  return data;
}

export async function updateMission(id, title, des) {
  const response = await fetch("/missions/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, title, des }),
  });
  const data = await response.json();
  return data;
}

export async function readAllMission(id, title, des) {
  const response = await fetch("/missions/all", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data;
}