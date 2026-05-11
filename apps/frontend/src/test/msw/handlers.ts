import { http, HttpResponse } from "msw";
import type { Task, Team, Project } from "@todo/shared";

const API = "http://localhost:4000/api";

export const defaultTeams: Team[] = [
  {
    _id: "team-1",
    name: "Engineering",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
];

export const defaultProjects: Project[] = [
  {
    _id: "project-1",
    name: "Frontend",
    teamId: "team-1",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
];

export const defaultTasks: Task[] = [
  {
    _id: "task-1",
    title: "Write tests",
    status: "todo",
    order: 0,
    projectId: "project-1",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    _id: "task-2",
    title: "Deploy app",
    status: "todo",
    order: 1,
    projectId: "project-1",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
];

export const handlers = [
  // Teams
  http.get(`${API}/teams`, () => HttpResponse.json(defaultTeams)),

  http.post(`${API}/teams`, async ({ request }) => {
    const body = (await request.json()) as { name: string };
    const newTeam: Team = {
      _id: "team-new",
      name: body.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json(newTeam, { status: 201 });
  }),

  // Projects
  http.get(`${API}/projects`, () => HttpResponse.json(defaultProjects)),

  http.post(`${API}/projects`, async ({ request }) => {
    const body = (await request.json()) as { name: string; teamId: string };
    const newProject: Project = {
      _id: "project-new",
      name: body.name,
      teamId: body.teamId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json(newProject, { status: 201 });
  }),

  // Tasks — supports optional ?projectId= filter
  http.get(`${API}/tasks`, ({ request }) => {
    const url = new URL(request.url);
    const projectId = url.searchParams.get("projectId");
    const tasks = projectId ? defaultTasks.filter((t) => t.projectId === projectId) : defaultTasks;
    return HttpResponse.json(tasks);
  }),

  http.post(`${API}/tasks`, async ({ request }) => {
    const body = (await request.json()) as {
      title: string;
      description?: string;
      projectId?: string;
    };
    const newTask: Task = {
      _id: "task-new",
      title: body.title,
      ...(body.description !== undefined && { description: body.description }),
      ...(body.projectId !== undefined && { projectId: body.projectId }),
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
