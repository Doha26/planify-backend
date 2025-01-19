// config/index.ts
interface Config {
  auth: {
    secret: string;
    googleClientId: string;
    googleClientSecret: string;
    githubClientId: string;
    githubClientSecret: string;
  };
  database: {
    url: string;
  };
  api: {
    url: string;
  };
}

export const config: Config = {
  auth: {
    secret: process.env.NEXTAUTH_SECRET!,
    googleClientId: process.env.GOOGLE_CLIENT_ID!,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    githubClientId: process.env.GITHUB_CLIENT_ID!,
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET!,
  },
  database: {
    url: process.env.DATABASE_URL!,
  },
  api: {
    url: process.env.NEXT_PUBLIC_API_URL!,
  },
};
