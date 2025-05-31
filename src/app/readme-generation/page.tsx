import ReadmeGenerationForm from '@/components/feature-forms/readme-generation-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ReadmeGenerationPage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">README Generation</CardTitle>
          <CardDescription className="font-body">
            Generate a README file for your codebase based on its description, file structure, and comments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ReadmeGenerationForm />
        </CardContent>
      </Card>
    </div>
  );
}
