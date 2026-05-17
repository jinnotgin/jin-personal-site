---
slug: promptpal-transcribe
name: PromptPal Transcribe
thread: applied-ai
year: 2026
status: active
intent: A private transcription tool that turns spoken work into usable written material.
stack: [NVIDIA Parakeet, browser ML, speech-to-text, LLMs, workflow design]
images: [/img/projects/promptpal-transcribe-b.png::PromptPal Transcribe interface with timestamped and speaker-labelled transcript output.]
---

## Why it existed

There are already many meeting transcription tools, and many of them are useful. The gap was privacy. Some meetings, interviews, and voice notes contain client-sensitive material, so turning speech into notes could not always depend on sending audio to a commercial cloud transcription service.

## The friction it answered

Most transcription tools send audio to cloud servers. That is fine for general use, but not for sensitive project discussions. The tool needed to be simple enough for managers to use, while keeping the audio processing local.

## What was built

A transcription tool in the PromptPal family, built to run in the browser. It uses [NVIDIA Parakeet](https://huggingface.co/nvidia/parakeet-tdt-0.6b-v3) so audio can be processed without a cloud transcription server. The tool also supports the steps after transcription: timestamps, speaker labels, cleanup, summary, extraction, and turning the transcript into useful notes.

## What it left behind

This made one lesson clearer: "AI" is as broad a word as "transportation". A bicycle and a rocket are both transportation, but you would not reach for a rocket to solve a bicycle-sized problem. PromptPal Transcribe *deliberately* uses smaller local models, WebGPU, and client-only browser technology. The right answer here was not a larger model in the cloud, but a lighter one running closer to the user and the data.
