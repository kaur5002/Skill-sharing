import { redirect } from 'next/navigation';

export default function RootPage() {
  // Root page redirects to authPage
  redirect('/authPage');
}