'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { summarizeRepositoryAction } from '@/app/repository-summary/actions';

const FormSchema = z.object({
  githubUrl: z.string().url({ message: "Please enter a valid GitHub repository URL." }),
});

type FormData = z.infer<typeof FormSchema>;

export default function RepositorySummaryForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      githubUrl: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    setSummary(null);
    try {
      const result = await summarizeRepositoryAction(data);
      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        });
      } else if (result.summary) {
        setSummary(result.summary);
        toast({
          title: "Summary Generated",
          description: "Repository summary successfully generated.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred.",
      });
      console.error("Error summarizing repository:", error);
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
            name="githubUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="githubUrl" className="font-body">GitHub Repository URL</FormLabel>
                <FormControl>
                  <Input
                    id="githubUrl"
                    placeholder="https://github.com/owner/repo"
                    {...field}
                    className="font-body"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto font-body">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Generate Summary
          </Button>
        </form>
      </Form>

      {summary && (
        <Card className="mt-6 shadow-md">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Generated Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap break-words bg-muted p-4 rounded-md text-sm font-code text-muted-foreground">{summary}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
