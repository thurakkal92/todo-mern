import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { createApp } from "../../app";
import { TeamModel } from "../../models/team.model";
import { ProjectModel } from "../../models/project.model";
import type { Express } from "express";

interface TeamBody {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface ProjectBody {
  _id: string;
  name: string;
  teamId: string;
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
  await TeamModel.deleteMany({});
  await ProjectModel.deleteMany({});
});

describe("GET /api/teams", () => {
  it("returns empty array when no teams", async () => {
    const res = await request(app).get("/api/teams");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("returns all teams sorted by createdAt", async () => {
    await TeamModel.create([{ name: "Alpha" }, { name: "Beta" }]);
    const res = await request(app).get("/api/teams");
    const body = res.body as TeamBody[];
    expect(res.status).toBe(200);
    expect(body).toHaveLength(2);
    expect(body[0]?.name).toBe("Alpha");
  });
});

describe("POST /api/teams", () => {
  it("creates a team", async () => {
    const res = await request(app).post("/api/teams").send({ name: "Engineering" });
    const body = res.body as TeamBody;
    expect(res.status).toBe(201);
    expect(body.name).toBe("Engineering");
    expect(typeof body._id).toBe("string");
  });

  it("returns 400 when name is missing", async () => {
    const res = await request(app).post("/api/teams").send({});
    const body = res.body as ErrorBody;
    expect(res.status).toBe(400);
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  it("returns 400 when name exceeds 80 chars", async () => {
    const res = await request(app)
      .post("/api/teams")
      .send({ name: "x".repeat(81) });
    expect(res.status).toBe(400);
  });
});

describe("GET /api/projects", () => {
  it("returns empty array when no projects", async () => {
    const res = await request(app).get("/api/projects");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("returns all projects", async () => {
    const team = await TeamModel.create({ name: "Eng" });
    await ProjectModel.create({ name: "Alpha", teamId: team._id });
    const res = await request(app).get("/api/projects");
    const body = res.body as ProjectBody[];
    expect(res.status).toBe(200);
    expect(body).toHaveLength(1);
    expect(body[0]?.teamId).toBe(team._id.toString());
  });
});

describe("POST /api/projects", () => {
  it("creates a project under a team", async () => {
    const team = await TeamModel.create({ name: "Eng" });
    const res = await request(app)
      .post("/api/projects")
      .send({ name: "Frontend", teamId: team._id.toString() });
    const body = res.body as ProjectBody;
    expect(res.status).toBe(201);
    expect(body.name).toBe("Frontend");
    expect(body.teamId).toBe(team._id.toString());
  });

  it("returns 400 when name is missing", async () => {
    const team = await TeamModel.create({ name: "Eng" });
    const res = await request(app).post("/api/projects").send({ teamId: team._id.toString() });
    const body = res.body as ErrorBody;
    expect(res.status).toBe(400);
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });

  it("returns 400 when teamId is missing", async () => {
    const res = await request(app).post("/api/projects").send({ name: "Frontend" });
    const body = res.body as ErrorBody;
    expect(res.status).toBe(400);
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });
});
