import { EditForm } from "@/components/ui/edit-form";
import { createClient } from "@/lib/supabase/server";
export default async function EditTodoPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: todo } = await supabase
    .from("todos")
    .select()
    .eq("id", id)
    .single();

  return <EditForm todo={todo} />; // Client component with Server Action
}
