import SolutionPlanningForm from '@/components/feature-forms/solution-planning-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SolutionPlanningPage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Solution Planning</CardTitle>
          <CardDescription className="font-body">
            Propose solution plans for open issues in your repository using AI.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SolutionPlanningForm />
        </CardContent>
      </Card>
    </div>
  );
}
