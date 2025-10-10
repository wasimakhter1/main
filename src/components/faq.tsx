'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'What is ImageForge?',
    answer: 'ImageForge is a powerful online tool that allows you to resize, convert, compress, and enhance your images with ease. We also offer AI-powered features to help you get the most out of your images.',
  },
  {
    question: 'Is ImageForge free to use?',
    answer: 'Yes, the basic features of ImageForge are completely free to use. We may introduce premium features in the future.',
  },
  {
    question: 'What file formats do you support?',
    answer: 'We support a wide range of formats, including JPEG, PNG, WebP, and GIF for conversion and processing.',
  },
  {
    question: 'How does the AI Image Enhancer work?',
    answer: 'Our AI Image Enhancer uses advanced generative models to create visually related images based on your source image. You can guide the generation with optional text prompts.',
  },
  {
    question: 'Is my data safe?',
    answer: 'We take your privacy seriously. Images are processed on our servers and are not stored long-term. Please see our Privacy Policy for more details.',
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
