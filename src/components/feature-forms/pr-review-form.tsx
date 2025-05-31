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
import { analyzePullRequestAction } from '@/app/pr-review/actions';
import type { AnalyzePullRequestOutput } from '@/ai/flows/pr-review';

const FormSchema = z.object({
  diff: z.string().min(10, { message: "Please paste the PR diff (min 10 characters)." }),
  instructions: z.string().optional(),
});

type FormData = z.infer<typeof FormSchema>;

export default function PrReviewForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [review, setReview] = useState<AnalyzePullRequestOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      diff: "",
      instructions: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    setReview(null);
    try {
      const result = await analyzePullRequestAction(data);
      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        });
      } else if (result.review) {
        setReview(result.review);
        toast({
          title: "PR Review Generated",
          description: "AI analysis of the PR is complete.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred.",
      });
      console.error("Error analyzing PR:", error);
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
            name="diff"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="diff" className="font-body">Pull Request Diff</FormLabel>
                <FormControl>
                  <Textarea
                    id="diff"
                    placeholder="Paste the full PR diff here."
                    {...field}
                    className="min-h-[200px] font-code"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="instructions"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="instructions" className="font-body">Optional Instructions</FormLabel>
                <FormControl>
                  <Textarea
                    id="instructions"
                    placeholder="Any specific instructions for the AI reviewer? (e.g., focus on security, check for performance issues)"
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
            Analyze PR
          </Button>
        </form>
      </Form>

      {review && (
        <Card className="mt-6 shadow-md">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">AI PR Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-headline text-lg">Summary</h3>
              <pre className="whitespace-pre-wrap break-words bg-muted p-3 rounded-md text-sm font-code text-muted-foreground">{review.summary}</pre>
            </div>
            <div>
              <h3 className="font-headline text-lg">Key Changes</h3>
              <ul className="list-disc list-inside bg-muted p-3 rounded-md text-sm font-code text-muted-foreground">
                {review.keyChanges.map((change, index) => <li key={index}>{change}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="font-headline text-lg">Potential Conflicts</h3>
              <ul className="list-disc list-inside bg-muted p-3 rounded-md text-sm font-code text-muted-foreground">
                {review.potentialConflicts.map((conflict, index) => <li key={index}>{conflict}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="font-headline text-lg">Areas for Further Review</h3>
              <ul className="list-disc list-inside bg-muted p-3 rounded-md text-sm font-code text-muted-foreground">
                {review.areasForReview.map((area, index) => <li key={index}>{area}</li>)}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
