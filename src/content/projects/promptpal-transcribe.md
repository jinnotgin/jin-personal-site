---
slug: promptpal-transcribe
name: PromptPal Transcribe
thread: applied-ai
year: 2026
status: active
intent: A focused transcription tool that turns spoken work into usable written material.
stack: [NVIDIA Parakeet, browser ML, speech-to-text, LLMs, workflow design]
images: [/img/projects/promptpal-transcribe-b.png::PromptPal Transcribe interface with timestamped and speaker-labelled transcript output.]
---

## Why it existed

Many meetings, interviews, and voice notes contain useful information, but manually turning them into written notes is slow. The harder problem was that some of these recordings could contain client-sensitive data, so we could not simply use a commercial cloud transcription tool.

## The friction it answered

Most transcription tools send audio to cloud servers. That is fine for general use, but not for sensitive project discussions. The tool needed to be simple enough for managers to use, while keeping the audio processing local.

## What was built

A transcription tool in the PromptPal family, built to run in the browser. It uses NVIDIA Parakeet so audio can be processed without a cloud transcription server. The tool also supports the steps after transcription: timestamps, speaker labels, cleanup, summary, extraction, and turning the transcript into useful notes.

## What it left behind

This made one lesson clearer: "AI" is not one thing. PromptPal Transcribe is not mainly about large language models. It uses smaller local models, WebGPU, and client-only browser technology to solve a narrow problem. Sometimes the right answer is not a larger model, but a smaller one that can run closer to the user.
