import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nimmana Pavani | AWS Certified Cloud & DevOps Engineer',
  description:
    'Professional portfolio of Nimmana Pavani. AWS Certified Solutions Architect - Associate and Cloud Practitioner with hands-on experience in AWS, Linux, Python and DevOps automation.',
  keywords: [
    'Nimmana Pavani',
    'AWS Certified Solutions Architect',
    'Cloud Engineer',
    'DevOps Fresher',
    'Linux',
    'Python',
    'Terraform',
    'Docker',
    'CI/CD',
    'VPC',
    'EC2',
  ],
  authors: [{ name: 'Nimmana Pavani' }],
  openGraph: {
    title: 'Nimmana Pavani | AWS Certified Cloud & DevOps Engineer',
    description:
      'Cloud-focused Computer Science graduate with hands-on experience in AWS, Linux, Python and DevOps technologies, building secure, scalable and cloud-based solutions.',
    type: 'website',
    locale: 'en_US',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-cyan-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
