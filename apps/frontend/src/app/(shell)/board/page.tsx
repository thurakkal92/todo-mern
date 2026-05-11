import { BoardViewHeader } from "@/components/organisms/BoardViewHeader";
import { BoardContent } from "@/components/organisms/BoardContent";

export default function BoardPage() {
  return (
    <div className="bg-surface-bright container mx-auto flex h-full flex-col md:px-8">
      <BoardViewHeader />
      <BoardContent />
    </div>
  );
}
