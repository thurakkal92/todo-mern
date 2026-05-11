import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { createApp } from "../../app";

interface HealthResponse {
  status: string;
  db: string;
  timestamp: string;
}

describe("GET /health", () => {
  let mongod: MongoMemoryServer;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
  });

  it("returns status ok with db connected", async () => {
    const app = createApp();
    const res = await request(app).get("/health");
    const body = res.body as HealthResponse;
    expect(res.status).toBe(200);
    expect(body).toMatchObject({ status: "ok", db: "connected" });
    expect(typeof body.timestamp).toBe("string");
  });
});
