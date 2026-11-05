---
title: "How I Fixed Malaysian English Dictation in Omarchy with Voxtype"
date: 2026-11-05
description: "A local dictation setup for the way I actually speak, using Voxtype, a Malaysian Whisper model, and a small Omarchy keybinding."
hero: "/images/writing/malaysian-english-dictation-omarchy/01.jpg"
og_image: "/images/writing/malaysian-english-dictation-omarchy/og.jpg"
topics: ["Dictation", "Omarchy", "Malaysia", "Local AI", "Workflow"]
type: "writing"
layout: "writing"
---

I spend a lot of my day explaining ideas to a computer. Some of that explanation happens in a chat window, and some of it happens in the terminal where my LLM agent waits for a prompt. Typing is precise, but it is also slow when a thought is still forming. I often know what I want to say before I know how I want to write it, and that gap is where dictation helps.

For a long time, dictation only half worked for me. Clean English came out fine, but the moment I spoke the way I actually speak, the text started to drift. A Malay word would become an Indonesian word, or an English phrase inside a Malay sentence would disappear. I would say "mencuba" and get "mencoba". I would mix "my line of work" into a sentence and the model would translate the whole thing into formal Malay. The result needed so much editing that typing was faster.

What I wanted was simple. I wanted to press a key, speak in the mixed Malay and English that I use with friends and colleagues, and see that same voice appear in the prompt. The tool should not correct my personality out of the sentence.

## The missing piece was the model

[Voxtype](https://voxtype.io/) is a small daemon for Linux that turns speech into text at the cursor. It records audio, sends it to a local Whisper model through [whisper.cpp](https://github.com/ggml-org/whisper.cpp), and types the result into whatever window is focused. Nothing goes to a cloud service. On [Omarchy](https://omarchy.org/), Voxtype is an optional install, and it already ships two useful shortcuts. Super + Ctrl + X toggles recording, and F9 works as push-to-talk.

The first setup used Whisper Small, which is a good general model. It can hear Malay, but its training data makes it lean toward standard or Indonesian forms, and it does not handle code-switching consistently. The language detector sometimes heard Malay at 97 percent and still produced Indonesian spelling, because language detection and vocabulary choice are two different problems. A spelling hint helped a little, but it also leaked words into the transcript. The real fix was a model trained on Malaysian speech.

The model I chose is [mesolitica/malaysian-whisper-small-v2](https://huggingface.co/mesolitica/malaysian-whisper-small-v2). It is a Whisper Small fine-tune trained on Malaysian and English audio, including local Malay and Manglish. It is not a text-to-speech model, so it cannot make audio. It is a speech recognition model, which is the direction I needed.

The upstream model is published as Hugging Face safetensors, while Voxtype expects whisper.cpp GGML. I wrote a small converter that downloads the exact model revision, verifies the SHA256, expands the BF16 weights, and writes the GGML file. It does not train anything, and it does not need a GPU. On my Ryzen 7 5800U laptop the conversion itself takes about three seconds, while the download and Python environment take most of the time. The whole process needs roughly 1.1 GB of free disk and Python 3.11 or newer.

## Installing it on Omarchy

If Voxtype is not installed yet, start with the Omarchy installer. It sets up the package, a default model, and the systemd user service.

```bash
omarchy voxtype install
```

Then clone the converter and run the install script. The script downloads from the original model page, verifies every file, converts the weights, checks the final checksum, and installs the model for Voxtype. It does not edit your configuration or restart the daemon.

```bash
git clone https://github.com/nurfaizfoat/voxtype-malaysian-whisper-small-v2.git
cd voxtype-malaysian-whisper-small-v2
./install.sh
```

The repository does not include the model file. The upstream Mesolitica model card does not state a license, so redistributing the weights would be unclear. The script downloads them from the official revision and keeps the converted file on your machine.

Open `~/.config/voxtype/config.toml` and point it at the new model. Keep the language list limited to English and Malay so the detector does not wander into unrelated languages.

```toml
[whisper]
model = "/home/YOUR_USER/.local/share/voxtype/models/ggml-malaysian-whisper-small-v2.bin"
language = ["en", "ms"]
translate = false
```

Remove any `initial_prompt` you may have added earlier. The fine tune is sensitive to prompt text, and a vocabulary hint can end up inside the transcript. Then restart the service and check that it is ready.

```bash
systemctl --user restart voxtype
voxtype status
```

The existing Omarchy shortcuts work without any change. Super + Ctrl + X toggles a recording, and holding F9 records while the key is held. The transcribed text is typed at the cursor, so it works in a terminal, a browser, an editor, or any other text field.

## A small fallback for English

Automatic language detection is useful, but it is not perfect. During testing, one English clip was detected as Malay and translated even though `translate` was false. The text was still readable, but it was not what I said.

Voxtype can use a different model for one recording without restarting the daemon. I added an English-only shortcut for that case. I chose Super + Ctrl + Shift + X because it was not used by another Omarchy binding.

```lua
-- ~/.config/hypr/bindings.lua
o.bind("SUPER + CTRL + SHIFT + X", "Toggle English dictation",
  "voxtype record toggle --model base.en")
```

Reload Hyprland and check for configuration errors after saving the file.

```bash
hyprctl reload
hyprctl configerrors
```

The fallback uses the original `base.en` model, which is already installed with Voxtype. It does not change the default model or restart the service. I use the Malaysian model for Malay and mixed speech, and I reach for the English shortcut when I am dictating a long English paragraph.

## What changed in my daily workflow

The change I notice is not that every word is perfect. It is that the text sounds like me. Malaysian forms survive more often, English phrases inside Malay sentences stay in English, and I spend less time rewriting. When I speak a first draft into my LLM agent, I can describe the problem in the same register I would use with a teammate. I still read the text before I send it, because dictation is a draft tool, not an author. But the draft is close enough to edit instead of replace.

Speed is acceptable for thought work. In my tests, 11 to 13 second clips took about 13 seconds with bilingual detection, and explicit English took about 8 seconds. A GPU will be faster, but a modern laptop CPU is enough for short prompts. The bigger win is that I can keep my hands on the keyboard and my eyes on the problem while I talk through it.

The workflow is now boring in the best way. I focus the agent prompt, hold F9, speak a messy first thought, release the key, and watch the sentence appear. If the thought is long, I use the toggle shortcut and take my time. The text is not a final answer. It is a starting point that I can edit with the same hands that were already on the keyboard.

## Where OpenWhispr fits

[OpenWhispr](https://openwhispr.com/) is another open source option worth knowing about. It is a desktop app for dictation, notes, meetings, and voice commands, and it supports local Whisper through whisper.cpp. It stores local models in `~/.cache/openwhispr/whisper-models/` and includes Malay in its language list. It also has a custom dictionary that can hold names and technical terms.

The important limitation is that OpenWhispr 1.11.0 does not offer a custom model picker. The local Whisper list is fixed to tiny, base, small, medium, large, and turbo. A GGML file copied into the cache will not appear as a new model just because it is there.

There are three practical ways to approach it. The first is the supported route. Keep one of the built-in models, set the language to Malay, and add Malaysian spellings and product names to the custom dictionary. This is the safest option and it survives updates, but it does not give you the Malaysian fine tune. It is a reasonable choice if you mostly need help with names and want to stay on the official path.

The second is a local replacement, and it is unsupported. Quit OpenWhispr, back up the existing `ggml-small.bin` in `~/.cache/openwhispr/whisper-models/`, and replace it with the converted Malaysian model renamed to `ggml-small.bin`. Start the app and select Small. OpenWhispr identifies the model by its filename, so it should load the new weights. Do not press Download or Delete for Small afterwards, because those actions can replace the file. Check the model again after an app update. This works as an experiment, but it is not a feature the project promises to keep working.

The third is to build from source and add a proper entry to `src/models/modelRegistryData.json`. That gives the model its own name and download entry, but it also means hosting the file and maintaining a fork. It is real integration work, and it is more than most people need for local dictation on Omarchy.

For now, Voxtype is my daily driver because it accepts a custom GGML path directly and starts with my session. OpenWhispr is attractive if you want a graphical app with notes, meeting capture, and an assistant in one place. The file replacement is worth trying if you are comfortable with an unsupported tweak, and the dictionary route is the one I would recommend to someone who wants a clean, update-friendly setup.

The lesson for me is that language tools need to fit the speaker, not the other way around. A general model can hear Malay, but hearing a language is not the same as knowing how its speakers move between languages. A small local model trained on Malaysian speech, a short keybinding, and a clear fallback for English gave me a setup that stays out of the way. I press F9, I talk through the idea, and the agent gets a prompt that sounds like something I would actually say.

The converter and full instructions are on [GitHub](https://github.com/nurfaizfoat/voxtype-malaysian-whisper-small-v2).
