"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { IoIosAdd } from "react-icons/io";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { addTodo } from "@/supabase/database/todo";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "./ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "./ui/input-group";
const formSchema = z.object({
  task: z
    .string()
    .min(4, "Task must be at least 4 characters.")
    .max(500, "Task must be at most 500 characters."),
});

export default function AddSheet() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      task: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const res = await addTodo(data.task);
    let msg = "";

    if (!res) msg = `Failed to update ${data.task}.`;
    else msg = "Task updated successfully";

    toast(msg, {
      description: (
        <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
    });
  }
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          New Task <IoIosAdd />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add Task</SheetTitle>
          <SheetDescription>
            New todo tasks can be added here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>

        <form
          id="edit-todo-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="py-4 px-4"
        >
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
                      rows={4}
                      className="resize-none"
                      aria-invalid={fieldState.invalid}
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums text-xs">
                        {field.value.length}/500
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
          </FieldGroup>
        </form>

        <SheetFooter>
          <Button type="submit" form="edit-todo-form">
            Save Changes
          </Button>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
