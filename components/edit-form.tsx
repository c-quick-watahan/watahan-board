"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Todo } from "@/lib/types/todos";

const formSchema = z.object({
  task: z
    .string()
    .min(4, "Task must be at least 4 characters.")
    .max(500, "Task must be at most 500 characters."),
  is_complete: z.boolean(),
});

export function EditForm({ todo }: { todo: Todo }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      task: todo.task,
      is_complete: todo.is_complete,
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    toast("Task updated successfully", {
      description: (
        <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
    });
    console.log(data);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-2xl mx-auto">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Edit Task</CardTitle>
            <CardDescription>
              Update your task details and completion status.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form id="edit-todo-form" onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <Controller
                  name="task"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="edit-todo-task">
                        Task Description
                      </FieldLabel>
                      <InputGroup>
                        <InputGroupTextarea
                          {...field}
                          id="edit-todo-task"
                          placeholder="Enter your task description..."
                          rows={6}
                          className="min-h-32 resize-y"
                          aria-invalid={fieldState.invalid}
                        />
                        <InputGroupAddon align="block-end">
                          <InputGroupText className="tabular-nums">
                            {field.value.length}/500 characters
                          </InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                      <FieldDescription>
                        Provide a clear description of what needs to be done.
                      </FieldDescription>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="is_complete"
                  control={form.control}
                  render={({ field }) => (
                    <Field>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="edit-todo-complete"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-2 focus:ring-primary"
                        />
                        <FieldLabel
                          htmlFor="edit-todo-complete"
                          className="mb-0"
                        >
                          Mark as completed
                        </FieldLabel>
                      </div>
                      <FieldDescription>
                        Check this box when the task is finished.
                      </FieldDescription>
                    </Field>
                  )}
                />
              </FieldGroup>
            </form>
          </CardContent>
          <CardFooter>
            <Field orientation="horizontal">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
              >
                Reset
              </Button>
              <Button type="submit" form="edit-todo-form">
                Save Changes
              </Button>
            </Field>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
