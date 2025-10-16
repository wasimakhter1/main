import Workspace from '@/components/workspace';

export default function AboutPage() {
  return (
    <Workspace title="About ImageResizeKit" description="Learn more about our mission and tools.">
      <div className="prose dark:prose-invert max-w-none">
        <h2>Our Mission</h2>
        <p>
          ImageResizeKit was created to provide a simple, free, and powerful suite of tools for common image manipulation tasks. We believe that everyone should have access to high-quality image editing tools without the need for expensive software or subscriptions.
        </p>
        
        <h2>What We Offer</h2>
        <p>
          Our platform offers a range of tools to help you with your image needs:
        </p>
        <ul>
          <li><strong>Image Resizer:</strong> Easily resize your images to specific dimensions or use our social media presets.</li>
          <li><strong>Format Converter:</strong> Convert your images between popular formats like JPEG, PNG, WebP, and even PDF.</li>
          <li><strong>Image Compressor:</strong> Reduce the file size of your images without sacrificing quality.</li>
          <li><strong>Image Cropper:</strong> Crop your images to the perfect aspect ratio or select a specific area.</li>
          <li><strong>Image Merger:</strong> Combine multiple images into a single file.</li>
          <li><strong>Bulk Operations:</strong> Process multiple images at once to save time.</li>
        </ul>

        <h2>Privacy Focused</h2>
        <p>
          We respect your privacy. All image processing is done in your browser, meaning your files are never uploaded to our servers. They stay on your device, ensuring your data remains private and secure.
        </p>
        
        <h2>Free to Use</h2>
        <p>
          All our tools are completely free to use. We are passionate about making image editing accessible to everyone.
        </p>
      </div>
    </Workspace>
  );
}
