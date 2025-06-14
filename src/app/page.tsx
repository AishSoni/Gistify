import RepositorySummaryForm from '@/components/feature-forms/repository-summary-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function RepositorySummaryPage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Repository Summary</CardTitle>
          <CardDescription className="font-body">
            Enter a GitHub repository URL to get an AI-generated summary of its purpose and structure.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RepositorySummaryForm />
        </CardContent>
      </Card>
    </div>
  );
}
