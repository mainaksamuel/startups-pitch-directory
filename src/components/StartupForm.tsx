"use client";

import { useActionState, useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

import { formSchema } from "@/lib/validation";
import MDEditor from "@uiw/react-md-editor";
import { Send } from "lucide-react";
import { Button } from "./ui/button";
import { ZodError } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

import { createPitch } from "@/lib/actions";

interface StartupFormState {
  fieldErrors: Record<string, string>;
  error: string;
  status: string;
}

export default function StartupForm() {
  const [pitch, setPitch] = useState<string | undefined>("");
  const router = useRouter();
  const { toast } = useToast();

  const handleFormSubmit = async (
    prevState: StartupFormState,
    formData: FormData,
  ) => {
    // reset form state when processing a resubmission in order to get latest errors (if any)
    prevState = {
      fieldErrors: {},
      error: "",
      status: "",
    };

    try {
      const formValues = {
        title: formData.get("title"),
        description: formData.get("description"),
        category: formData.get("category"),
        image: formData.get("image"),
        pitch,
      };

      await formSchema.parseAsync(formValues);

      const result = await createPitch(formData, pitch!); // pitch will have been validated by the formSchema

      if (result.status === "SUCCESS") {
        toast({
          title: "Success",
          description: "Your statup pitch has been created successfully",
        });
        router.push(`/startup/${result._id}`);
      }

      return result;
    } catch (errors: any) {
      if (errors instanceof ZodError) {
        for (const err of errors?.issues) {
          // ZodError [https://zod.dev/?id=error-handling]
          const field = err.path[0];
          prevState.fieldErrors[field] = err.message;
        }

        toast({
          title: "Error",
          description: "Please check your inputs and try again.",
          variant: "destructive",
        });

        return { ...prevState, error: "Validation failed.", status: "ERROR" };
      }

      toast({
        title: "Error",
        description: "An unexpected error has occured",
        variant: "destructive",
      });

      return {
        ...prevState,
        error: "An unexpected error has occurred.",
        status: "ERROR",
      };
    } finally {
      setPitch("");
    }
  };

  const [state, formAction, isPending] = useActionState(handleFormSubmit, {
    fieldErrors: {},
    error: "",
    status: "INITIAL",
  });

  return (
    <>
      <form action={formAction} className="startup-form">
        <div>
          <label htmlFor="title" className="startup-form_label">
            Title
          </label>
          <Input
            id="title"
            name="title"
            className="startup-form_input"
            required
            placeholder="Startup Title"
          />
          {state.fieldErrors.title && (
            <p className="startup-form_error">{state.fieldErrors.title}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="startup-form_label">
            Description
          </label>
          <Textarea
            id="description"
            name="description"
            className="startup-form_textarea"
            required
            placeholder="Startup Description"
          />
          {state.fieldErrors.description && (
            <p className="startup-form_error">
              {state.fieldErrors.description}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="category" className="startup-form_label">
            Category
          </label>
          <Input
            id="category"
            name="category"
            className="startup-form_input"
            required
            placeholder="Startup Category (Tech, Health, Education, etc.)"
          />
          {state.fieldErrors.category && (
            <p className="startup-form_error">{state.fieldErrors.category}</p>
          )}
        </div>

        <div>
          <label htmlFor="image" className="startup-form_label">
            Image URL
          </label>
          <Input
            id="image"
            name="image"
            className="startup-form_input"
            required
            placeholder="Startup Image URL"
          />
          {state.fieldErrors.image && (
            <p className="startup-form_error">{state.fieldErrors.image}</p>
          )}
        </div>

        <div data-color-mode="light">
          <label htmlFor="pitch" className="startup-form_label">
            Pitch
          </label>
          <MDEditor
            id="pitch"
            value={pitch}
            onChange={(value) => setPitch(value)}
            preview="edit"
            height={300}
            style={{ borderRadius: 20, overflow: "hidden" }}
            textareaProps={{
              placeholder:
                "Briefly describe your idea and what problem it solves.",
            }}
            previewOptions={{
              disallowedElements: ["style"],
            }}
          />
          {state.fieldErrors.pitch && (
            <p className="startup-form_error">{state.fieldErrors.pitch}</p>
          )}
        </div>

        <Button
          type="submit"
          className="startup-form_btn text-white"
          disabled={isPending}
        >
          {isPending ? "Submitting..." : "Submit Your Pitch"}
          <Send className="size-6 ml-2" />
        </Button>
      </form>
    </>
  );
}
