# SSG Hydration And Lazy Content

This site uses `vite-ssg`, Vue Router, and lazy content modules. Detail pages and writing lists are generated as full HTML, but the browser still has to hydrate the Vue app after the first paint.

## The Problem

On direct entry to an SSG page, the visitor sees the server-generated HTML first. For example, a writing detail page arrives as a complete article.

If the route view uses top-level `await`, Vue treats the route as an async setup dependency. During client hydration, that dependency can trigger the global Suspense fallback. The result is:

1. the generated article appears
2. Vue hydration starts
3. the async route setup is pending
4. Suspense replaces the article with a skeleton or blank fallback
5. the same article appears again after the lazy module resolves

That is the flicker this repo avoids.

## The Approach

The client should start hydration with the same route data the SSG render used.

The current pattern is:

1. During SSG, route views load content with `onServerPrefetch`.
2. After the SSG render, `src/main.ts` copies the loaded route data into `vite-ssg` `initialState`.
3. In the browser, `src/main.ts` seeds local content caches from `initialState` before the route renders.
4. Route views use `src/composables/useCachedAsyncResource.ts` to read from cache synchronously first, and only lazy-load content when the cache is missing.

This keeps direct SSG hydration synchronous from the route's point of view. Client-side navigations can still lazy-load and show route-local loading states.

## Serialized Initial State

Serialized initial state is the handoff data embedded into each generated HTML page. The page already contains visible HTML, and it also carries the data needed for Vue to recreate the same route state during hydration.

Conceptually:

```html
<article>
  <h1>Play is how you learn what no one has figured out yet</h1>
  <p>There are two ways to learn...</p>
</article>

<script>
  window.__INITIAL_STATE__ = {
    post: {
      slug: 'play-is-how-you-learn-what-isnt-settled',
      title: 'Play is how you learn what no one has figured out yet',
      html: '<p>There are two ways to learn...</p>'
    }
  }
</script>
```

`vite-ssg` owns the actual serialization format. The site code only writes to and reads from `initialState`.

## Tradeoff

Generated HTML is larger because direct route pages contain both:

- the rendered HTML users see immediately
- serialized route data used by Vue during hydration

That duplication is intentional. It avoids duplicate lazy content loading during hydration and prevents the first visible SSG page from being replaced by a skeleton or blank state.

## Implementation Map

The shared composable is:

```txt
src/composables/useCachedAsyncResource.ts
```

The cache-backed content loaders are:

```txt
src/lib/postMarkdown.ts
src/lib/projects.ts
src/lib/markdown.ts
```

The SSG initial state handoff is in:

```txt
src/main.ts
```

The route views using this pattern are:

```txt
src/views/WritingDetailView.vue
src/views/ProjectDetailView.vue
src/views/WritingListView.vue
```

## Adding New Lazy SSG Routes

Avoid top-level `await` in route views for content that is already rendered during SSG.

Prefer this shape:

```ts
const routeKey = computed(() => String(route.params.slug))
const { data, isLoading } = useCachedAsyncResource(routeKey, readCache, loadContent)
```

Then wire the data path end to end:

1. The loader writes successful and missing results into a cache.
2. The route view uses `useCachedAsyncResource`.
3. `src/main.ts` captures the route's cached data into `initialState` after SSG render.
4. `src/main.ts` seeds the same cache from `initialState` in the browser.
5. The route renders a local loading state only when the cache is missing.

Keep the global Suspense fallback for genuine client-side async route transitions. Do not rely on it for direct hydration of already-rendered SSG content.
