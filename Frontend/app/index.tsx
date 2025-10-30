import { Redirect } from 'expo-router';

// This is the entry point of the app
// For now, we'll redirect to login screen
// In production, you should check if user is authenticated first
export default function Index() {
  // TODO: Check authentication status
  // For now, always redirect to login
  return <Redirect href="/auth/login" />;
}

