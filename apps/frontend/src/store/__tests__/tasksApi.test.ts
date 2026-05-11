// @vitest-environment node
import { describe, it, expect } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "../../test/msw/server";
import { defaultTasks } from "../../test/msw/handlers";
import { setupTestStore } from "../testUtils";
import { tasksApi } from "../tasksApi";

describe("tasksApi", () => {
  describe("getTasks", () => {
    it("fetches and caches the task list", async () => {
      const store = setupTestStore();
      await store.dispatch(tasksApi.endpoints.getTasks.initiate(undefined));

      const result = tasksApi.endpoints.getTasks.select(undefined)(store.getState());
      expect(result.isSuccess).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(result.data?.[0]?._id).toBe("task-1");
    });
  });

  describe("createTask", () => {
    it("creates a task and returns it with status 201", async () => {
      const store = setupTestStore();
      const result = await store.dispatch(
        tasksApi.endpoints.createTask.initiate({ title: "New task" }),
      );
      expect("data" in result).toBe(true);
      if ("data" in result && result.data) {
        expect(result.data.title).toBe("New task");
        expect(result.data.status).toBe("todo");
      }
    });
  });

  describe("moveTask — optimistic update", () => {
    it("immediately updates the cache before server responds", async () => {
      // Capture the move request so we can hold it in-flight
      let resolveMove!: () => void;
      const moveHeld = new Promise<void>((res) => {
        resolveMove = res;
      });

      server.use(
        http.patch("http://localhost:4000/api/tasks/:id/move", async () => {
          await moveHeld; // hold in-flight
          return HttpResponse.json({ ...defaultTasks[0], status: "in-progress", order: 0 });
        }),
      );

      const store = setupTestStore();
      // Seed cache
      await store.dispatch(tasksApi.endpoints.getTasks.initiate(undefined));

      // Fire move — do NOT await
      void store.dispatch(
        tasksApi.endpoints.moveTask.initiate({
          id: "task-1",
          body: { status: "in-progress", order: 0 },
        }),
      );

      // Optimistic state is visible immediately
      const optimistic = tasksApi.endpoints.getTasks.select(undefined)(store.getState());
      const updatedTask = optimistic.data?.find((t) => t._id === "task-1");
      expect(updatedTask?.status).toBe("in-progress");

      // Unblock the server response
      resolveMove();
    });

    it("rolls back the cache when the server returns an error", async () => {
      server.use(
        http.patch("http://localhost:4000/api/tasks/:id/move", () =>
          HttpResponse.json(
            { error: { code: "NOT_FOUND", message: "Task not found" } },
            { status: 404 },
          ),
        ),
        // Refetch after rollback
        http.get("http://localhost:4000/api/tasks", () => HttpResponse.json(defaultTasks)),
      );

      const store = setupTestStore();
      await store.dispatch(tasksApi.endpoints.getTasks.initiate(undefined));

      await store.dispatch(
        tasksApi.endpoints.moveTask.initiate({
          id: "task-1",
          body: { status: "done", order: 0 },
        }),
      );

      // After failed mutation + refetch, task-1 is back to "todo"
      const result = tasksApi.endpoints.getTasks.select(undefined)(store.getState());
      const restored = result.data?.find((t) => t._id === "task-1");
      expect(restored?.status).toBe("todo");
    });
  });

  describe("error normalisation", () => {
    it("normalises a 400 server error to ApiError shape", async () => {
      server.use(
        http.post("http://localhost:4000/api/tasks", () =>
          HttpResponse.json(
            { error: { code: "VALIDATION_ERROR", message: "Validation failed" } },
            { status: 400 },
          ),
        ),
      );

      const store = setupTestStore();
      const result = await store.dispatch(tasksApi.endpoints.createTask.initiate({ title: "" }));

      expect("error" in result).toBe(true);
      if ("error" in result) {
        const err = result.error as { error: { code: string } };
        expect(err.error.code).toBe("VALIDATION_ERROR");
      }
    });

    it("normalises a network failure to NETWORK_ERROR code", async () => {
      server.use(http.get("http://localhost:4000/api/tasks", () => HttpResponse.error()));

      const store = setupTestStore();
      const result = await store.dispatch(tasksApi.endpoints.getTasks.initiate(undefined));

      expect("error" in result).toBe(true);
      if ("error" in result) {
        const err = result.error as { error: { code: string } };
        expect(err.error.code).toBe("NETWORK_ERROR");
      }
    });
  });
});
