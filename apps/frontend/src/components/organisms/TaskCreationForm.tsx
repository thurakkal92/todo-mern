"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import type { Task, TaskStatus } from "@todo/shared";
import { TaskStatusSchema } from "@todo/shared";
import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useMoveTaskMutation,
  useGetTasksQuery,
} from "@/store/tasksApi";
import { useGetProjectsQuery } from "@/store/workspaceApi";
import { useAppSelector } from "@/store/hooks";
import { useErrorToast } from "@/hooks/useErrorToast";
import { isApiError } from "@/lib/apiError";
import { FormSection } from "@/components/molecules/FormSection";
import { FormLabel } from "@/components/atoms/FormLabel";
import { Input } from "@/components/atoms/Input";
import { Textarea } from "@/components/atoms/Textarea";
import { Select } from "@/components/atoms/Select";
import { Button } from "@/components/atoms/Button";

const TaskFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be 100 characters or fewer"),
  description: z.string().max(500, "Description must be 500 characters or fewer").optional(),
  status: TaskStatusSchema,
  dueDate: z.string().optional(),
  projectId: z.string().optional(),
});
type TaskFormValues = z.infer<typeof TaskFormSchema>;

interface TaskCreationFormProps {
  defaultStatus?: TaskStatus;
  task?: Task;
  onSuccess?: () => void;
  onCancel?: () => void;
  defaultProjectId?: string;
}

export function TaskCreationForm({
  defaultStatus = "todo",
  task,
  onSuccess,
  onCancel,
  defaultProjectId,
}: TaskCreationFormProps) {
  const router = useRouter();
  const isEditMode = task !== undefined;

  const activeProjectId = useAppSelector((state) => state.workspace.activeProjectId);
  const { data: projects = [] } = useGetProjectsQuery(undefined);

  const { data: allTasks } = useGetTasksQuery(activeProjectId ?? undefined);
  const [createTask, { isLoading: isCreating, error: createError }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating, error: updateError }] = useUpdateTaskMutation();
  const [moveTask, { isLoading: isMoving, error: moveError }] = useMoveTaskMutation();

  useErrorToast(isApiError(createError) ? createError : null);
  useErrorToast(isApiError(updateError) ? updateError : null);
  useErrorToast(isApiError(moveError) ? moveError : null);

  const isLoading = isCreating || isUpdating || isMoving;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(TaskFormSchema),
    defaultValues: isEditMode
      ? {
          title: task.title,
          description: task.description ?? "",
          status: task.status,
          dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
          projectId: task.projectId ?? "",
        }
      : {
          status: defaultStatus,
          dueDate: "",
          projectId: defaultProjectId ?? activeProjectId ?? "",
        },
  });

  const onSubmit = async (data: TaskFormValues) => {
    const dueDate = data.dueDate === "" ? undefined : data.dueDate;
    const projectId = data.projectId === "" ? undefined : data.projectId;

    if (isEditMode) {
      const updateResult = await updateTask({
        id: task._id,
        body: { title: data.title, description: data.description, dueDate },
      });
      if ("error" in updateResult) return;

      if (data.status !== task.status) {
        const colTasks = (allTasks ?? [])
          .filter((t) => t.status === data.status)
          .sort((a, b) => a.order - b.order);
        const last = colTasks[colTasks.length - 1];
        const newOrder = last !== undefined ? last.order + 1 : 0;
        const moveResult = await moveTask({
          id: task._id,
          body: { status: data.status, order: newOrder },
          ...(activeProjectId !== null ? { projectId: activeProjectId } : {}),
        });
        if ("error" in moveResult) return;
      }

      toast.success("Task updated!");
    } else {
      const result = await createTask({
        title: data.title,
        description: data.description,
        status: data.status,
        dueDate,
        projectId,
      });
      if ("error" in result) return;
      toast.success("Task created successfully!");
    }

    if (onSuccess) onSuccess();
    else router.push("/board");
  };

  return (
    <form
      onSubmit={(e) => {
        void handleSubmit(onSubmit)(e);
      }}
      noValidate
      className="gap-lg flex flex-col"
    >
      <FormSection>
        <div className="gap-lg flex flex-col">
          {/* Title */}
          <div className="gap-sm flex flex-col">
            <FormLabel htmlFor="title" required>
              Title
            </FormLabel>
            <Input
              id="title"
              inputSize="md"
              placeholder="What needs to be done?"
              {...(errors.title?.message ? { error: errors.title.message } : {})}
              {...register("title")}
            />
          </div>

          {/* Description */}
          <div className="gap-sm flex flex-col">
            <FormLabel htmlFor="description">Description</FormLabel>
            <Textarea
              id="description"
              placeholder="Add more detail about this task (optional)…"
              {...(errors.description?.message ? { error: errors.description.message } : {})}
              {...register("description")}
            />
          </div>

          {/* Project */}
          <div className="gap-sm flex flex-col">
            <FormLabel htmlFor="projectId">Project</FormLabel>
            <Select
              id="projectId"
              {...(errors.projectId?.message ? { error: errors.projectId.message } : {})}
              {...register("projectId")}
            >
              <option value="">No project</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </Select>
          </div>

          {/* Status + Due Date */}
          <div className="gap-lg grid grid-cols-2">
            <div className="gap-sm flex flex-col">
              <FormLabel htmlFor="status" required>
                Status
              </FormLabel>
              <Select
                id="status"
                {...(errors.status?.message ? { error: errors.status.message } : {})}
                {...register("status")}
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </Select>
            </div>

            <div className="gap-sm flex flex-col">
              <FormLabel htmlFor="dueDate">Due Date</FormLabel>
              <Controller
                name="dueDate"
                control={control}
                render={({ field }) => (
                  <Input
                    id="dueDate"
                    type="date"
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    {...(errors.dueDate?.message ? { error: errors.dueDate.message } : {})}
                  />
                )}
              />
            </div>
          </div>
        </div>
      </FormSection>

      <div className="gap-md flex items-center justify-end">
        <Button
          type="button"
          variant="secondary"
          size="lg"
          onClick={() => {
            if (onCancel) onCancel();
            else router.push("/board");
          }}
        >
          {isEditMode ? "Cancel" : "Discard Draft"}
        </Button>
        <Button type="submit" variant="primary" size="lg" isLoading={isLoading}>
          {isEditMode ? "Save Changes" : "Create Task"}
        </Button>
      </div>
    </form>
  );
}
