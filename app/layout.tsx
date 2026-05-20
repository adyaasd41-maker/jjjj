import './globals.css';import type { Metadata } from 'next';
export const metadata:Metadata={title:'Family + Cafe Finance',description:'Personal and cafe finance dashboard'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="mn" suppressHydrationWarning><body>{children}</body></html>}
