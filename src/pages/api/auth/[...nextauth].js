import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const options = {
    providers: [
        CredentialsProvider({
            name: 'Se connecter',
            credentials: {
                identifier: { label: "Mail", type: "mail", placeholder: "email@example.com" },
                password: { label: "Mot de passe", type: "password" }
            },
            async authorize(credentials, req) {
                const credentialsQuery = { email: credentials.identifier, password: credentials.password };

                const res = await fetch(process.env.NEXT_PUBLIC_API_URL + process.env.API_LOGIN_ROUTE, {
                    method: 'POST',
                    body: JSON.stringify(credentialsQuery),
                    headers: { "Content-Type": "application/json" }
                })

                const user = await res.json();

                // If no error and we have user data, return it
                if (res.ok && user) {
                    return user;
                }

                return res.json({ success: false });
            }
        })
    ],
    pages: {
        signIn: '/',
        signUp: '/signup',
        error: '/',
        signOut: '/'
    },
    secret: process.env.SECRET,
    callbacks: {
        jwt: async ({ token, user }) => {
            user && (token.user = { account: user.account, organizationID: user.organizations[0]._id, token: user.accessToken });
            return token
        },
        session: async ({ session, token }) => {
            session.user = token.user;
            return session
        },
    }
}

const Auth = (req, res) =>
    NextAuth(req, res, options);

export default Auth;
