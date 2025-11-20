"use server"

import { Tables } from "@/database.types"
import { createClient } from "@/lib/supabase/server";

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
    .eq("user_id", userId)
    .order("id");

  if (error) throw error;
  return data;
}

export async function addTodo(task: string){
  const supabase = await createClient();
  const userId = await getUserId();
  const { data, error } = await supabase
    .from('todos')  
    .insert({ user_id: userId, task: task, is_complete: false})  
    .select()

    if (error) throw error;
      return data;
}

export async function updateTodo(id: number, task: string, is_complete: boolean): Promise<Todo[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("todos")
    .update({task, is_complete})
    .eq('id', id)
    .select()

  if (error) throw error;
  return data;
}

export async function updateStatus(id: number, is_complete: boolean) : Promise<Todo>{
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("todos")
    .update({is_complete})
    .eq('id', id)
    .select()
    .single();


  if (error) throw `Failed in todo.ts ${error}`;
  console.log(data);
  return data;
}

export async function deleteTodo(id: number) {
  const supabase = await createClient();

  const response = await supabase.from("todos").delete().eq("id", id);

  return response;
}
export async function getTodoById(id: number){
  const supabase = await createClient();

  const { data: todo } = await supabase
    .from("todos")
    .select()
    .eq("id", id)
    .single();

    return todo;
}
    