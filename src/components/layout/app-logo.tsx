import { Image as ImageIcon } from 'lucide-react';

export function AppLogo() {
  return (
    <div className="flex items-center justify-center bg-primary rounded-md h-8 w-8">
      <ImageIcon className="h-5 w-5 text-primary-foreground" />
    </div>
  );
}
