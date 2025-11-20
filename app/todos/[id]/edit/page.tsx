import { EditForm } from "@/components/edit-form";
import { getTodoById } from "@/supabase/database/todo";
export default async function EditTodoPage({
  params,
}: {
  params: { id: number };
}) {
  const { id } = await params;
  const todo = await getTodoById(id);
  if (!todo) throw Error;

  return <EditForm todo={todo} />; // Client component with Server Action
}
