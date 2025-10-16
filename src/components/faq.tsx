'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'What is ImageResizeKit and how can it help me?',
    answer: 'ImageResizeKit is a comprehensive, free online tool designed for all your image editing needs. You can easily resize images for social media, convert formats like JPG to PNG, compress large image files to save space, and even use AI to enhance your photos. It\'s a one-stop-shop for image manipulation.',
  },
  {
    question: 'How to Resize Images?',
    answer: '1. **Upload Your Image:** Click the "Click to upload" button or drag and drop your image file into the designated area. 2. **Set Dimensions:** Either choose a preset from the dropdown menu for common sizes or manually enter your desired width and height in pixels. You can lock the aspect ratio to prevent distortion. 3. **Resize & Download:** Click the "Resize & Download" button. Your resized image will be processed and the download will start automatically.',
  },
  {
    question: 'Is this online image editor completely free?',
    answer: 'Yes, all the core features of ImageResizeKit—including our image resizer, format converter, and file compressor—are completely free to use. We aim to provide powerful image tools accessible to everyone, with potential premium features for professional users in the future.',
  },
  {
    question: 'Which image file formats can I work with?',
    answer: 'Our tool supports a wide variety of the most popular image formats. You can upload and convert between JPEG, PNG, WebP, GIF, and even convert images to PDF. This flexibility makes it a powerful free online image converter.',
  },
  {
    question: 'Are the images I upload to ImageResizeKit secure?',
    answer: 'We prioritize your privacy and security. Your images are processed securely on our servers for the sole purpose of applying the edits you request. We do not store your files long-term. For more detailed information, please review our Privacy Policy.',
  },
];

export function Faq() {
  return (
    <section className="py-12 md:py-16">
      <div className="space-y-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Have questions? We've got answers. If you can't find what you're looking for, feel free to contact us.
        </p>
      </div>
      <div className="mt-8 max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-lg">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
