import LoginForm from './login-form';

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ next?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  return <LoginForm nextPath={resolvedSearchParams?.next || '/'} />;
}
