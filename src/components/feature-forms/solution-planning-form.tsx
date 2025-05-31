'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { proposeSolutionPlanAction } from '@/app/solution-planning/actions';

const FormSchema = z.object({
  issueTitle: z.string().min(5, { message: "Issue title must be at least 5 characters." }),
  issueDescription: z.string().min(10, { message: "Issue description must be at least 10 characters." }),
  repositoryName: z.string().min(3, { message: "Repository name must be at least 3 characters." }),
  relevantCodebaseContext: z.string().optional(),
});

type FormData = z.infer<typeof FormSchema>;

export default function SolutionPlanningForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [solutionPlan, setSolutionPlan] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      issueTitle: "",
      issueDescription: "",
      repositoryName: "",
      relevantCodebaseContext: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    setSolutionPlan(null);
    try {
      const result = await proposeSolutionPlanAction(data);
      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        });
      } else if (result.solutionPlan) {
        setSolutionPlan(result.solutionPlan);
        toast({
          title: "Solution Plan Generated",
          description: "AI has proposed a solution plan for the issue.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred.",
      });
      console.error("Error proposing solution plan:", error);
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
            name="issueTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="issueTitle" className="font-body">Issue Title</FormLabel>
                <FormControl>
                  <Input id="issueTitle" placeholder="e.g., Fix login button responsiveness" {...field} className="font-body" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="repositoryName"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="repositoryName" className="font-body">Repository Name</FormLabel>
                <FormControl>
                  <Input id="repositoryName" placeholder="e.g., my-awesome-app" {...field} className="font-body" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="issueDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="issueDescription" className="font-body">Issue Description</FormLabel>
                <FormControl>
                  <Textarea
                    id="issueDescription"
                    placeholder="Detailed description of the issue, including steps to reproduce if applicable."
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
            name="relevantCodebaseContext"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="relevantCodebaseContext" className="font-body">Relevant Codebase Context (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    id="relevantCodebaseContext"
                    placeholder="Paste relevant code snippets, file paths, or architectural notes that might help the AI."
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
            Propose Solution
          </Button>
        </form>
      </Form>

      {solutionPlan && (
        <Card className="mt-6 shadow-md">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Proposed Solution Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap break-words bg-muted p-4 rounded-md text-sm font-code text-muted-foreground">{solutionPlan}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
