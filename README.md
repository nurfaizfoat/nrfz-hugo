## ✨ Neobrute (Bulma + Hugo Porfolio Theme)

[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg)](https://github.com/ellerbrock/open-source-badges/) [![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)

## 💎 Introduction

I was in need of quick static site generator that uses less JS, so that I can deploy leaner. So I created this. It is based from Hugo v0.132.2 + Bulma CSS v1.0. 

Template for [Hugo](https://gohugo.io), a static page generator.  
Layout with the [Bulma](https://bulma.io/) CSS Framework based on Flexbox.

## 📦 Installation

The theme file is in the `themes/neobrute` dir, so in order to use it, you need first to install Hugo in your development environment and then `git submodule` it.
I'll write an eloborate instruction later. In the meantime, you may have a look at [Hugo Deployment](https://gohugo.io/hosting-and-deployment/)

## Image loading

Large local images use `themes/neobrute/layouts/partials/image.html`. Hugo generates responsive WebP files and a tiny embedded blurred preview at build time. Images below the first screen use browser-native lazy loading; the main image loads eagerly. Width and height reserve space while images load, and lightboxes request the original image only when opened.

```go-html-template
{{ partial "image" (dict "src" "images/example.jpg" "alt" "Describe the image" "class" "is-borderless is-rounded-img") }}
```

Set `"eager" true` for a page's main image and pass `"sizes"` for its column width. Local Markdown images in Writing use the same partial automatically. SVGs and animated GIFs retain their original format. Images remain usable with JavaScript disabled.

Run `hugo` and upload the entire contents of `public/`, including the generated `images/*_hu*.webp` files. The first build processes images; subsequent builds reuse Hugo's image cache.

## Screenshots

![Landing Page](https://i.ibb.co/MsFNMNV/Screenshot-from-2024-08-19-23-13-47.png)
