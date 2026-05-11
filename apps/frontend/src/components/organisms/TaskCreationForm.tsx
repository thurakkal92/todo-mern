"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { CreateTaskInput } from "@todo/shared";
import { CreateTaskSchema } from "@todo/shared";
import { useCreateTaskMutation } from "@/store/tasksApi";
import { useErrorToast } from "@/hooks/useErrorToast";
import { isApiError } from "@/lib/apiError";
import { FormSection } from "@/components/molecules/FormSection";
import { FormLabel } from "@/components/atoms/FormLabel";
import { Input } from "@/components/atoms/Input";
import { Textarea } from "@/components/atoms/Textarea";
import { Button } from "@/components/atoms/Button";

export function TaskCreationForm() {
  const router = useRouter();
  const [createTask, { isLoading, error: mutationError }] = useCreateTaskMutation();
  useErrorToast(isApiError(mutationError) ? mutationError : null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTaskInput>({
    resolver: zodResolver(CreateTaskSchema),
  });

  const onSubmit = async (data: CreateTaskInput) => {
    const result = await createTask(data);
    if ("error" in result) return;
    toast.success("Task created successfully!");
    router.push("/board");
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
              inputSize="lg"
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
        </div>
      </FormSection>

      {/* Footer actions */}
      <div className="gap-md flex items-center justify-end">
        <Button
          type="button"
          variant="secondary"
          size="lg"
          onClick={() => {
            router.push("/board");
          }}
        >
          Discard Draft
        </Button>
        <Button type="submit" variant="primary" size="lg" isLoading={isLoading}>
          Create Task
        </Button>
      </div>
    </form>
  );
}
