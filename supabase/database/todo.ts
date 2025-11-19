"use server"

import { Tables } from "@/database.types"
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type Todo = Tables<"todos">;

export async function getUserId(){
    const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw Error;
  
  const userId = user.id;
  return userId;
}
export async function getTodos(): Promise<Todo[]> {
  const supabase = await createClient();

  const userId = await getUserId();

  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .eq("user_id", userId);
  if (error) throw error;

  revalidatePath("/todos");

  return data;
}

export async function deleteTodo(id: number) {
  const supabase = await createClient();

  const response = await supabase.from("todos").delete().eq("id", id);

  revalidatePath("/todos");

  return response;
}
