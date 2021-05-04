---
layout: layouts/post.liquid
tags: post
title: " GenServer, Agent, Task"
author: jose-resende
category: development
date: 2021-04-28T16:24:22.116Z
long_description: "This blog post is trying to introduce 3 important concepts
  that can be useful when programming Elixir, GenServers, Agents and Tasks. "
metadata:
  image: /images/pexels-cottonbro-6896179.jpg
  keywords: Elixir, elixir, GenServer, genserver, actor, concurrency, parallel
    map, light weight process, OTP, safe concurrency, BEAM, erlang
  description: "Important concepts when programming concurrent Elixir, Agents,
    GenServers and Tasks. "
  image_alt: Actors
---
The first thing people tell you about Elixir is the scalability with lightweight threads of execution (called processes) that are isolated and exchange information via messages, the concurrency model with the actor model that allows you to program a concurrent program like a sequential one and the fault tolerance with supervisors which describe how to restart parts of your system when things go wrong. 

However, I see a lot of newcomers that don't make use of these features and don't know how, because the concepts are a little different than what they are used to. This blog post is trying to introduce 3 important concepts that can be useful when programming Elixir.  

## Concurrency model

Elixir uses the Erlang virtual machine (BEAM), that uses actors to describe concurrency, in other words, a contained process that communicates with other processes through message passing

![Untitled Diagram(5).png](https://draftin.com:443/images/78569?token=nBJWPKsxfWHoSQRILYWnpB7j2A4wXSzn8Bw6QHw3spcr2KANDaqPpgOJH_g2fSxOs1cuFNxYthW1x1kfbOAUUq8) 

## Process send and receive

This communication with message passing is composed of two main functions, `send` and `receive`, and we can send a message based on its Process Identifier (PID). 

The `send` function does not block the sender process, it puts the message on the receiver process mailbox and continues. 

The `receive` block will grab a message from the mailbox and try to pattern match it against the patterns defined in the receive block. If the process mailbox is empty it will block until a new message arrives.

Taken from the Elixir documentation: 

```elixir
defmodule Example do
  def listen do
    receive do
      {:ok, "hello"} -> IO.puts("World")
    end

    listen()
  end
end

iex> pid = spawn(Example, :listen, [])
#PID<0.108.0>

iex> send pid, {:ok, "hello"}
World
{:ok, "hello"}

iex> send pid, :ok
:ok
```

You can notice that the `listen` function processes messages for an infinite duration using recursion. This is possible because of "Tail Call Optimization" (TCO) and it ensures that if the last thing a function does is the invocation of another function (or itself), then there won't be a stack push. Instead, a simple jump will occur.

We’ve looked at the Elixir abstractions for concurrency but sometimes we need greater control and for that, we turn to the OTP behaviors that Elixir is built on.

We're gonna talk about Supervisors, GenServers, Agents, and Tasks.

## Supervisor

Supervises processes with configuration which determines if/when/how a process that it is supervising is restarted. These should be used, either via explicit or dynamic or task supervisors, to supervise almost all of your processes. You almost always want your worker processes supervised in some way.

{% responsiveImage "/images/untitled-diagram.png" "supervisor tree" %}

Taken from the elixir doc we can see how to set up a supervisor with a child process called stack where the init parameter is a list with the atom `:hello`:

```elixir
children = [
  # The Stack is a child started via Stack.start_link([:hello])
  %{
    id: Stack,
    start: {Stack, :start_link, [[:hello]]}
  }
]

# Now we start the supervisor with the children and a strategy
{:ok, pid} = Supervisor.start_link(children, strategy: :one_for_one)

# After started, we can query the supervisor for information
Supervisor.count_children(PID)
```

### GenServer

A generic server. That's it, ok? bye... ok let's expand.
An OTP server is a module with the GenServer behavior that implements a set of callbacks. At its most basic level, a GenServer is a single process that runs a loop that handles one message per iteration passing along an updated state.
Use it for anything where you have a need to represent something that has a state at a point of time and can be queried. This could represent a user in a chat, a char in a game, a game map, a shopping cart, etc.

The most important functions to know when using GenServer are: 

* `start_link`
* `init`
* `call`
* `handle_call`
* `cast`
* `handle_cast` 
* `send`
* `handle_info`

Let's do a very brief and simple explanation: 

* The `start_link` function starts a GenServer.
  The `init` function initiates the state of the GenServer and starts calls.
* `call` and `handle_call` are used for synchronous calls to the GenServer, normally where we need a return value from the GenServer.
* `cast` and `handle_cast` are used in asynchronous calls to the GenServer, where we don't need a return value.
* `handle_info` must be used for all other messages a server may receive that are not sent via `call` or `cast`, including regular messages sent with `send`.

So let's see a simple example of a queue with a GenServer:

```elixir
defmodule Queue do
  use GenServer

  ### Public API 

  def start_link(state \\ []) do
    GenServer.start_link(__MODULE__, state, name: __MODULE__)
  end

  def queue, do: GenServer.call(__MODULE__, :queue)
  def dequeue, do: GenServer.call(__MODULE__, :dequeue)
  def enqueue(value), do: GenServer.cast(__MODULE__, {:enqueue, value})
  
  ### Private API
￼

  def init(state), do: {:ok, state}

  def handle_call(:dequeue, _from, [value | state]) do
    {:reply, value, state}
  end

  def handle_call(:dequeue, _from, []), do: {:reply, nil, []}

  def handle_call(:queue, _from, state), do: {:reply, state, state} 

  def handle_cast({:enqueue, value}, state) do
    {:noreply, state ++ [value]}
  end
 
end
```

If we test it in `iex`:

```
iex> Queue.start_link([1, 2, 3])
{:ok, #PID<0.90.0>}
iex> Queue.dequeue
1
iex> Queue.dequeue
2
iex> Queue.queue
[3]
iex(5)> Queue.enqueue(5)
:ok
iex(6)> Queue.queue()
[3, 5]
```

Most of the time you will be using this abstraction because it's really powerful for a range of problems.

## Agent

Like the Elixir documentation says "Agents are a simple abstraction around state", its an abstraction around GenServer in which the only function is to retrieve and update its state. 
It's very useful for sharing data between other processes where you can query the data from the Agent or update it from multiple processes with total atomic and secure operations.
It has a very simple API and easy to use.
*If you need more than sharing state then you are probably looking for a GenServer and not an Agent*. 
A GenServer is more autonomous over its internal state than an Agent is.

So let's do a simple Queue with Agent:

```elixir
defmodule Queue do
  def start_link(state \\ []) do
    Agent.start_link(fn -> state end, name: __MODULE__)
  end

  def enqueue(item) do
    Agent.update(__MODULE__, fn(state) -> state ++ [item] end)
  end

  def dequeue() do
    Agent.get_and_update(__MODULE__, fn([item | state]) -> {item, state} end)
  end
 
  def queue() do
    Agent.get(__MODULE__, & &1)
  end
end
```

Let's test it on `iex`:

```
iex(1)> Queue.start_link([1,2,3])
{:ok, #PID<0.155.0>}
iex(2)> Queue.dequeue()
1
iex(3)> Queue.dequeue()
2
iex(4)> Queue.queue()
[3]
iex(5)> Queue.enqueue(5)
:ok
iex(6)> Queue.queue()
[3, 5]
```

In a simple case like a queue where we are only storing, updating and pulling state from the process an Agent version will be simpler and have the same behaviour that the GenServer one, but like all abstraction, if you want to deviate from what it gives it's gonna be very difficult to do what you want. You will have to use a GenServer for the complete control of its internal state and the `handle_` callbacks.

## Task

A process designed to handle a one-off task before shutting down and returning whatever results. Has a special task supervisor which makes it easy to dynamically spawn and monitor tasks.

We can make use of the async-await pattern with this kind of process that allows you to write sequential code and running it concurrently. `async` creates a new process, links it and monitors it. Once the task action finishes, a message will be sent to the caller with the result.
With `await` you can read this message sent by the task.

We can also implement cool patterns of batch processing like parallel maps with tasks:

```elixir
defmodule Parallel do
  def map(collection, func) do
    collection
    |> Enum.map(&(Task.async(fn -> func.(&1) end)))
    |> Enum.map(&Task.await/1)
  end
end
```

Remember Elixir makes a distinction between anonymous functions and named functions, where the former must be invoked with a dot `(.)` between the variable name and parentheses. The capture operator bridges this gap by allowing named functions to be assigned to variables and passed as arguments in the same way we assign, invoke, and pass anonymous functions.

Good for jobs that can be processed without blocking the current process and taking advantage of the lightweight processes from BEAM.

Some examples in `iex`: 

```
iex(9)> task = Task.async(fn -> Integer.is_even(1) end)
%Task{
  owner: #PID<0.152.0>,
  pid: #PID<0.169.0>,
  ref: #Reference<0.164594496.859832322.56552>
}
iex(10)> result = Task.await(task)
false
```

I hope you will incorporate these types of tools in your daily Elixir programming and that they will help you out solving cool problems!

Stay safe and be happy! 👋