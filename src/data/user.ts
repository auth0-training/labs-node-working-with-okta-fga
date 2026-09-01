import { auth0 } from "@/lib/auth0";

export async function getUserId(): Promise<string | undefined> {
  const session = await auth0.getSession();

  return session?.user?.sub;
}

export async function getUserDTO(): Promise<{
  sub: string | undefined;
  name: string | undefined;
  picture: string | undefined;
}> {
  const session = await auth0.getSession();

  return {
    sub: session?.user?.sub,
    name: session?.user?.name,
    picture: session?.user?.picture,
  };
}
