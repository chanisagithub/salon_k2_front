import NextAuth from "next-auth";
import Keycloak from "next-auth/providers/keycloak";

type KeycloakProfile = {
  realm_access?: {
    roles?: unknown;
  };
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Keycloak({
      clientId: process.env.AUTH_KEYCLOAK_ID,
      clientSecret: process.env.AUTH_KEYCLOAK_SECRET,
      issuer: process.env.AUTH_KEYCLOAK_ISSUER,
      authorization: { params: { prompt: "login" } },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
      }
      
      if (profile) {
        // Log profile for debugging in server console
        console.log("Keycloak Profile:", JSON.stringify(profile, null, 2));
        const roles = (profile as KeycloakProfile).realm_access?.roles;
        token.roles = Array.isArray(roles) ? roles.filter((role) => typeof role === "string") : [];
      }
      return token;
    },
    async session({ session, token }) {
      const roles = Array.isArray(token.roles)
        ? token.roles.filter((role): role is string => typeof role === "string")
        : [];

      return {
        ...session,
        accessToken: typeof token.accessToken === "string" ? token.accessToken : undefined,
        roles,
      };
    },
  },
});
