---
layout: layouts/post.liquid
tags: post
title: Ruby vs Elixir
author: davide-silva
category: development
date: 2021-05-17T12:23:42.571Z
long_description: In the world of tech startups, time is an essential factor in
  the success of a company. Who can deliver the best work in the shortest amount
  of time gains a competitive edge over the competition. Not only that but in a
  world in constant evolution, the need to quickly change gears and pivot a
  business idea into another opportunity is of great importance.
metadata:
  keywords: Ruby on Rails; Elixir; Web frameworks; MVP;
  description: In the world of tech startups, time is an essential factor in the
    success of a company. Who can deliver the best work in the shortest amount
    of time gains a competitive edge over the competition. Not only that but in
    a world in constant evolution, the need to quickly change gears and pivot a
    business idea into another opportunity is of great importance.
  image_alt: railway tracks
  image: https://images.unsplash.com/photo-1604915536720-e49013b4f230
---
In the world of tech startups, time is an essential factor in the success of a company. Who can deliver the best work in the shortest amount of time gains a competitive edge over the competition. Not only that but in a world in constant evolution, the need to quickly change gears and pivot a business idea into another opportunity is of great importance.

A minimum viable product (MVP) is a great way of testing and learning new insights of a potential new product, without having to spend precious time and money into the development of a product that might not have a demand in the market. The *Lean Startup* book defines an MVP at its core as "a version of a new product which allows a team to collect the maximum amount of validated learning about customers with the least effort".

Therefore, the time of development of an MVP would, ideally, be the shortest possible. In order to achieve that, a software development team must choose a framework that would allow the rapid prototyping of the MVP as well as allow a sudden need of pivoting or scaling.
The constant evolution of software methodologies and web frameworks means that choosing one framework over another is not always a trivial choice.

# Ruby on Rails

Since its release in 2004, Ruby on Rails attracted a lot of attention from the tech startup world as it caused a shift in the way web applications are developed. The sensible defaults provided by the framework, the active community providing the necessary tooling that helps speed up development even further, being an open-source framework and the ease of scalability of a Rails application make Ruby on Rails a prime candidate for the rapid prototyping of a web application. Developers spend most of their time implementing actual features instead of debating over design choices of little to no impact to the end-user.

Many of the notorious and largest tech startups of today, Twitter, GitHub, Shopify, to name a few, did their first steps with Ruby on Rails. And while Ruby on Rails is an obvious choice for bootstrapping an application, there is also concrete proof that it performs well under heavy load and in scale. [Shopify reported](https://news.shopify.com/shopify-merchants-break-records-with-51-billion-in-worldwide-sales-over-black-fridaycyber-monday-weekend-354749) "sales of $5.1+ billion from the more than one million Shopify-powered brands around the world" during the Black Friday and Cyber Monday of 2020. At the peak of the Black Friday, they were able to process $102+ million in sales during an hour. They achieved this using a monolithic Ruby on Rails application. Like Shopify, GitHub also runs Ruby on Rails in their production environment, having spent considerable time and effort into upgrading both Rails and Ruby to the latest stable versions available.

# Ruby on Rails downsides

Despite these and many other success cases, Rails interest has been declining over the last few years.
One possible reason for the decline in popularity seen recently in Rails is directly related to the fact that Rails brings lot of opinionated tools and makes choices for the developer that will work perfectly as long as you use the framework as it is. Changing these tools for other alternatives requires extra work, that might not always be trivial. The Convention over Configuration doctrine is good for most use cases but when some custom configuration is needed, Rails makes it harder than it should to change its defaults. After a few years as the de facto web framework used by most tech startups, and despite still being a perfectly valid choice for a rapid prototype or as a web framework by itself, companies and developers are starting to move away from Rails in search of valid alternatives. Many tech startups started to look closely into Elixir, and its web framework Phoenix, as a possible substitute to Rails.

# Elixir

Elixir started to make waves in the tech world by promising the fault-tolerance, highly scalable and easily distributed properties of the Erlang VM with a Rails like syntax and an active community. The creator of Elixir, José Valim, is a former Ruby/Rails core contributor and brought many of the good practices and positives of Ruby/Rails to Elixir. The appearance of a new language that promises the better parts of Rails, without its most known downsides, and that is built upon a battle tested language like Erlang has caused a buzz in the tech startup world. Despite the fairly recent release of Elixir, being first released in 2011, it builds on top of the Erlang VM that has been around since the 1980s and is used by some of the largest telecommunication companies in the world, like Ericsson, Cisco, Samsung and WhatsApp.

One of the things that made programmers very excited about Elixir is that building distributed systems in Elixir is a very pleasant experience. Everything in Elixir consists in processes that send messages to one another. The code in each process runs sequentially and we don't need to worry about race conditions or locks while building our system. If a process wants to send a message to another process, that message is put in the mailbox of the receiver process and, depending if the sender wants to get a response or not, the sender might enter a sleep state while it awaits for a response or simply carry on with its execution. The receiver process iterates over its mailbox and processes each message one at a time. If you want a more in-depth explanation of Elixir processes and how you can better use [GenServers, Agents, and Tasks](https://blog.finiam.com/blog/genserver-agent-task), Resende has got you covered.

Pattern matching and the pipe operator are also two big factors why developers seem to like Elixir so much. This often leads to functional, prettier code that is also more easy to reason and maintain. With the pipe operator, `|>`, we can treat a series of function calls or data transformations as a single chain of operations. Instead of wrapping function calls with another, we use the pipe operator to pass our data to the first argument of the next function. The following snippet shows two ways of writing the same logic, but one is easier to read than the other:

```
# elixir

String.reverse(String.downcase(String.trim("Hello world! ")))

"Hello world! "
|> String.trim
|> String.downcase
|> String.reverse
```

Unlike Ruby, Elixir is also a language that has everything figured out. It has an [official builtin linter](https://hexdocs.pm/mix/master/Mix.Tasks.Format.html) that is part of the core of the language. There is also an [official release manager](https://hexdocs.pm/mix/Mix.Tasks.Release.html) that is also builtin in the language. A [unit testing framework](https://hexdocs.pm/ex_unit/ExUnit.html) is also shipped with Elixir, meaning there is no need to install third-party dependencies just to get some basic quality of life tools.

# Elixir downsides

Being a very recent language, the Elixir ecosystem is lacking in the resources and libraries one would find in the Rails ecosystem, as well as the scale of the existing community. The number of Elixir developers pales in comparison to the number of Ruby/Rails developers but the existing community is very active and responsive, always striving to improve the ecosystem. Another factor that might cause some resistance in adopting Elixir is the fact that it is a functional programming language. Instead of calling a method on an object, in Elixir we call a function of a module and you pass the data to that function. This is not a problem with the language itself, but this shift in thinking might deter some programmers who are more comfortable with imperative or object-oriented programming. Coming from one of those paradigms to Elixir without having a background or some experience in functional programming might take some time to get used to. As a very quick example, here's how to get the length of a string in both languages:

```
# ruby
"Hello world!".length

# elixir
String.length("Hello world!")
```

As you can see, in Ruby we call the `length` method on an instance of the `String` object that contains the phrase "Hello world!" while in Elixir we call the `length` function of the `String` module and we pass our "Hello World!" phrase as an argument to that function. It's similar but involves a shift in the way you think about a problem.

# Wrapping Up

If this sparked your interest and you want to see a more concrete example of Elixir being used, you can take a look at Diogo and his [Simulations with Elixir](https://blog.finiam.com/blog/simulations-with-elixir-and-the-actor-model/).

In the end, the positives and negatives of a language/framework is something that should always be considered before picking one for building an MVP. We shouldn't blindly pick the new shiny thing simply because it might not be the best solution for the problem we are trying to solve. This doesn't mean that we should always pick the same tools to solve any problem we are faced. If the restraints of the problem align with our tools of choice, then the decision is easy. But if the problem asks for another tool set, there are plenty more to choose from. The important bit is to do some research beforehand and carefully weigh the pros and cons before making a decision.

Stay safe! 