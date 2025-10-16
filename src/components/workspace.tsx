import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { ReactNode } from 'react';

type WorkspaceProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export default function Workspace({ title, description, children }: WorkspaceProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-8">
          {children}
        </div>
      </CardContent>
    </Card>
  );
}
