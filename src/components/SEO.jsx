import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title = "Infinaut - Digital Ecosystems & AI Solutions",
  description = "We combine design, technology, and AI to help businesses grow faster and operate smarter. Creative, Technology, Artificial Intelligence, Digital Growth.",
  keywords = "digital agency, AI solutions, technology consulting, creative agency, artificial intelligence, digital transformation",
  author = "Infinaut",
  url = "https://yourdomain.com",
  image = "https://yourdomain.com/og-image.jpg",
  type = "website"
}) => {
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <html lang="en" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="robots" content="index, follow" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Favicon */}
      <link rel="icon" type="image/png" href="/favicon.png" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Infinaut",
          "url": url,
          "logo": "https://yourdomain.com/logo.png",
          "sameAs": [
            "https://twitter.com/infinaut",
            "https://linkedin.com/company/infinaut",
            "https://github.com/infinaut"
          ],
          "description": description
        })}
      </script>
    </Helmet>
  );
};

export default SEO;