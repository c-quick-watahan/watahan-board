"use client";
import { MdDeleteForever } from "react-icons/md";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

import { useEffect, useState } from "react";
import {
  deleteTodo,
  getTodos,
  getUserId,
  Todo,
  updateStatus,
} from "@/supabase/database/todo";
import { SkeletonCard } from "@/components/ui/skeleton-card";
import { toast } from "sonner";
import AddSheet from "@/components/add-sheet";

function truncateString(str: string) {
  const maxLength: number = 30;
  if (str.length > maxLength) {
    return str.slice(0, maxLength - 3) + "...";
  }
  return str;
}

export default function Instruments() {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>("");
  const [todos, setTodos] = useState<Todo[]>();

  useEffect(() => {
    const fetchData = async () => {
      const [todos, userId] = await Promise.all([getTodos(), getUserId()]);

      setTodos(todos);
      setUserId(userId);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleStatusUpdate = async (
    id: number,
    is_complete: boolean | null
  ) => {
    if (is_complete == null) throw "is null";
    const res = await updateStatus(id, !is_complete);
    if (!res) throw "Unsuccessful status update";

    const todos = await getTodos();
    setTodos(todos);
    toast("Status updated", {
      description: (
        <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
          <code>{JSON.stringify(id, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
    });
  };

  const handleDelete = async (id: number) => {
    const response = await deleteTodo(id);
    let msg = "";
    if (response.error) msg = `${response.error}`;
    else msg = "Task deleted successfully";

    toast(msg, {
      description: (
        <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
          <code>{JSON.stringify(id, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
    });
    setTodos(todos?.filter((todo) => todo.id !== id));
  };

  if (loading) {
    return <SkeletonCard />; // Your loading UI
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Your Tasks: {userId}
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              {todos?.length} tasks total
            </p>
          </div>
          <AddSheet />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {todos &&
            todos.map((item, index) => (
              <Card
                key={index}
                className="w-full hover:shadow-lg transition-shadow duration-200 border-slate-200 dark:border-slate-700"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg leading-tight flex-1">
                      {item.task ? truncateString(item.task) : item.task}
                    </CardTitle>
                    <CardAction>
                      <button
                        onClick={async () => handleDelete(item.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <MdDeleteForever className="h-5 w-5" />
                      </button>
                    </CardAction>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-medium ${
                        item.is_complete
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}
                    >
                      {item.is_complete ? "✓ Done" : "○ Pending"}
                    </span>
                  </div>
                </CardContent>

                <CardFooter className="flex gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    variant={item.is_complete ? "outline" : "default"}
                    className="flex-1"
                    size="sm"
                    onClick={async () =>
                      handleStatusUpdate(item.id, item.is_complete)
                    }
                  >
                    {item.is_complete ? "Reopen" : "Complete"}
                  </Button>
                  <Link href={`todos/${item.id}/edit`}>
                    <Button variant="ghost" size="sm" className="flex-1">
                      Edit
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
        </div>

        {(!todos || todos.length === 0) && (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400">
              No tasks yet. Create your first todo!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
