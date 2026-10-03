---
slug: xiexie
name: 写写 Xiě Xiě
thread: homegrown
year: 2026
status: active
intent: A place to practise Chinese handwriting, starting again with characters I learnt in school.
stack: [Vue 3, TypeScript, Pinia, Hanzi Writer, IndexedDB, Firebase]
links: [Try 写写::https://xiexie.web.app, GitHub::https://github.com/jinnotgin/xiexie]
images: [./og-image.png::写写 in two Chinese handwriting grids with the tagline Remember how to write Chinese, one stroke at a time.]
---

## Why it existed

Writing Chinese has always been difficult for me, even though I did relatively well in Chinese exams at school. I can speak it, but reading takes more effort, and writing is where I really struggle.

My parents are from China, and I have a very Chinese-sounding, two-word full name: "Lin Jin". You might expect my Chinese to be better than it is, and so did many people I met. I wanted to practise, so I built 写写: somewhere to start again with characters I learnt in primary school.

I developed the whole project with [Claude Opus 5.5](https://www.anthropic.com/claude-opus-5-5), which helped steer the design, implementation, and testing throughout. I supplied the direction and feedback from people trying it.

## What was built

<video controls playsinline preload="metadata" poster="/media/xiexie/xiexie-poster.png" aria-label="写写 Chinese handwriting practice demo reel">
  <source src="/media/xiexie/xiexie-reel.mp4" type="video/mp4">
  <a href="/media/xiexie/xiexie-reel.mp4">Watch the 写写 demo reel</a>.
</video>

写写 lets you practise handwriting in the browser. Its stroke-by-stroke mode uses the excellent [Hanzi Writer](https://hanziwriter.org) to guide you through a character and check each stroke. This is useful when learning how to write a character, including its stroke order.

You can start at a familiar level. P1 to P6 follow the [MOE 欢乐伙伴 character lists](https://www.moe.gov.sg/primary/curriculum/syllabus). The secondary levels cover the remaining characters in [China's list of 3,500 everyday characters](https://github.com/shengdoushi/common-standard-chinese-characters-table), grouped by frequency rather than an MOE secondary syllabus. A business level adds words used at work.

You can start without an account, with progress saved in your browser, or sign in with Google to carry it across devices.

## Making room for natural handwriting

After a couple of rounds of guerrilla user testing, I realised many people wanted to write the word quickly. They were less concerned with stroke order. Checking one stroke at a time got in the way of how they wanted to practise.

That led to relaxed mode, which checks the character as a whole and allows strokes in any order or direction, including joined strokes. It needed a new handwriting detection engine.

Claude Opus 5.5 wrote the custom engine and used handwriting samples I supplied to generate many simulated strokes for testing. We used those variations to tune how forgiving the checker should be: accepting imperfect handwriting and joined strokes, while still rejecting characters that were too far off.

For handwriting the local engine rejects, I added Google's handwriting recogniser as an optional second opinion. It uses the [unofficial endpoint](https://github.com/icelam/chinese-handwriting-recognition#api-endpoint) behind Google Translate and Input Tools. I do not know how long that endpoint will stay available; if it stops responding, practice continues with the local checker.

If your Chinese handwriting is a little rusty too, [give 写写 a try](https://xiexie.web.app). We can practise together.
