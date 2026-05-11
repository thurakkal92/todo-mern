import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { createApp } from "../../app";
import { TaskModel } from "../../models/task.model";
import type { Express } from "express";

interface TaskBody {
  _id: string;
  title: string;
  description?: string;
  status: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface ErrorBody {
  error: { code: string; message: string; details?: Array<{ field: string; message: string }> };
}

let app: Express;
let mongod: MongoMemoryServer;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
  app = createApp();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

beforeEach(async () => {
  await TaskModel.deleteMany({});
});

describe("GET /api/tasks", () => {
  it("returns empty array when no tasks", async () => {
    const res = await request(app).get("/api/tasks");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("returns tasks sorted by status then order", async () => {
    await TaskModel.create([
      { title: "C", status: "done", order: 0 },
      { title: "A", status: "todo", order: 1 },
      { title: "B", status: "todo", order: 0 },
    ]);
    const res = await request(app).get("/api/tasks");
    const tasks = res.body as TaskBody[];
    expect(res.status).toBe(200);
    expect(tasks).toHaveLength(3);
    expect(tasks[0]?.status).toBe("done");
    expect(tasks[1]?.title).toBe("B");
    expect(tasks[2]?.title).toBe("A");
  });
});

describe("POST /api/tasks", () => {
  it("creates a task with status todo and order 0", async () => {
    const res = await request(app).post("/api/tasks").send({ title: "First task" });
    const body = res.body as TaskBody;
    expect(res.status).toBe(201);
    expect(body.title).toBe("First task");
    expect(body.status).toBe("todo");
    expect(body.order).toBe(0);
    expect(typeof body._id).toBe("string");
  });

  it("appends to bottom of todo column", async () => {
    await request(app).post("/api/tasks").send({ title: "Task 1" });
    const res = await request(app).post("/api/tasks").send({ title: "Task 2" });
    const body = res.body as TaskBody;
    expect(body.order).toBe(1);
  });

  it("includes optional description", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .send({ title: "With desc", description: "My description" });
    const body = res.body as TaskBody;
    expect(body.description).toBe("My description");
  });

  it("returns 400 when title is missing", async () => {
    const res = await request(app).post("/api/tasks").send({});
    const body = res.body as ErrorBody;
    expect(res.status).toBe(400);
    expect(body.error.code).toBe("VALIDATION_ERROR");
    expect(body.error.details?.[0]?.field).toBe("title");
  });

  it("returns 400 when title exceeds 100 chars", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .send({ title: "x".repeat(101) });
    expect(res.status).toBe(400);
  });

  it("returns 400 when description exceeds 500 chars", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .send({ title: "Valid", description: "x".repeat(501) });
    expect(res.status).toBe(400);
  });
});

describe("PATCH /api/tasks/:id", () => {
  it("updates task title", async () => {
    const created = await TaskModel.create({ title: "Old", status: "todo", order: 0 });
    const res = await request(app)
      .patch(`/api/tasks/${created._id.toString()}`)
      .send({ title: "New" });
    const body = res.body as TaskBody;
    expect(res.status).toBe(200);
    expect(body.title).toBe("New");
  });

  it("returns 404 for unknown id", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).patch(`/api/tasks/${fakeId}`).send({ title: "X" });
    const body = res.body as ErrorBody;
    expect(res.status).toBe(404);
    expect(body.error.code).toBe("NOT_FOUND");
  });
});

describe("PATCH /api/tasks/:id/move", () => {
  it("changes status and order", async () => {
    const created = await TaskModel.create({ title: "T", status: "todo", order: 0 });
    const res = await request(app)
      .patch(`/api/tasks/${created._id.toString()}/move`)
      .send({ status: "in-progress", order: 0 });
    const body = res.body as TaskBody;
    expect(res.status).toBe(200);
    expect(body.status).toBe("in-progress");
    expect(body.order).toBe(0);
  });

  it("uses float-between-neighbors order", async () => {
    const t1 = await TaskModel.create({ title: "T1", status: "in-progress", order: 0 });
    const t2 = await TaskModel.create({ title: "T2", status: "in-progress", order: 2 });
    // Move a third task between t1 and t2 at order 1
    const t3 = await TaskModel.create({ title: "T3", status: "todo", order: 0 });
    const newOrder = (t1.order + t2.order) / 2; // 1
    const res = await request(app)
      .patch(`/api/tasks/${t3._id.toString()}/move`)
      .send({ status: "in-progress", order: newOrder });
    const body = res.body as TaskBody;
    expect(body.order).toBe(1);
  });

  it("returns 400 for invalid status", async () => {
    const created = await TaskModel.create({ title: "T", status: "todo", order: 0 });
    const res = await request(app)
      .patch(`/api/tasks/${created._id.toString()}/move`)
      .send({ status: "invalid", order: 0 });
    expect(res.status).toBe(400);
  });

  it("returns 404 for unknown id", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app)
      .patch(`/api/tasks/${fakeId}/move`)
      .send({ status: "done", order: 0 });
    expect(res.status).toBe(404);
  });

  it("rebalances when gap drops below threshold", async () => {
    // Build two tasks with gap < 1e-9
    const gap = 5e-10;
    await TaskModel.create({ title: "A", status: "todo", order: 0 });
    const t2 = await TaskModel.create({ title: "B", status: "todo", order: 1 });
    // Move a new task between them with a near-zero gap
    const t3 = await TaskModel.create({ title: "C", status: "in-progress", order: 0 });
    await request(app)
      .patch(`/api/tasks/${t3._id.toString()}/move`)
      .send({ status: "todo", order: gap });

    // After move, all todo tasks should have integer orders
    const tasks = await TaskModel.find({ status: "todo" }).sort({ order: 1 }).lean();
    tasks.forEach((t, i) => {
      expect(t.order).toBe(i);
    });
    void t2; // referenced above
  });
});

describe("DELETE /api/tasks/:id", () => {
  it("deletes an existing task", async () => {
    const created = await TaskModel.create({ title: "To delete", status: "todo", order: 0 });
    const res = await request(app).delete(`/api/tasks/${created._id.toString()}`);
    expect(res.status).toBe(204);
    const found = await TaskModel.findById(created._id);
    expect(found).toBeNull();
  });

  it("returns 404 for unknown id", async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).delete(`/api/tasks/${fakeId}`);
    const body = res.body as ErrorBody;
    expect(res.status).toBe(404);
    expect(body.error.code).toBe("NOT_FOUND");
  });
});
