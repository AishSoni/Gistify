import PrReviewForm from '@/components/feature-forms/pr-review-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrReviewPage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Pull Request Review</CardTitle>
          <CardDescription className="font-body">
            Get an AI-powered analysis of an open pull request, highlighting key changes and potential conflicts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PrReviewForm />
        </CardContent>
      </Card>
    </div>
  );
}
