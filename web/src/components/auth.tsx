"use client";

import React, { useEffect } from "react";
import { usePlaygroundState } from "@/hooks/use-playground-state";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ArrowUpRight, LockKeyhole } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ellipsisMiddle } from "@/lib/utils";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

const AuthFormSchema = z.object({
  geminiAPIKey: z.string().min(1, { message: "API key is required" }),
});

export function Auth() {
  const { pgState, dispatch, showAuthDialog, setShowAuthDialog } =
    usePlaygroundState();

  const onLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch({ type: "SET_API_KEY", payload: null });
    setShowAuthDialog(true);
  };

  return (
    <div>
      {pgState.geminiAPIKey && (
        <div className="text-xs flex gap-2 items-center">
          <span className="font-semibold text-neutral-400">
            Using Gemini API Key
          </span>
          <div className="py-1 px-2 rounded-md bg-neutral-200 text-neutral-600">
            {ellipsisMiddle(pgState.geminiAPIKey, 4, 4)}
          </div>
          <a className="hover:underline cursor-pointer" onClick={onLogout}>
            Clear
          </a>
        </div>
      )}
      <AuthDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        onAuthComplete={() => setShowAuthDialog(false)}
      />
    </div>
  );
}

export function AuthDialog({
  open,
  onOpenChange,
  onAuthComplete,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAuthComplete: () => void;
}) {
  const { pgState, dispatch } = usePlaygroundState();
  const form = useForm<z.infer<typeof AuthFormSchema>>({
    resolver: zodResolver(AuthFormSchema),
    defaultValues: {
      geminiAPIKey: pgState.geminiAPIKey || "",
    },
  });

  // Add this useEffect hook to watch for changes in pgState.geminiAPIKey
  useEffect(() => {
    form.setValue("geminiAPIKey", pgState.geminiAPIKey || "");
  }, [pgState.geminiAPIKey, form]);

  function onSubmit(values: z.infer<typeof AuthFormSchema>) {
    dispatch({ type: "SET_API_KEY", payload: values.geminiAPIKey || null });
    onOpenChange(false);
    onAuthComplete();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md p-0 border-0 rounded-lg overflow-hidden max-h-[90vh] flex flex-col"
        isModal={true}
      >
        <div className="overflow-y-auto">
          <div className="px-6 pb-6 pt-4 overflow-y-auto">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <DialogHeader className="gap-2">
                  <DialogTitle>
                    Gemini 2.0 Multimodal Live API Playground
                  </DialogTitle>
                  <DialogDescription>
                    Try out Google&apos;s new Gemini 2.0 Multimodal Live API
                    right from your browser with this playground built on{" "}
                    <a
                      href="https://github.com/livekit/agents"
                      target="_blank"
                      className="underline"
                    >
                      LiveKit Agents
                    </a>
                    .
                  </DialogDescription>
                  <DialogDescription>
                    You must have a valid{" "}
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      className="underline text-gemini-blue"
                    >
                      Gemini API key
                    </a>{" "}
                    to connect the playground to your own Gemini platform
                    account.
                  </DialogDescription>
                </DialogHeader>
                <div className="bg-black/10 h-[1px] w-full" />
                <FormField
                  control={form.control}
                  name="geminiAPIKey"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex flex-col gap-2">
                        <FormLabel className="font-semibold text-sm whitespace-nowrap">
                          Enter your{" "}
                          <a
                            href="https://aistudio.google.com/app/apikey"
                            target="_blank"
                            className="inline-flex items-center text-gemini-blue underline"
                          >
                            Gemini API Key
                            <ArrowUpRight className="h-4 w-4 ml-1" />
                          </a>
                        </FormLabel>
                        <div className="flex gap-2 w-full">
                          <FormControl className="w-full">
                            <Input
                              className="w-full"
                              placeholder="Gemini API Key"
                              {...field}
                            />
                          </FormControl>
                          <Button type="submit">Connect</Button>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogDescription className="text-xs py-2 flex justify-between items-center">
                  <div className="flex items-center gap-2 flex-1">
                    <LockKeyhole className="h-3 w-3 flex-shrink-0" />
                    <span className="font-semibold">
                      Your key is stored only in your browser&apos;s
                      LocalStorage.
                    </span>
                  </div>

                  <div className="flex items-center flex-1 justify-end">
                    <a
                      href="https://github.com/livekit-examples/gemini-playground"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline flex items-center gap-1"
                    >
                      <GitHubLogoIcon className="h-5 w-5" />
                      View source on GitHub
                    </a>
                  </div>
                </DialogDescription>
              </form>
            </Form>
          </div>
          <div className="h-[45vh] sm:h-0"></div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
