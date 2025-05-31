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
import { generateReadmeAction } from '@/app/readme-generation/actions';
import { Input } from '@/components/ui/input';

const FormSchema = z.object({
  codebaseDescription: z.string().min(10, { message: "Codebase description must be at least 10 characters." }),
  projectFiles: z.string().min(1, { message: "Please list at least one project file." }),
  comments: z.string().min(10, { message: "Please provide some code comments or context (min 10 characters)." }),
});

type FormData = z.infer<typeof FormSchema>;

export default function ReadmeGenerationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [readmeContent, setReadmeContent] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      codebaseDescription: "",
      projectFiles: "",
      comments: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    setReadmeContent(null);
    try {
      const projectFilesArray = data.projectFiles.split(',').map(file => file.trim()).filter(file => file.length > 0);
      if (projectFilesArray.length === 0) {
        form.setError("projectFiles", { type: "manual", message: "Please provide at least one project file name."});
        setIsLoading(false);
        return;
      }

      const result = await generateReadmeAction({
        ...data,
        projectFiles: projectFilesArray,
      });

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        });
      } else if (result.readmeContent) {
        setReadmeContent(result.readmeContent);
        toast({
          title: "README Generated",
          description: "AI has generated a README for your project.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred.",
      });
      console.error("Error generating README:", error);
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
                    placeholder="Describe what your project does, its main features, and technologies used."
                    {...field}
                    className="min-h-[100px] font-body"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="projectFiles"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="projectFiles" className="font-body">Project Files (comma-separated)</FormLabel>
                <FormControl>
                  <Input
                    id="projectFiles"
                    placeholder="e.g., src/index.js, components/Button.tsx, main.py"
                    {...field}
                    className="font-body"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="comments"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="comments" className="font-body">Key Code Comments / Context</FormLabel>
                <FormControl>
                  <Textarea
                    id="comments"
                    placeholder="Paste important code comments, or explain key parts of your code structure."
                    {...field}
                    className="min-h-[150px] font-code"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto font-body">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Generate README
          </Button>
        </form>
      </Form>

      {readmeContent && (
        <Card className="mt-6 shadow-md">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Generated README.md</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap break-words bg-muted p-4 rounded-md text-sm font-code text-muted-foreground">{readmeContent}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
