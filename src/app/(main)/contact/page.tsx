import Workspace from '@/components/workspace';

export default function ContactPage() {
  return (
    <Workspace title="Contact Us" description="We'd love to hear from you.">
      <div className="prose dark:prose-invert max-w-none">
        <h2>Get in Touch</h2>
        <p>
          If you have any questions, feedback, or need support, please don't hesitate to reach out. The best way to contact us is by email.
        </p>
        <p>
          Please send your message to the following email address, and we will get back to you as soon as possible:
        </p>
        <div className="bg-muted p-4 rounded-md text-center">
          <a href="mailto:wasimakhter273@gmail.com" className="font-mono text-lg text-primary hover:underline">
            wasimakhter273@gmail.com
          </a>
        </div>
        
        <h2>Business Inquiries</h2>
        <p>
          For business-related inquiries, partnerships, or other formal matters, please use the same email address and we will direct your message to the appropriate department.
        </p>
      </div>
    </Workspace>
  );
}
