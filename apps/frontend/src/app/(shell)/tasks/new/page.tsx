import { BreadcrumbNav } from "@/components/molecules/BreadcrumbNav";
import { TaskCreationForm } from "@/components/organisms/TaskCreationForm";

export default function CreateTaskPage() {
  return (
    <div className="p-2xl max-w-5xl">
      <BreadcrumbNav items={[{ label: "Tasks", href: "/board" }, { label: "Create New Task" }]} />
      <h1 className="mt-sm text-h1 text-primary font-semibold tracking-tight">Create New Task</h1>
      <p className="mt-xs text-body-lg text-on-surface-variant">Add a new task to your board.</p>
      <div className="mt-xl">
        <TaskCreationForm />
      </div>
    </div>
  );
}
