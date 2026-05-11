import type { CreateTaskInput, UpdateTaskInput, MoveTaskInput, TaskStatus } from "@todo/shared";
import { TaskModel } from "../models/task.model";
import type { ITask } from "../models/task.model";
import { NotFoundError } from "../lib/errors";

const REBALANCE_THRESHOLD = 1e-9;

async function rebalanceIfNeeded(status: TaskStatus): Promise<void> {
  const tasks = await TaskModel.find({ status }).sort({ order: 1 }).lean();
  const needsRebalance = tasks.some((task, i) => {
    if (i === 0) return false;
    const prev = tasks[i - 1];
    return prev !== undefined && Math.abs(task.order - prev.order) < REBALANCE_THRESHOLD;
  });

  if (!needsRebalance) return;

  await Promise.all(tasks.map((task, i) => TaskModel.updateOne({ _id: task._id }, { order: i })));
}

export const taskService = {
  async getAll(): Promise<ITask[]> {
    return TaskModel.find().sort({ status: 1, order: 1 });
  },

  async create(input: CreateTaskInput): Promise<ITask> {
    const lastTask = await TaskModel.findOne({ status: "todo" }).sort({ order: -1 }).lean();
    const order = lastTask !== null ? lastTask.order + 1 : 0;
    return TaskModel.create({ ...input, status: "todo", order });
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
    await rebalanceIfNeeded(input.status);
    // Refetch so toJSON reflects any rebalanced order
    const refreshed = await TaskModel.findById(task._id);
    if (!refreshed) throw new NotFoundError("Task");
    return refreshed;
  },

  async remove(id: string): Promise<void> {
    const result = await TaskModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundError("Task");
  },
};
