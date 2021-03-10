---
layout: layouts/post.liquid
tags: post
title: Predictable React authentication with the Context API
author: francisco-sousa
category: development
date: 2021-03-08T10:13:46.904Z
long_description: Managing authentication in React might feel like a
  non-intuitive task for many, due to the difficulty of maintaining global state
  on React. In this blog post, I make a not-so-deep dive, but still deep enough
  to make an intro to React's Context API and ways of keeping the global auth
  state without 3rd party dependencies.
metadata:
  image: /images/react-auth-featured.jpg
  image_alt: A security guard in front of a building
  description: Managing authentication in React might feel like a non-intuitive
    task for many, due to the difficulty of maintaining global state on React.
    However, React's context API is a great way of solving that, and in this
    blog post, I'm going to show you how.
  keywords: react, context, authentication, state, tutorial, learning
---

Despite there being many React and authentication tutorials out there, I feel like I showcased this to too many people I mentored over the past few months, so, this is a good time to share it with a greater audience. Let’s get to it.

Authentication in React used to be a little tricky to handle, way back in prehistoric pre-hooks time. When I started learning React in 2017, using high-order components to handle authentication or delegating it to Redux was the usual way. Some projects I’ve worked with just didn’t deal with it at all, just having a server-rendered login page that would only get to the React app after you effectively logged in. To be honest, I don’t really remember the exact details, so I’m just gonna skip right ahead to what I know.

## Praise be the Context

`useContext` is our best bet today. I use it a ton for both complex, app-wide state management, or even on smaller multi-component APIs, like making a re-usable dropdown component (it's how the [reach-ui](https://reach.tech/menu-button/) folks do it). [Kent’s blog post](https://kentcdodds.com/blog/application-state-management-with-react) is a great way to learn a bit more about the context API and how to use it effectively if you have never heard of it before.

So, in order to manage authentication, we will use React’s context API to make it available for every component on the app, so you can easily implement classic login/logout/sign-up logic on your projects.

## Some disclaimers

I am going to assume that you have some sort of backend already set up. The examples I am going to show you are present on our [phoenix starter template](https://github.com/finiam/phoenix_starter). You can replace the API calls here with anything you have available. All of the code on this tutorial is there.

Also, this is probably not ideal for 3rd party OAuth providers. To integrate with providers like Auth0, Google, Facebook, and others you should use their own SDKs instead of using the patterns I am going to show you. It’s just easier and their tools usually handle all of this.

On our work, at Finiam, we either use the already existing client API, which rarely includes OAuth providers, or we just roll out our own.

## Time to code

So, for our authentication management component, we have some basic requirements:
- Allow login info to be submitted
- Allow sign-up info to be submitted
- Allow a user to logout
- Check if a current user is logged in upon loading the app.

The plan is to provide these operations for the entire app using React’s context API and make them available with a simple `useAuth` hook, that allows us to read and manipulate the authentication.

Now the first step is to communicate with your authentication backend. We are going to make simple HTTP calls with [redaxios](https://github.com/developit/redaxios). We just communicate with a few endpoints that manipulate server-side cookies to manage auth. There is no need to send authorization headers or manage tokens because all of the authentication is handled on the server-side and the browser just picks it up. We just make the HTTP calls and the server handles everything!

If your backend handles with something like JWT bearer tokens, you can use `localStorage` for that. You just need to modify your HTTP client to use the returned token on all of the following requests. You can also store it on local storage so users should not login every time. Be advised, that for web applications, server-side cookie authentication still offers the best security! Check [this blog post](https://www.rdegges.com/2018/please-stop-using-local-storage/) for an accurate explanation about that.

The code to interact with the sessions API, which handles login and logout.
`api/sessions.tsx`
```tsx
import redaxios from "redaxios";

export async function login(params: {
  email: string;
  password: string;
}): Promise<User> {
  const response = await redaxios.post("/api/sessions", { session: params });

  return response.data.data;
}

export async function logout() {
  const response = await redaxios.delete("/api/sessions");

  return response.data.data;
}
```
And the code to interact with the users API, that signs up users or fetches the currently authenticated user in the session.
`api/users.tsx`
```tsx
import redaxios from "redaxios";

export async function getCurrentUser(): Promise<User> {
  const response = await redaxios.get("/api/user");

  return response.data.data;
}

export async function signUp(params: {
  email: string;
  name: string;
  password: string;
}): Promise<User> {
  const response = await redaxios.post("/api/user", { user: params });

  return response.data.data;
}
```

All the methods above throw an error if something happens. Validation errors, wrong passwords, users not logged in, and other things like network errors and such.

Now, on to the context API stuff.

`useAuth.tsx`
```tsx
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useHistory } from "react-router-dom";
import * as sessionsApi from "./api/sessions";
import * as usersApi from "./api/users";

interface AuthContextType {
  // We defined the user type in `index.d.ts`, but it's
  // a simple object with email, name and password.
  user?: User;
  loading: boolean;
  error?: any;
  login: (email: string, password: string) => void;
  signUp: (email: string, name: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

// Export the provider as we need to wrap the entire app with it
export function AuthProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [user, setUser] = useState<User>();
  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingInitial, setLoadingInitial] = useState<boolean>(true);
  // We are using `react-router` for this example,
  // but feel free to omit this or use the
  // router of your choice.
  const history = useHistory();

  // Check if there is a currently active session
  // when the provider is mounted for the first time.
  //
  // If there is an error, it means there is no session.
  //
  // Finally, just signal the component that the initial load
  // is over.
  useEffect(() => {
    usersApi.getCurrentUser()
      .then((user) => setUser(user))
      .catch((_error) => {})
      .finally(() => setLoadingInitial(false));
  }, []);

  // Flags the component loading state and posts the login
  // data to the server.
  //
  // An error means that the email/password combination is
  // not valid.
  //
  // Finally, just signal the component that loading the
  // loading state is over.
  function login(email: string, password: string) {
    setLoading(true);

    sessionsApi.login({ email, password })
      .then((user) => {
        setUser(user);
        history.push("/");
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }

  // Sends sign up details to the server. On success we just apply
  // the created user to the state.
  function signUp(email: string, name: string, password: string) {
    setLoading(true);

    usersApi.signUp({ email, name, password })
      .then((user) => {
        setUser(user);
        history.push("/");
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }

  // Call the logout endpoint and then remove the user
  // from the state.
  function logout() {
    sessionsApi.logout().then(() => setUser(undefined));
  }

  // Make the provider update only when it should.
  // We only want to force re-renders if the user,
  // loading or error states change.
  //
  // Whenever the `value` passed into a provider changes,
  // the whole tree under the provider re-renders, and
  // that can be very costly! Even in this case, where
  // you only get re-renders when logging in and out
  // we want to keep things very performant.
  const memoedValue = useMemo(
    () => ({
      user,
      loading,
      error,
      login,
      signUp,
      logout,
    }),
    [user, loading, error]
  );

  // We only want to render the underlying app after we
  // assert for the presence of a current user.
  return (
    <AuthContext.Provider value={memoedValue}>
      {!loadingInitial && children}
    </AuthContext.Provider>
  );
}

// Let's only export the `useAuth` hook instead of the context.
// We only want to use the hook directly and never the context component.
export default function useAuth() {
  return useContext(AuthContext);
}
```

Now this `useAuth.tsx` file exports both the `AuthProvider` and the `useAuth`. In order to use the hook, we need to wrap the entire app (or the parts that need authentication), with the provider.

`App.tsx`
```tsx
import React from "react";
import useAuth, { AuthProvider } from "./useAuth";

function InnerApp() {
  const { user, loading, error, login, signUp, logout } = useAuth();

  // Do whatever you want with these!
}

export default function App() {
  return (
    <AuthProvider>
        <InnerApp />
    </AuthRouter>
  );
}
```

Now I cut the `InnerApp` content short because I'm going to show you how this would look in a more "production line" environment. We will integrate `react-router` with this hook in order to create login and sign-up pages, and also add protected routes.

First, let's create two page components, one for signing up users and another for login.

`SignUpPage/index.tsx`
```tsx
import React, { FormEvent } from "react";
import { Link } from "react-router-dom";
import useAuth from "../useAuth";

// Just regular CSS modules, style, however, you desire
import styles from "./index.module.css";

// This is a uncontrolled form! No need to manage state for each input!
export default function SignUpPage() {
  const { signUp, loading, error } = useAuth();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    signUp(
      formData.get("email") as string,
      formData.get("name") as string,
      formData.get("password") as string
    );
  }

  return (
    <form className={styles.root} onSubmit={handleSubmit}>
      <h1>Sign up</h1>

      {/*
          On a real world scenario, you should investigate
          the error object to see what's happening
      */}
      {error && <p className={styles.error}>Sign up error!</p>}

      <label>
        Name
        <input name="name" />
      </label>

      <label>
        Email
        <input name="email" type="email" />
      </label>

      <label>
        Password
        <input name="password" type="password" />
      </label>

      {/*
        While the network request is in progress,
        we disable the button. You can always add
        more stuff, like loading spinners and whatnot.
      */}
      <button disabled={loading}>Submit</button>

      <Link to="/login">Login</Link>
    </form>
  );
}
```

Now, the login page.
`LoginPage/index.tsx`
```tsx
import React, { FormEvent } from "react";
import { Link } from "react-router-dom";
import useAuth from "../useAuth";

import styles from "./index.module.css";

// Again, uncontrolled forms!
export default function Login() {
  const { login, loading, error } = useAuth();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    login(
      formData.get("email") as string,
      formData.get("password") as string
    );
  }

  return (
    <form className={styles.root} onSubmit={handleSubmit}>
      <h1>Login</h1>

      <label>
        Email
        <input name="email" />
      </label>

      <label>
        Password
        <input name="password" type="password" />
      </label>

      <button disabled={loading}>Submit</button>

      {/*
        As I said above, these errors can happen for
        more reasons, like network errors.
        Control these as you desire!
      */}
      {error && <p className={styles.error}>Bad login/password</p>}

      <Link to="/sign_up">Sign Up</Link>
    </form>
  );
}
```

Finally, let's just add a very simple home page so users go somewhere after logging in:
`HomePage/index.tsx`
```tsx
import React from "react";
import useAuth from "../useAuth";

import styles from "./index.module.css";

export default function HomePage() {
  const { user, logout } = useAuth();

  return (
    <div className={styles.root}>
      <p>Hello {user!.email}</p>

      <button type="button" onClick={logout}>
        Logout
      </button>
    </div>
  );
}
```

Now, let's revisit the root of our app. We are going to use `react-router-dom` to build the routes of our app, and we are also going to add a way to protect routes so that only logged-in users are able to access them.

`App.tsx`
```tsx
import React from "react";
import {
  BrowserRouter,
  Switch,
  Route,
  RouteProps,
  Redirect
} from "react-router-dom";
import useAuth, { AuthProvider } from "./useAuth";
import HomePage from "./HomePage";
import LoginPage from "./LoginPage";
import SignUpPage from "./SignUpPage";

// As the router is wrapped with the provider,
// we can use our hook to check for a logged in user.
function AuthenticatedRoute({ roles, ...props }: RouteProps) {
  const { user } = useAuth();

  if (!user) return <Redirect to="/login" />;

  return <AsyncRoute {...props} />;
}

function Router() {
  return (
    <Switch>
      <AuthenticatedRoute
        exact
        path="/"
        component={HomePage}
      />
      <Route
        exact
        path="/login"
        component={LoginPage}
      />
      <Route
        exact
        path="/sign_up"
        component={SignUpPage}
      />
    </Switch>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </BrowserRouter>
  );
}
```

Now you have protected routes that redirect anonymous users to the login page!


## Wrapping up

Hope this is useful for you! This is pretty close to the scenarios we have in production, but the bulk of the logic is all here. Add some robust error handling and you are all set!

Please check [our Phoenix/React starter project](https://github.com/finiam/phoenix_starter) if you want to see this in action. The code is not 100% what you see in this tutorial, and might change as time goes on and our requirements change, but it's always going to be a great starting point with authentication already handled.

Stay safe 👋
