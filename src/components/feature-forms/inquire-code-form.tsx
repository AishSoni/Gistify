'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { inquireAboutCodeAction } from '@/app/inquire-code/actions';

const FormSchema = z.object({
  codebaseDescription: z.string().min(10, { message: "Please provide a brief description of the codebase (min 10 characters)." }),
  fileContent: z.string().min(10, { message: "Please provide the content of the file (min 10 characters)." }),
  question: z.string().min(5, { message: "Please enter your question (min 5 characters)." }),
});

type FormData = z.infer<typeof FormSchema>;

export default function InquireCodeForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      codebaseDescription: "",
      fileContent: "",
      question: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    setAnswer(null);
    try {
      const result = await inquireAboutCodeAction(data);
      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        });
      } else if (result.answer) {
        setAnswer(result.answer);
        toast({
          title: "Answer Received",
          description: "AI has responded to your inquiry.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred.",
      });
      console.error("Error inquiring about code:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="codebaseDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="codebaseDescription" className="font-body">Codebase Description</FormLabel>
                <FormControl>
                  <Textarea
                    id="codebaseDescription"
                    placeholder="Briefly describe the overall project or codebase."
                    {...field}
                    className="min-h-[100px] font-code"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fileContent"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="fileContent" className="font-body">File Content / Code Snippet</FormLabel>
                <FormControl>
                  <Textarea
                    id="fileContent"
                    placeholder="Paste the content of the specific file or code snippet here."
                    {...field}
                    className="min-h-[150px] font-code"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="question"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="question" className="font-body">Your Question</FormLabel>
                <FormControl>
                  <Textarea
                    id="question"
                    placeholder="What would you like to know about this code?"
                    {...field}
                    className="min-h-[80px] font-body"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto font-body">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Ask AI
          </Button>
        </form>
      </Form>

      {answer && (
        <Card className="mt-6 shadow-md">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">AI's Answer</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap break-words bg-muted p-4 rounded-md text-sm font-code text-muted-foreground">{answer}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
