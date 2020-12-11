---
layout: layouts/post.liquid
tags: post
title: Reactive Rails applications with StimulusReflex
author: francisco
category: development
description: A quick look into making reactive applications using Rails, a tiny bit of Javascript, and StimulusReflex.
long_description: A while ago I made a blog post about the modern web with just Rails (and a few other things). Today I'm going to explore another way of doing awesome things with Rails, in the spirit of the modern, reactive, and real-time, web. Let's explore StimulusReflex, an extension to the amazing library made by Basecamp, to make server-side reactive applications.
date: 2020-09-30
featured_image: /images/reactive-rails-feature.jpeg
featured_image_alt: A rails code sample
keywords: ruby, rails, stimulus, reflex, web development, frontend, fullstack
---

A while ago I made a blog post about the modern web with just Rails (and a few other things). Today I'm going to explore another way of doing awesome things with Rails, in the spirit of the modern, reactive, and real-time, web. Let's explore StimulusReflex, an extension to the amazing library made by Basecamp, to make server-side reactive applications.

## So what is this Stimulus Reflex thing?

StimulusReflex is a Rails library that allows developers to make reactive, real-time apps easily. Much like [Phoenix LiveView](https://github.com/phoenixframework/phoenix_live_view) on Elixir land, this library gives us tools to make reactive UIs running mostly on the server-side.

It uses ActionCable, and their own CableReady extension, to trigger DOM updates from the server-side. It uses WebSockets, so it's faster than using regular HTTP requests with say, Turbolinks, or just consuming a regular API. Imagine kinda like Turbolinks, but sending HTML via WebSockets, instead of regular requests.

StimulusReflex adds the ability to write **reflexes**. Pieces of code that execute asynchronously and trigger a DOM update. Imagine a React component and some callback that triggers a `setState` call. These reflexes are fully server-side, so you can read directly from the database and do all kinds of things you would do on a typical Rails controller. You then attach DOM events to these reflexes with `data` attributes, kinda like Stimulus. You can also call these reflexes from Stimulus controllers directly.

Let's dive right into the action. Imagine a view that renders a group of `todo` records. Then we want each todo to have a delete button that removes that todo without refreshing the webpage.

Here is the controller:
`app/controllers/todos_controller.rb`
```rb
class TodosController < ApplicationController
  def index
    @todos = Todo.all
  end
end
```

This is the view:
`app/views/todos/index.html.erb`
```erb
<% @todos.each do |todo| %>
  <div>
    <p>
      <%= todo.description %>
    </p>

    <button
      data-reflex="click->TodoReflex#delete"
      data-todo_id="<%= todo.id %>"
    >Delete</button>
  </div>
<% end %>
```

Then our reflex becomes:
`app/reflexes/todo_reflex.rb`
```rb
class TodoReflex < ApplicationReflex
  def delete
    todo = Todo.find(element.dataset[:todo_id])

    todo.destroy
  end
end
```

You use the `element` variable, available on all reflexes, to get the DOM element where we define our `data-reflex` (our button). Then we get our `data-todo_id` from it.

We then find the todo on the database and delete it. When the method returns, StimulusReflex uses the current controller action to re-render the page with the new info. Then, the new HTML is sent via WebSockets and merged with the previous DOM contents.

You could replace this functionality with a simple `remote: true` Rails form, but as this is submitted with Websockets, the UI update is much faster and gives user's faster feedback, making the app feel snappier.

## How the magic happens

As I said earlier, StimulusReflex uses CableReady to trigger DOM updates from the server-side. It's a library developed by the same authors, and you can use it to do some more low-level stuff. It essentially sends DOM instructions through ActionCable, which is a WebSocket library built into Rails.

The magic happens in those reflex classes. When you trigger a reflex, StimulusReflex essentially rebuilds the current page, calling your controller action again, and it sends that new HTML via the ActionCable socket. Then, the client-side StimulusReflex library morphs the updated DOM with [morphdom](https://github.com/patrick-steele-idem/morphdom). By default, it updates the entire page, but you can reduce the scope of the updates manually to increase performance, check [their docs](https://docs.stimulusreflex.com/morph-modes) for more info.

This is a very quick primer on this amazing library. [Their docs](https://docs.stimulusreflex.com/) explain all of this in detail, plus some advanced use cases. It also contains all the instructions to deploy this to production without slowing down the entire application!

## The classic todo app

So let's revisit that example I showed you earlier. That example called reflexes directly on the markup. It's a quick way of doing it, but the best way is through a Stimulus controller itself. It gives you more control, allowing you to do cooler things.

The objective here is to make a simple todo list that allows you to create and delete todos. We are doing this entirely on `StimulusRefex` to achieve instant feedback without any full-page refreshes whatsoever. So, the only thing our Rails controller does is rendering the page.

By the way, I'm assuming you already made the Stimulus and StimulusReflex setup steps, and that you have a model and associated database migration, for a `Todo` with a `description` text field.

So, our markup:
`app/views/todos/index.html.erb`
```erb
<div class="Todos" data-controller="todo">
  <% @todos.each do |todo| %>
    <div class="Todos-row">
      <p>
        <%= todo.description %>
      </p>

      <button
        class="Todos-delete"
        data-action="click->todo#delete"
        data-todo_id="<%= todo.id %>"
      >Delete</button>
    </div>
  <% end %>

  <%= form_with id: "todo-form",
        model: @todo,
        class: "Todos-row",
        data: {
          action: "submit->todo#create",
        } do |f|
  %>
    <%= f.text_field :description %>
    <%= f.submit "Add todo" %>
  <% end %>
</div>

```

The important here is the `data` attributes. Firstly, we annotate the top-level `div` with `data-controller="todo"` which tells Stimulus that it should attach the `todo_controller.js` to this markup. Then we just define two actions. `click->todo#delete` on the button, to delete todos, and `submit->todo#create` to submit the form and create todos. Notice that on the delete button we also set `data-todo_id="<%= todo.id %>"` to so the reflex knows what todo it should delete.

Now, our Stimulus controller:
`app/javascript/controllers/todo_controller.js`
```js
import ApplicationController from "./application_controller";

export default class TodoController extends ApplicationController {
  async delete(event) {
    event.preventDefault();
    event.stopPropagation();

    this.showLoading();
    await this.stimulate("Todo#delete", event.currentTarget);
    this.hideLoading();
  }

  async create(event) {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget;

    this.showLoading();
    await this.stimulate("Todo#create", event.currentTarget);
    this.hideLoading();
    form.reset();
  }

  showLoading() {
    document.body.classList.add("wait");
  }

  hideLoading() {
    document.body.classList.remove("wait");
  }
}
```

Here we can see the StimulusReflex `stimulate` method. It allows you to call reflexes from Stimulus controllers. We pass the `event.currentTarget` so our reflexes have access to the DOM element where the event handler was specified (the button and the form).

We also have two methods to show a little loading spinner! The `stimulate` method returns a promise, so you can do things before and after and keep everything in sync. We also `reset` the form after submitting it, which doesn't happen automatically because we are canceling the default events so we don't submit a real `POST` request.

Finally, our reflex:
`app/reflexes/todo_reflex.rb`
```rb
class TodoReflex < ApplicationReflex
  def create
    Todo.create(todo_params)
  end

  def delete
    todo = Todo.find(element.dataset["todo_id"])

    todo.destroy
  end

  private

  def todo_params
    params.require(:todo).permit(:description)
  end
end
```

Our `delete` function remains unchanged, but notice the cool thing about the `create`. Because the DOM element that triggered the event is a form, we can use the classic Rails param mechanisms, so the code looks like a classic Rails controller.

This is everything you need to render a list of todos and also delete and create them as you wish. The styling with CSS is not part of this blog post scope, I'll leave that up to you.

## Caveats

The basic setup of StimulusReflex won't cut it for most Rails apps. They have an [authentication](https://docs.stimulusreflex.com/authentication) and a [deployment](https://docs.stimulusreflex.com/deployment) section on their docs that explain the major caveats.

But, in short, if your app has authentication, you need to identify each ActionCable connection with the currently logged in user, otherwise, the users will see each other's updates because they will all share the same socket.

Also, you need to configure your app to use Redis as a cache on a production environment. I recommend doing this in all environments. It's a good practice for your dev environment to be as similar as possible to your production environment.

Finally, if you are worried about Rails' ability to scale, just use [AnyCable](https://anycable.io/). It boosts Rails' ActionCable by delegating socket management to a piece of software written in Go which is miles better than Ruby for this workload. Rough benchmarks show that a Rails instance with ActionCable might handle 4000 connections while a single AnyCable node might handle 10000.

## Wrapping up

There you go, another cool way of making reactive interfaces without SPAs. It's a very nice manner of adding bits of reactivity to existing Rails' apps.

We are using it for internal projects, trying to add some interactivity on some classic Rails apps.

I hope this has been useful in some way, it's not a detailed tutorial but more of a showcase of another interesting out-of-the-box technology. If you are interested in this sort of thing (alternatives to SPAs) but are afraid of jumping into Ruby because of performance concerns (an overrated concern), checkout [Phoenix LiveView](https://github.com/phoenixframework/phoenix_live_view). It's written in Elixir, which runs on the BEAM. Performance will not be a problem whatsoever, and... we might have a blog post coming about that soon ;)
