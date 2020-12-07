---
layout: layouts/post.liquid
tags: post
title: Let’s slim down on Javascript
author: francisco
category: development
date: 2020-07-23
description: A collection of tips on how to reduce the size of your web apps.
long_description: The ancient narrative of "Javascript bloat" is ever-present in the tech world. Web developers love Javascript, backend developers hate it and end-users usually don't give a damn about it as long as websites open fast, work as they should, and do not spy on them. Still, web pages have way too much Javascript, especially SPAs, that could be avoided with just a few tips. Let's see how.
keywords: javascript, performance, finiam
---

_Originally posted on [Finiam's website](https://dev.to/finiam/let-s-slim-down-on-javascript-28ph)._

The ancient narrative of "Javascript bloat" is ever-present in the tech world. Web developers love Javascript, backend developers hate it and end-users usually don't give a damn about it as long as websites open fast, work as they should, and do not spy on them. Still, web pages have way too much Javascript, especially SPAs, that could be avoided with just a few tips. Let's see how.

## Why care?

Nowadays Internet connections are pretty fast (usually) so why worry if your app has 1 megabyte of JS? Most native mobile apps go into the hundreds of megabytes!

So, when dealing with Javascript, you are dealing with a scripting language (it’s in the name you see), so the code needs to be read and interpreted by something. In this case, it’s your own browser. Then that code gets loaded into memory and your browser starts doing stuff with it. The problem here is that it takes time and processing power. So if you have a simple news website, and everyone needs to download 4 megabytes of scripts and trackers to be able to see a news article, you probably just lost a reader. Those 4 megabytes of Javascript would take an immense amount of time to be downloaded, read and parsed, especially on mobile devices. Despite the awesomeness of our internet connections, most people access it via WiFi or cellular networks (3G, 4G, etc). These are unreliable and slow even in areas with good coverage. Also, note that the average phone is not that fast.

The more Javascript you use, the more it takes to fetch a page from the server, the more it takes to render the content, and in the end, the more it takes the user to view the webpage. Even with top-class server tech and CDNs.

A good starting point is measuring your website performance with Google Lighthouse (the Audits tab on Chrome’s Web Tools). Metrics like Largest Contentful Paint and Time to Interactive are good ways to see if Javascript is slowing down your website loading. [WebPageTest](https://www.webpagetest.org/) is also a great tool that allows you to test your website with different devices, like slow smartphones on a limited connection, so you can better test real-world situations.

Given that, let's see how we can improve our website's performance metrics, with a few tips.

## Ditch SPAs

Ok, so this one is a bit extreme and probably only useful before you actually start working on your project. The fastest Javascript is no-Javascript at all. No code is the best code or so they say. By server-rendering your apps you can just ditch client-side Javascript entirely. Using something like Rails, Phoenix, Laravel or any full-stack web framework will allow you to implement web apps entirely rendered on the backend.

I know, shocking. We made apps like this for ages and it kinda worked out. Check out Basecamp, they're doing pretty well. Having worked with multiple SPA libraries and server-rendered full-stack frameworks, I can attest that most times, we duplicate a bunch of concepts on the client-side that could just exist as a full-stack unit: routing, data validations, app state, API calls (when full-stack, these just don't exist).

Working in a digital agency I often saw SPAs applied to very simple projects, where a classic Rails app would excel. Mea culpa, I’ve done that myself. A client-side approach is great when you want to have separate teams for backend and frontend. Having dedicated teams for both will help teams organize themselves. After all, all these SPA frameworks and libraries were made by very large organizations with very large codebases.

But even for smaller projects, SPAs excel on highly reactive applications, and any application that is trying to emulate a native experience, through animations and navigation controls, for example, will also benefit from these modern frontend technologies.

But still, a very good stack for CRUD like apps can be made with Rails and a tiny bit of JS, with Stimulus and Turbolinks. You get the awesome developer experience of Rails, you avoid the dread of full-page refreshes with Turbolinks, then Stimulus helps you write Javascript in a sensible way. No network request handling, no API writing, no manual auth token handling. Just raw productivity.

And if you are looking for reactivity, check [StimulusReflex](https://github.com/hopsoft/stimulus_reflex) (for Rails) and [LiveView](https://github.com/phoenixframework/phoenix_live_view) (for Phoenix). Reactivity on the server-side.

Finally, take a look at [Basecamp](https://basecamp.com), it only uses Rails and a very lightweight Javascript library called Stimulus and good old Turbolinks. For both Mobile and Desktop.

![Basecamp page navigation in action](/images/basecamp.gif)

A final friendly reminder on this matter. Pick something that strikes a good balance between maintainability and your team's happiness. Don't switch over to a specific technology or way of doing things just because a random dude on the internet says so! Explore and see what works for you.

## Use native libraries

Now back to Javascript. Often developers reach out for a popular dependency before trying and using the native tools the browser platform offers. It's ok, for most of the Internet history the default libraries on the browser were pretty unstable or just didn't work across multiple browser versions. For example, libraries to make network requests are imported into almost every project when the browser already has a powerful tool for that: [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).

```js
const response = await fetch("/api/validator", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  body: JSON.stringify(formState),
});

const json = await response.json();
```

Right now you probably are using something like `axios` or `superagent` on your web app, both sitting at 4.4kb and 6.4kb total size respectively, at the time of writing this blog post. I resort to `axios` all the time due to old habits, but I've been replacing it with `fetch` and life has been great.

Most problems pointed to `fetch` are its lack of defaults and weird error handling (they only throw errors on network failure and not on bad responses), but that can be fixed with a simple custom wrapper. Check out this awesome [blog post](https://kentcdodds.com/blog/replace-axios-with-a-simple-custom-fetch-wrapper) from Kent C. Dodds where he builds a custom wrapper to remove all problems regarding the lack of sane defaults.

If you want to keep around the axios API, you can always use [redaxios](https://github.com/developit/redaxios). An axios compatible API that uses `fetch` under the hood and it's just 800 bytes!

And if you need to support older browsers, use [unfetch](https://github.com/developit/unfetch) as a polyfill.

Try and use the browser's native functionality before going after solutions on npm, you will be surprised. Browsers can do awesome stuff nowadays and almost every single functionality can be polyfilled back into older browsers.

## Be careful with 3rd party dependencies

Even though the browser is a great platform, it's pretty rare to complete a project without ever using a 3rd party dependency. Even if you maximize the natural power of the browser, there are essential libraries that you will probably need. One thing that happens though, is that people often search for a given library and don't really think about the consequences. Any library you use will increase the total size of your web app. We should be mindful of that.

How? Use a tool like [Bundlephobia](https://bundlephobia.com/) to inspect the size of a package before using it, and to check if it is tree-shakeable. And what is a tree-shakeable package you might ask? It basically means that most Javascript bundler like Rollup, Webpack, and others will remove the code you do not use from said package.

For example, if you import `lodash` the entire package will end up on your final bundle. However, you can use the alternative `lodash-es`, which does the same thing and is tree-shakeable, and you only use the functions you import. As long as you do this:

```js
import { uniqueId } from "lodash-es";
```

Remember, try to find the right balance between "reinventing the wheel" or adding another dependency. And when you are looking for libraries to solve your problems, pick one that is small and tree-shakeable.

You can also resort to code-splitting and load polyfills conditionally. I'll show you how in a bit.

## Code Splitting

If you are using a Javascript bundler, chances are you have the ability to perform code-splitting. It basically consists of splitting your overall Javascript codebase into different modules. It is usually used to not load your entire application at once. If you have a large web app, it's usually a good idea to perform code-splitting, so your users don't need to download every single piece of Javascript in your app.

For example, if you have a React app with `react-router` you can perform route-based code splitting. Each different page on your app will have its own module plus a common bundle, which will contain the Javascript code that is common to all different modules. This will reduce the initial load size for each part of the web app but at the cost of having to make a network request every time the route changes.

I am not going in-depth on implementation details, but you can check the [`react-router` docs](https://reactrouter.com/web/guides/code-splitting) on the best way of doing this. The important thing to note is that we should only load code that the user needs or will almost surely need in the future.

Popular frameworks on top of their SPA libraries like Next.js (React), Nuxt (Vue.js), and Sapper (Svelte) do this out of the box via code splitting based on-page components. This is a cool way of going about this since you do need to manually implement this yourself.

You can even use this strategy to conditionally load dependencies. In the next example, we are importing some polyfills only if the browser does not support the given functionality natively.

```js
if (typeof IntersectionObserver === "undefined") {
  await import("intersection-observer");
}

if (typeof Map === "undefined") {
  await import("core-js/es6/map");
}

if (typeof Set === "undefined") {
  await import("core-js/es6/set");
}

if (typeof window.requestAnimationFrame === "undefined") {
  await import("raf/polyfill");
}
```

Apply this to anything you need. You can use this to load different bundles for mobile or desktop. For different user roles, for example, regular users won't probably need to have the admin dashboard code loaded into their browsers.

## Don't support older browsers

Dramatic statement. Nowadays you are probably using `babel` to transpile your JS code for it to be compatible with older browsers. So every single new feature of the language is then ported back to be supported. If you have IE (Internet Explorer) as a target, then `babel` will convert every arrow function into a regular function. Transpiled code is longer, heavier, and probably not as optimized as the code you have actually written.

How to solve this? Ditch older browsers. I mean, this might seem ridiculous and counter-intuitive at first but older browsers, mostly IE obviously, are insecure, slower, and just plain worse than the alternative. If a computer runs IE it probably can run either Chrome or Firefox. There are a few cases where this is not possible. Some institutions and companies just don't allow people to update or install applications on their computers, so they are stuck with Windows XP and IE.

If you cut down the number of polyfills you need, and the transformations your code needs to run on the browser, you can save some serious space. You can also create different Javascript bundles, one for modern browsers and one for older ones. You can check if the user runs IE and ship off the polyfilled bundles to them, but for that, you would need a server that is parsing the user agent of the HTTP requests. If you are making a [JAMstack](https://auroradigital.co/blog/articles/a-primer-on-the-jamstack) app you probably can't parse the user agent string efficiently, and everyone will get the same bundle anyway.

[polyfill.io](https://polyfill.io) is a possibility, it loads polyfills conditionally, based on your browser’s version.

Remember, you can always review your web app user base and check the percentage of users with older browsers. You can track your user's browser versions respectfully by using a privacy-focused tracker (a bit paradoxical) like [Goatcounter](https://www.goatcounter.com/). They just collect very basic information that cannot uniquely identify users, respecting their privacy. You will probably notice that you don't have IE users at all (this is the case for the products I've been working on at least).

For the global market share, IE has 3%, but it's a good idea to scan the market and see if it makes sense to be IE friendly. Imagine that your app is a specific tool for Linux people. They won't be using IE at all.

It's a matter of user research like all great products should have. An app for the enterprise financial market would probably need IE. Lot's of people on that field are stuck on Windows XP due to organizational restrictions. For a rad startup idea? Probably no IE users will pop up.

At the very least, make sure your landing page works on IE, then just tell people to upgrade :)

## Wrapping up

The rationale is simple. Be mindful of the cost of Javascript (probably the [greatest blog post](https://v8.dev/blog/cost-of-javascript-2019) on this matter), and use simple solutions to deal with it. Don’t forget that premature optimization is the root of all evil, but a couple of tweaks early on in a project’s lifetime can make a world of difference.

Also, make sure you test your web experiences on slower devices. I cannot say this enough. Not everyone has a Galaxy S20 or the latest shiny iPhone in their pockets.

It all boils down to the user experience. Make accessible, performant web apps that do just what they are supposed to do, well.
