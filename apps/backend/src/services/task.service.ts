import { Types } from "mongoose";
import type { FilterQuery } from "mongoose";
import type { CreateTaskInput, UpdateTaskInput, MoveTaskInput, TaskStatus } from "@todo/shared";
import { TaskModel } from "../models/task.model";
import type { ITask } from "../models/task.model";
import { NotFoundError } from "../lib/errors";

const REBALANCE_THRESHOLD = 1e-9;

async function rebalanceIfNeeded(status: TaskStatus, projectId?: string): Promise<void> {
  const filter: FilterQuery<ITask> = { status };
  if (projectId) filter.projectId = new Types.ObjectId(projectId);
  const tasks = await TaskModel.find(filter).sort({ order: 1 }).lean();
  const needsRebalance = tasks.some((task, i) => {
    if (i === 0) return false;
    const prev = tasks[i - 1];
    return prev !== undefined && Math.abs(task.order - prev.order) < REBALANCE_THRESHOLD;
  });

  if (!needsRebalance) return;

  await Promise.all(tasks.map((task, i) => TaskModel.updateOne({ _id: task._id }, { order: i })));
}

export const taskService = {
  async getAll(projectId?: string): Promise<ITask[]> {
    let filter: FilterQuery<ITask>;
    if (projectId === "none") {
      filter = { projectId: { $exists: false } };
    } else if (projectId) {
      filter = { projectId: new Types.ObjectId(projectId) };
    } else {
      filter = {};
    }
    return TaskModel.find(filter).sort({ status: 1, order: 1 });
  },

  async create(input: CreateTaskInput): Promise<ITask> {
    const status = input.status;
    const filter: FilterQuery<ITask> = { status };
    if (input.projectId) filter.projectId = new Types.ObjectId(input.projectId);
    const lastTask = await TaskModel.findOne(filter).sort({ order: -1 }).lean();
    const order = lastTask !== null ? lastTask.order + 1 : 0;
    return TaskModel.create({
      title: input.title,
      description: input.description,
      status,
      order,
      dueDate: input.dueDate,
      ...(input.projectId ? { projectId: new Types.ObjectId(input.projectId) } : {}),
    });
  },

  async update(id: string, input: UpdateTaskInput): Promise<ITask> {
    const task = await TaskModel.findByIdAndUpdate(id, input, {
      new: true,
      runValidators: true,
    });
    if (!task) throw new NotFoundError("Task");
    return task;
  },

  async move(id: string, input: MoveTaskInput): Promise<ITask> {
    const task = await TaskModel.findByIdAndUpdate(
      id,
      { status: input.status, order: input.order },
      { new: true },
    );
    if (!task) throw new NotFoundError("Task");
    await rebalanceIfNeeded(input.status, task.projectId?.toString());
    const refreshed = await TaskModel.findById(task._id);
    if (!refreshed) throw new NotFoundError("Task");
    return refreshed;
  },

  async remove(id: string): Promise<void> {
    const result = await TaskModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundError("Task");
  },
};
