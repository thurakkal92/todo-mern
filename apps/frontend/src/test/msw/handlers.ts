import { http, HttpResponse } from "msw";
import type { Task } from "@todo/shared";

const API = "http://localhost:4000/api";

export const defaultTasks: Task[] = [
  {
    _id: "task-1",
    title: "Write tests",
    status: "todo",
    order: 0,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    _id: "task-2",
    title: "Deploy app",
    status: "todo",
    order: 1,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
];

export const handlers = [
  http.get(`${API}/tasks`, () => HttpResponse.json(defaultTasks)),

  http.post(`${API}/tasks`, async ({ request }) => {
    const body = (await request.json()) as { title: string; description?: string };
    const newTask: Task = {
      _id: "task-new",
      title: body.title,
      ...(body.description !== undefined && { description: body.description }),
      status: "todo",
      order: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json(newTask, { status: 201 });
  }),

  http.patch(`${API}/tasks/:id/move`, async ({ params, request }) => {
    const body = (await request.json()) as { status: string; order: number };
    const task = defaultTasks.find((t) => t._id === params["id"]);
    if (!task) {
      return HttpResponse.json(
        { error: { code: "NOT_FOUND", message: "Task not found" } },
        { status: 404 },
      );
    }
    return HttpResponse.json({ ...task, status: body.status, order: body.order });
  }),
];
