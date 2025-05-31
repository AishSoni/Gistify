import InquireCodeForm from '@/components/feature-forms/inquire-code-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function InquireCodePage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Inquire About Code</CardTitle>
          <CardDescription className="font-body">
            Ask questions about specific files or sections of your codebase to get AI-powered explanations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InquireCodeForm />
        </CardContent>
      </Card>
    </div>
  );
}
