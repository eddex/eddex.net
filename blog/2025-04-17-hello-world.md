---
layout: blog-post.njk
eleventyNavigation:
  key: "2025-04-17: Hello, World!"
  parent: Blog
  excerpt: What I learned when creating this website using 11ty/eleventy
title: How I created a personal website using 11ty/eleventy
permalink: "blog/{{ title | slugify }}/index.html"
tags:
  - 11ty
---

My first personal website was built back in 2013. The main page can still be found on the [Internet Archive](https://web.archive.org/web/20170914205104/http://eddex.net/). I built my own tiny custom CMS using PHP to autonatically generate the pages using config files and some custom HTML templates. I didn't use git back then so most of the page is gone forever. But from the front page alone you can tell that I had a lot of fun creating it. :^)

I abandoned the original page after a few years. But at some point in 2019, I tried to set up a personal blog yet again. I had a look at [Hugo](https://gohugo.io/) and built a small website using a template, put it online using GitHub pages aaaaand... never ever touched it again. Compared to my first website, this one is not very personal at all. Hugo seems to be a tool many people like, but it never really clicked for me. Creating a custom theme was too much effort in my opinion. It could be that I just didn't spend enough time, but everything seemed to be a bit too cumbersome for my taste.

Now it's April 2025, almost 6 years have passed, and I finally feel like creating a personal website again. I had some time today so I decided to learn something new. The new thing is called [@11ty/eleventy](https://www.11ty.dev/). In this blogpost I document how I set up the website and what I learned.

## Source Code

Just want to have a look at the final code of this website? Here you go: [github.com/eddex/eddex.net](https://github.com/eddex/eddex.net)

## Let's get started

To set up the project, I used the [Get Started](https://www.11ty.dev/docs/) guide.
As I had already installed [NodeJS](https://nodejs.org/en), I was able to simply copy-paste the commands.
I was looking for a tool to turn Markdown pages into HTML and that's exactly what it does. Great!

The generated HTML pages end up in the `_site` folder. This folder can later be uploaded to a web server.

## Using templates

All the pages on my website should have a consistent look. This can easily be achieved with 11ty using templates.
There are a lot of options for templates and I have never used any of them. So naturally I had a look at a few and finally decided to use `Nunjucks` as it seems like it has the most examples.

Following the [Layouts](https://www.11ty.dev/docs/layouts/) documentation, I learned how to use layouts. It's easy and straight forward. No configurations, settings etc. It just works.

So I created the `_includes` folder and added my main template for the page.
It looked something like this:

```html
---
title: eddex
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{ "{{ title }}" | escape }}</title>
  </head>
  <body>
    {{ "{{ content | safe }}" | escape }}
  </body>
</html>
```

I decided not to use layout aliases, as this adds an unnecessary layer of abstraction in my opinion.

## Adding the Picnic CSS library

The page looks like crap. Let's change that! Because as we all know, making the page beautiful is more important than getting the basic functionality to work. :)

I wanted to stay away from serving any client side JavaScript, so I searched for fitting CSS frameworks. A quick search led me to a [blog post by Ion Prodan](https://yon.fun/top-10-css-frameworks/). I scrolled half way down the page and clicked on [Picnic CSS](https://picnicss.com/). It looked sleek and it's very small. Later I found out that [Emilio Coppola](https://github.com/Coppolaemilio), which I know from his involvement with the [Godot Game Engine](https://godotengine.org/), is one of the contributors to the project, nice!

I downloaded Picnic using the NPM package:

```sh
npm install picnic
```

Using the NPM package has the advantage that I don't have to copy the CSS library into my source code.

Now the question was: How do I automatically copy the CSS file into my `_site` folder, so it can be used by my page?

This is where I learned about the 11ty config file. I had a brief look at the [Config](https://www.11ty.dev/docs/config/) docs. There is a lot of stuff in there that I don't need (yet?). But I learned how to create a config file.

Now to copy a file, I was able to use the instructions on the [Copy](https://www.11ty.dev/docs/copy/) docs. Here I had to go into more details to be able to copy the file from the NPM package to the `_site` folder without creating the `node_modules/picnic` subfolders.

My `eleventy.config.js` file now looked like this:

```js
export default async function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({
    "node_modules/picnic/picnic.min.css": "/",
  });
}
```

And just like that, the `node_modules/picnic/picnic.min.css` file is copied to `_site/picnic.min.css`.

## Custom CSS

To also add some custom CSS to the page, I created a `custom.css` file in the root of my project.
This time, to copy the file, I could simply specify the file name in my `eleventy.config.js` file:

```js
export default async function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({
    "node_modules/picnic/picnic.min.css": "/",
  });
  eleventyConfig.addPassthroughCopy("custom.css");
}
```

Now I was able to use both CSS files in my main template file for later use:

```html
---
title: eddex
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="/picnic.min.css" />
    <link rel="stylesheet" href="/custom.css" />
    <title>{{ "{{ title }}" | escape }}</title>
  </head>
  <body>
    {{ "{{ content | safe }}" | escape }}
  </body>
</html>
```

## Creating the Navbar

Now that the styling was taken care of, I wanted to add add a navbar.
Generating the navbar content is not part of the main 11ty package, this is where I learned about 11ty plugins.
A navbar can be generated using the official [Navigation](https://www.11ty.dev/docs/plugins/navigation/) plugin.

I'm not gonna go into details on how to do the basic setup, the documentation describes it well.
By default the navigation is rendered as an unordered list (`<ul>` and `<li>` tags). The example of the navbar in the Picnic CSS library used a `<div>` that contains `<a>` tags. Now what?

Lucily if you scroll down far enough in the Navigation docs, you'll find the section about [rendering options](https://www.11ty.dev/docs/plugins/navigation/#advanced-all-rendering-options-for-eleventy-navigation-to-html).
With a few easy changes, I was able to render my navbar exactly the way I wanted to.

This is what my main template looks like, with the auto-generated navbar and some styling:

```html
---
title: eddex
navToHtmlOptions:
  showExcerpt: true
  listElement: "div"
  listClass: "menu"
  listItemElement: "a"
  listItemClass: "pseudo button"
---

<!DOCTYPE html>
<html lang="en">
  <!-- head removed for readability... -->
  <body>
    <nav>
      <a href="#" class="brand">
        <img class="logo round-image" src="/img/eddex.jpeg" />
        <span>eddex</span>
      </a>

      <!-- responsive-->
      <input id="bmenub" type="checkbox" class="show" />
      <label for="bmenub" class="burger pseudo button">&#8801;</label>

      {{ "{{ collections.all | eleventyNavigation |
      eleventyNavigationToHtml(navToHtmlOptions) | safe }}" | escape }}
    </nav>
    <main id="content" class="content">
      <section>{{ "{{ content | safe }}" | escape }}</section>
      <p>beep boop - this could be the footer</p>
    </main>
  </body>
</html>
```

## Syntax highlighting using PrismJS

Syntax highlighting is always nice whan you read a block of code. I've never created a website that had this feature but thanks to the nice documentation of 11ty, I was able to set it up in no time.

There is a [Syntax Highlighting Plugin](https://www.11ty.dev/docs/plugins/syntaxhighlight/) for 11ty. It also requires some custom CSS, namely [PrismJS](https://github.com/PrismJS/prism). I installed the plugin, added it to my config, installed `PrismJS` via NPM and configured it in my config file too. Then I added the CSS file to my template and boom! Everything works! I must admit that it's really a joy to work with 11ty so far.

You can see how the syntax highlighting looks on this page. I use the `PrismJS` "tomorrow" theme.

## Formatting the date of a blog post

11ty provides a [Content Date](https://www.11ty.dev/docs/dates/) for each page.
I wanted to show this at the top of every blog post, right below the title.
Therefore, I added it to my template. However, it didn't work as expected.

The first thing I ran into was that the date wasn't rendered correctly because I tried to access the `date` variable directly in my template. Instead the `page.date` variable needs to be used in templates (as written in the documentation that I didn't read before running into this problem...)

Ok so now we have the date on the page but it looks like this:

```
Thu Apr 17 2025 15:10:54 GMT+0200 (Central European Summer Time)
```

A little excessive if you ask me. To format it nicely, I was able to use a feature of `Nunjucks` that allows one to call `JavaScript` functions on a variable in the template.

```
{{ "{{ page.date.toDateString() | safe }}" | escape }}
```

Which renders the date like this: `Thu Apr 17 2025`

## Conclusion

That's more or less it for my first experience with 11ty/eleventy. It is quite a joy to work with and seems to have everything I want so far. I'll keep working on this page so it could be that some of the things I described here will change in the future. If you're interested about the current setup, you can have a look at the [code](https://github.com/eddex/eddex.net).
