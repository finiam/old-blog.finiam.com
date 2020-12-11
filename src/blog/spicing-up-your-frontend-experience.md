---
layout: layouts/post.liquid
tags: post
title: Spicing up your Rails frontend experience
category: development
author: francisco
description: Let's take the frontend Rails experience to the next level. Instant page transitions, components, and Stimulus!
long_description: Rails is great. You can still check DHH's 15-minute blog demo and just appreciate the combination of features and ease of use of the framework. Even though there are even easier ways to make a blog nowadays (cough cough Gatsby), Rails is still a rock-solid choice for crafting digital products.
featured_image: /images/spicing-up-feature.jpeg
featured_image_alt: An assortment of various spices
date: 2020-08-19
keywords: ruby, rails, frontend
---

Rails is great. You can still check DHH's [15-minute blog demo](https://www.youtube.com/watch?v=Gzj723LkRJY) and just appreciate the combination of features and ease of use of the framework. Even though there are even easier ways to make a blog nowadays (cough cough Gatsby), Rails is still a rock-solid choice for crafting digital products.

## Rails and the modern web

Despite being a Rails advocate, I mainly used it to build APIs, resorting to React for the frontend stuff. Working with some demanding web designers, I felt that React always had a flexibility that I did not get with HTML and JS. Also, having worked on very large codebases for both full Rails with HTML and Javascript (jQuery at the time) and Rails with a SPA on top, the latter always evolved better in terms of technical debt and time needed to implement features.

There are pros and cons to each approach and we like to analyze those on a per-project basis. More and more we see great success on teams going with fully server-side approaches, like Basecamp for example. Github is another case of a mostly server-side Rails app that works great (most of the time).

Even with a fully server-side approach, you can create experiences that for end-users, will be indistinguishable from a fully client-side web app. The instant page transitions, components, and cool APIs to interact with the DOM. Let's see how.

## Turbolinks and remote helpers

The big deal about SPAs is on its name. **single page applications** don't have page transitions, it's usually done in the client-side and it looks and feels like a native app. An issue with server-side approaches is that every page change (clicking links) triggers a server request and a subsequent full page load. But you can fix that with Turbolinks.

Perhaps you've heard about it, Turbolinks has been on the Rails ecosystem for quite a while. It basically is a piece of Javascript that detects navigation requests, like clicking a link, and then fetches the page and merges the `head` and swaps the `body`. Thus, changing a page without a full refresh.

How do you install it? Simple, you don't, Rails comes with it installed and set up by default! For non-Rails projects it's pretty simple, just check out [their documentation](https://github.com/turbolinks/turbolinks#installation-using-npm)

Not only Rails has default Turbolinks support, but it also has a ton of small features to assist in implementing instant user interactions. You can submit forms and trigger controller actions with links and buttons with AJAX and no extra code. [Their doc page](https://guides.rubyonrails.org/working_with_javascript_in_rails.html#remote-elements) about working with Javascript has a pretty detailed explanation of these "remote elements".

The only thing that is not handled by default in Rails and Turbolinks is when a controller action renders a new template. Turbolinks supports `redirect_to` out of the box, but when a template is rendered using `render`, it causes a full page refresh. This often happens after you submit a form. Even if you are using the `form_with` helper, which triggers an AJAX request instead of the traditional form submission, you will still re-render the page.

Take for instance, this `create` controller action:
```rb
def create
  @schedule = Schedule.new(schedule_params)
  @statuses = User.statuses.keys

  if @schedule.valid?
    schedule_status_change(@schedule)

    redirect_to(new_schedule_path, notice: "Scheduled!")
  else
    flash.now[:alert] = "Invalid!"

    render action: "new"
  end
end
```

By default, Turbolinks handles the case where the form is valid because we use `redirect_to`. But when the form is invalid, we will have a full page refresh, because we are re-rendering with the `render` method.

Solution? Just install [this handy gem](https://github.com/jorgemanrubia/turbolinks_render) made by Jorge Manrubia. That's it. Right now, at the time of writing, Turbolinks version 5 doesn't support this, but the upcoming version 6 will handle this with no extra setup.

## Components

Right now, developers and designers on the web design and implement UI with a component-based approach. It's easier to organize and re-use code this way. It's also the way design systems are usually maintained. And now with design systems becoming more and more popular, components even feel like the **way** to make web applications.

The traditional SPA assumes this model, usually, and it's pretty easy to do it. However, on Rails, there is no notion of this, and you are on your own to implement your components. The most popular way is just to use CSS. Naming schemes like SuitCSS and BEM allow you to define reusable CSS classes for your project. But what happens when you also need markup or behavior?

You can always implement your components using view partials, and your behavior as regular Javascript files, but that isn't ideal. What if there was a way to encapsulate CSS, JS, and HTML on a nice package, and re-use that throughout your app?

Introducing `view_component`, made by Github. Using this library, you can define all of your components on `app/components`.

A component is a combination of a Ruby class, an ERB template, a CSS file, and a JS file. You can control server-side behavior on that Ruby class, define your markup on your ERB template and then control the frontend side of things with CSS and JS.

As an example, I'll show you the implementation of a flash alert component, that we can use to render Rails flash notices and errors.

First, we need to define the Ruby class that renders the component. In its basic form, it's just a regular constructor that you use to set instance variables, kinda like a controller.

The `render?` method can be used to determine if we should render the markup of the component. In this case, we don't render anything at all if we don't have any flash messages.

`app/components/flash_message_component.rb`
```ruby
class FlashMessageComponent < ViewComponent::Base
  def initialize(flash:)
    @flash = flash
  end

  def render?
    @flash&.keys&.count&.positive?
  end
end
```

Then we just define markup like we would for a regular Rails view. You can use any template engine you like (`slim` for example). I prefer traditional ERB.

`app/components/flash_message_component.html.erb`
```html
<div>
  <% @flash.each do |key, value| %>
    <div class="Flash Flash-<%= key %>">
      <%= value %>
    </div>
  <% end %>
</div>
```

Some basic styling:

`app/components/flash_message_component.html.scss`
```scss
.Flash {
  position: fixed;
  top: 12px;
  left: 50%;

  display: inline;
  padding: 0.5rem;

  color: white;

  transform: translateX(-50%);
}

.Flash-notice {
  background-color: cadetblue;
}

.Flash-alert {
  background-color: red;
}
```

And that's all it takes to define a component. To use it, we just reference it like this:

```erb
<%= render(FlashMessageComponent.new(flash: flash)) %>
```

You can do this for all sorts of UI elements and it allows you to encapsulate UI logic on these re-usable bits. Now, you probably noticed that we don't have any JS here. Will touch that in a bit, let's just talk about Stimulus first.

## Stimulus

Now, our previous example was pretty nice, but we lack JS to make the flash component *behave*. When I first started working with Rails (back in 2014) the defacto way was to just use jQuery to make stuff all interactive and nice. And we all know how that ends up with large codebases.

{% responsiveImage "/images/spicing-up-spaghetti.jpg" "A dish of spaghetti with meatbals" %}

> Spaghetti code get it? Yes, it's a lame joke.

The folks at Basecamp, who pretty much invented Rails anyway, created this simple library (not a framework) to solve the mess of having a bunch of random Javascript with jQuery all over the place. Stimulus uses simple data attributes and small Javascript controllers to add rich interactions to Rails apps (also works without Rails).

I'm not going super in-depth on Stimulus, their docs are pretty thorough and easy to pick up. Still, let's see how we can combine `Stimulus` with `view_component` to make our flash component nicer. Currently, when a flash message is rendered, it stays there forever, so lets us make it go away after some time and also add a button to dismiss it.

Refer to Stimulus docs to set it up. Then refer to [this part](https://github.com/github/view_component#stimulus) of the `view_component` docs to integrate both libraries.
By default Stimulus just searches for controllers on the `app/javascript/controllers` path. With these integrations, we can also define controllers on the `app/components` folder.

Now, back to our flash component. Let's change our old markup a little bit. We need to add the button and the respective Stimulus related attributes.

```erb
<div data-controller="flash-message">
  <% @flash.each do |key, value| %>
    <div class="Flash Flash-<%= key %>">
      <%= value %>

      <button data-action="click->flash-message#close">Close</button>
    </div>
  <% end %>
</div>
```

We added the `data-controller` attribute, to tie this markup with its respective Stimulus controller. Then we added a button with a `data-action` attribute. We specify `click->flash-message#close`, which means we are mapping the `click` event with the `close` function of our `flash-message` Stimulus controller.

The naming of these files matters a lot, like most Rails stuff. The `flash_message_controller` defines the `flash_message` controller. If you want to use it on your markup, you must reference it that way, always. And yes you can use it in different places on your HTML. **Warning**, controllers on `app/components` can have name collisions with components on `app/javascript/controllers`.

Now, the controller:

`app/components/flash_message_controller.js`
```js
import { Controller } from "stimulus";

export default class extends Controller {
  connect = () => {
    this.timeout = setTimeout(() => this.close(), 5000);
  };

  disconnect = () => {
    clearTimeout(this.timeout);
  };

  close = () => {
    this.element.remove();
  };
}
```

Stimulus controllers have a bunch of lifecycle related functions, you can check those on the docs, but here we are redefining `connect` and `disconnect`. We use those to set a timeout to close the flash message and also to clear that message if the controller is unloaded. Just a nice touch.

Then, we get to our `close` function that we use on the markup. Every Stimulus controller has access to the respective DOM element where it's being used. That `data-controller` attribute takes care of that. When we use `this.element` we are reaching for that DOM piece, then we can just call `.remove` to delete that from the DOM, making the flash message go away.


## A fun alternative

Remember, pick technologies that make your team happy and productive! In our case, everyone loves React and everyone loves Rails, but it's refreshing to just go full Rails once in a while and break out of the norm. If you are interested in solving problems more on the server-side, keep tuned, as we are going to talk about [StimulusReflex](https://github.com/hopsoft/stimulus_reflex) for Rails and also [LiveView](https://github.com/phoenixframework/phoenix_live_view) for Phoenix.

The modern web is great because you have a ton of choices on how to do things, let's cheers on that.
