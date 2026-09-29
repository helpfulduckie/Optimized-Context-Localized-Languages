# Optimized Context Localized Languages (OC-LoLa)

> Play AI Dungeon in your own language, on any AI Storyteller

by helpfulduckie (aka Aness) | based on Localized Languages (LoLa) by LewdLeah ❤️

---
## Table of Contents

- [Overview](#overview)
- [How It Differs From the Original LoLa](#how-it-differs-from-the-original-lola)
- [Installation](#installation)
- [Choosing Your Language](#choosing-your-language)
- [Supported Languages](#supported-languages)
- [Tips](#tips)
- [Troubleshooting](#troubleshooting)
- [Credits](#credits)

---

## Overview

Localized Languages lets you play AI Dungeon in the language you actually speak. Tell it your language once and the AI Storyteller writes the whole adventure in it. It supports 263 languages and styles, from Spanish and Japanese to Klingon, Pirate, and Brainrot.

This version keeps working when AI Dungeon's **Optimized Context** setting is on. The original LoLa silently does not reach the AI under that setting, so the story never makes it into your language or drifts back into English. This one doesn't.

### Features

- Any Language - 263 languages and styles, including romanized "(abc)" versions of languages with non-Latin scripts.
- Better Player Inputs - your "You..." and "You say..." actions are rewritten into your language as you submit them.
- Optimized Context Support - play with all your favorite AI Storyteller models.
- Adventure Script Support - add LoLa to any adventure or scenario, whether you are on mobile or mid-adventure.
- Plays Well With Others - LoLa leaves other scripts' instructions in place, and is bundled with [World Time Generator](https://github.com/helpfulduckie/World-Time-Generator-3).
- Optional [Auto-Cards](https://github.com/LewdLeah/Auto-Cards) - automatic story card generation by LewdLeah, included in one version of the script.

### Help Test It

This is a new release, and its author only speaks English. It has been checked on Optimized Context AI Storytellers, both as a scenario script and as an Adventure Script, to confirm LoLa's instructions reach the AI. What hasn't been checked is how well the AI Storyteller actually writes in each language. If you play in a language other than English, reports of how it went are very welcome, good or bad. Contact details are at the [bottom of this page](#credits).

---

## How It Differs From the Original LoLa

**On an Optimized Context AI Storyteller, the original LoLa's instructions never reach the AI; this version's do.** Optimized Context only lets a script add text to the end of what the AI reads. The original LoLa edits that text throughout, so AI Dungeon throws its changes away every turn. This version places its language instructions where Optimized Context allows them.

**Without Optimized Context, this version plays exactly like the original**, plus two bug fixes:

- Changing language mid-adventure no longer replaces the AI's reply with a "Continue our story…" line that stays in your story for good.
- LoLa no longer deletes other scripts' instructions when your scenario has no Author's Note.

**With Optimized Context on, a few of the original's extras are skipped**, because they would require editing text Optimized Context doesn't allow scripts to touch:

- The section labels AI Dungeon puts on what the AI reads, such as "Recent Story" and "World Lore", stay in English.
- The `{Language: …}` command stays in the text the AI reads rather than being hidden from it.
- The bundled Auto-Cards pauses. It won't generate new cards until Optimized Context is off, and any card requests wait until then.

**LoLa shares a small space with other scripts.** Under Optimized Context, LoLa's instructions go in a slot at the very end of what the AI reads, which holds about 460 characters. LoLa uses at most about 260 of them. If you run several scripts that use the same slot, they share it.

---

## Installation

There are two ways to add LoLa to your scenario or adventure.

### Adventure Scripts

This method is ideal for authors writing scenarios from their phone, or players who want to add LoLa to an adventure already in progress.

1. Go to [Optimized Context Localized Languages on AI Dungeon](https://play.aidungeon.com/script/wJjCxUMyTMjP/optimized-context-localized-languages) and click `Save`

2. Navigate to the Scripts configuration controls on AI Dungeon:

	- On any Adventure (aka Save), click Edit and then navigate to the `Scripts` tab (to the right of `Details`).

	- On a Scenario you own, click Edit and then scroll down on the `Details` tab to the `SCRIPTS` subsection.

3. Click the `+ Add Script` button. Select `Optimized Context Localized Languages` from the popup menu.

4. Choose your language (see [Choosing Your Language](#choosing-your-language)).

The Adventure Script includes Auto-Cards. Under Optimized Context it keeps its instructions in a pinned `LoLa Instructions` story card (see [Troubleshooting](#what-is-this-lola-instructions-story-card)).

### Script Editor

If you are adding LoLa to a scenario you own, you can instead use the Scenario Script Editor.

<details>

<summary>Script Editor install steps</summary>

#### Step 1: Choose Your Version

| Folder | Use when... |
| ------ | ----------- |
| [`src`](./src) | You want LoLa with Auto-Cards |
| [`src (Without Auto-Cards)`](./src%20%28Without%20Auto-Cards%29) | You want LoLa on its own |

> IMPORTANT: Do not mix and match files from the two folders. Use all four files from the same folder in Step 2.

If you want LoLa together with World Time Generator, use WTG's "wtg-lola" version instead, which already contains both.

#### Step 2: Install the Scripts

1. Go to [AI Dungeon](https://aidungeon.com/) on a desktop browser (or switch to desktop view on mobile)
2. [Create a new scenario](https://help.aidungeon.com/faq/what-are-scenarios) or open one you're editing
3. Open the **Details** tab
4. Scroll down to **Scripting** and toggle **Scripts Enabled** ON
5. Click **Edit Scripts**
6. For each of the four tabs below, delete any existing code and paste in the *full* contents of the corresponding file from the folder you chose in Step 1:

| Script Tab | File |
| ---------- | ---- |
| Library | `library.js` |
| Input | `input.js` |
| Context | `context.js` |
| Output | `output.js` |

7. Click the yellow **Save** button
8. Choose your language (see [Choosing Your Language](#choosing-your-language))

</details>

---

## Choosing Your Language

LoLa needs to be told which language to use. Until it is, it plays in English.

### For Players

Type `{Language: ???}` into any Do, Say, or Story action, replacing `???` with your language. For example:

```
{Language: Spanish}
```

You can change language the same way at any point in an adventure.

### For Scenario Authors

Add this line anywhere in your scenario's Opening:

```
{Language: ${Select your (real) language or leave empty:}}
```

Players are then asked for their language when they start your scenario, and LoLa picks it up automatically. Players who leave it empty get English.

**This step is optional, but it matters a lot.** Most players never read a scenario's description, so they won't know to type the command themselves. Asking in the Opening is the only way most of them will ever find out LoLa is there to help.

---

## Supported Languages

LoLa covers every language in the ISO 639-1 standard, plus a handful of just-for-fun styles.

<details>
<summary>Expand to view the full list of supported languages! 🌐</summary>
  
1. English
2. Abkhazian / аҧсуа / Apsua / აფსუა / Abkhaz
3. Abkhazian (abc)
4. Afar / Qafar Af
5. Afrikaans
6. Akan / ákán
7. Akan (abc)
8. Albanian / Shqip
9. Amharic / አማርኛ / Amarəñña
10. Amharic (abc)
11. Arabic / اَلْعَرَبِيَّةُ / Al-ʿarabiyyah
12. Arabic (abc)
13. Aragonese / Aragonés
14. Armenian / հայերեն / Hayeren
15. Armenian (abc)
16. Asmr / Whisper / Asmr Whisper Script
17. Assamese / অসমীয়া / ôxômiya / Asamiya
18. Assamese (abc)
19. Avaric / авар мацӏ / اوار ماض / Avar Maz / Avar
20. Avaric (abc)
21. Avestan / Upastawakaēna
22. Aymara / Aymaran
23. Azerbaijani / Azərbaycan Dili / آذربایجان دیلی / азәрбајҹан дили / Azeri
24. Azerbaijani (abc)
25. Bambara / ߓߡߊߣߊ߲ߞߊ߲ / بَمَنَنكَن / Bamanankan / Bamana
26. Bashkir / башҡорт теле / Başqort Tele / Bashkort
27. Bashkir (abc)
28. Basque / Euskara / Euskera
29. Belarusian / беларуская мова / Biełaruskaja Mova
30. Belarusian (abc)
31. Bengali / বাংলা / Bāŋlā / Bangla
32. Bengali (abc)
33. Bislama
34. Bosnian / босански / Bosanski / Bosniak
35. Bosnian (abc)
36. Brainrot
37. Brazilian / Português Brasileiro / Brazilian Portuguese
38. Breton / Brezhoneg
39. Bulgarian / български / Bulgarski
40. Bulgarian (abc)
41. Burmese / မြန်မာစာ / Mrãmācā / Myanmar
42. Burmese (abc)
43. Catalan / Valencian / Català / Valencià
44. Central Khmer / ខេមរភាសា / Khémôrôphéasa / Khmer / Cambodian
45. Central Khmer (abc)
46. Chamorro / Finu' Chamoru
47. Chechen / нохчийн мотт / Noxçiyn Mott / Chechnyan / Chechnian
48. Chechen (abc)
49. Chichewa / Chewa / Nyanja / Chinyanja
50. Chinese / Simplified Chinese / Mandarin / 简化字 / Jiǎnhuàzì / 简体字 / Jiǎntǐzì / Pinyin
51. Chinese (abc)
52. Church Slavic / Old Slavic / славе́нскїй ѧ҆зы́къ
53. Church Slavic (abc)
54. Chuvash / чӑвашла / çăvaşla
55. Chuvash (abc)
56. Cornish / Kernowek
57. Corporate / Business Speak / Corporate Jargon
58. Corsican / Corsu
59. Cree / ᓀᐦᐃᔭᐁᐧᐃᐧᐣ / Nehiyawewin
60. Cree (abc)
61. Croatian / Hrvatski / Crovatian
62. Czech / čeština / Czechian
63. Danish / Dansk
64. Divehi / Dhivehi / Maldivian / ދިވެހި
65. Dutch / Flemish / Nederlands
66. Dzongkha / རྫོང་ཁ་ / Bhutanese
67. Dzongkha (abc)
68. Esperanto
69. Estonian / Eesti Keel
70. Ewe / èʋegbe
71. Faroese / Føroyskt / Faeroese
72. Fijian / Na Vosa Vakaviti
73. Finnish / Suomi
74. French / Français
75. Fulah / ࢻُلْࢻُلْدٜ / 𞤬𞤵𞤤𞤬𞤵𞤤𞤣𞤫 / Fulfulde / ݒُلَارْ / 𞤨𞤵𞤤𞤢𞥄𞤪 / Pulaar / Fula / Fulani
76. Gaelic / Scottish Gaelic / Gàidhlig / Scots Gaelic
77. Galician / Galego
78. Ganda / Luganda
79. Georgian / ქართული / Kharthuli
80. Georgian (abc)
81. German / Deutsch
82. Greek / νέα ελληνικά / Néa Ellêniká
83. Greek (abc)
84. Guarani / Avañe'ẽ / Guaraní
85. Gujarati / ગુજરાતી / Gujarātī
86. Gujarati (abc)
87. Haitian Creole / Haitian / Kreyòl Ayisyen
88. Hausa / هَرْشٜن هَوْس / Halshen Hausa / Hausan
89. Hebrew / עברית / Ivrit
90. Hebrew (abc)
91. Herero / Otjiherero
92. Hindi / हिन्दी / Hindī
93. Hindi (abc)
94. Hiri Motu / Police Motu / Pidgin Motu
95. Hungarian / Magyar Nyelv / Magyar
96. Icelandic / íslenska
97. Ido
98. Igbo / ásụ̀sụ́ ìgbò
99. Indonesian / Bahasa Indonesia
100. Interlingua
101. Interlingue / Occidental
102. Inuktitut / ᐃᓄᒃᑎᑐᑦ
103. Inupiaq / Iñupiaq / Inupiat / Inupiatun
104. Irish / Gaeilge / Irish Gaelic
105. Italian / Italiano
106. Japanese / 日本語 / Nihongo
107. Japanese (abc)
108. Javanese / ꦧꦱꦗꦮ / Basa Jawa
109. Kalaallisut / Greenlandic
110. Kannada / ಕನ್ನಡ / Kannađa / Kannadan / Canarese
111. Kannada (abc)
112. Kanuri / كَنُرِيِه / Kànùrí
113. Kashmiri / कॉशुर / كأشُر / Kosher / Koshur
114. Kashmiri (abc)
115. Kazakh / қазақша / Qazaqşa / قازاقشا / Qazaq
116. Kazakh (abc)
117. Kikuyu / Gikuyu / Gĩgĩkũyũ
118. Kinyarwanda / Ikinyarwanda / Rwandan / Rwanda
119. Klingon / Tlhingan
120. Komi / коми кыв / Zyran / Zyrian / Komi-Zyryan
121. Komi (abc)
122. Kongo / Kikongo
123. Korean / 한국어 / Hangugeo / 조선말 / Chosŏnmal
124. Korean (abc)
125. Kuanyama / Oshikwanyama / Cuanhama / Kwanyama
126. Kurdish / کوردی / Kurdî
127. Kurdish (abc)
128. Kyrgyz / Kirghiz / кыргыз / قىرعىز
129. Kyrgyz (abc)
130. Lao / ພາສາລາວ / Phasa Lao / Laotian
131. Lao (abc)
132. Latin / Latinum
133. Latvian / Latviski / Lettish
134. Leetspeak / Eleet / Hacker Speak / L33t
135. Legalese / Lawyer / Legal Language
136. Limburgish / Limburgan / Limburger / Lèmburgs
137. Lingala / Lingála / Ngala
138. Lingua-Technis / Cant Mechanicus / Techna-Lingua / Binharic
139. Lithuanian / Lietuvių
140. Luba-Katanga / Kiluba / Luba-Shaba
141. Luxembourgish / Letzeburgesch / Lëtzebuergesch / Luxembourgian
142. Macedonian / македонски / Makedonski
143. Macedonian (abc)
144. Malagasy / مَلَغَسِ
145. Malay / بهاس ملايو / Bahasa Melayu
146. Malayalam / മലയാളം / Malayāļã
147. Malayalam (abc)
148. Maltese / Malti
149. Manx / Gaelg / Gailck / Manx Gaelic
150. Maori / Reo Māori
151. Marathi / मराठी / Marāṭhī / Maharashtran
152. Marathi (abc)
153. Marshallese / Kajin M̧ajeļ / Ebon
154. Mongolian / монгол хэл / Mongol Xel / Mongol
155. Mongolian (abc)
156. Nauru / Dorerin Naoe / Nauruan
157. Navajo / Navaho / Diné Bizaad / Naabeehó Bizaad
158. Navi / Lì'fya Lena'vi / Na'vi
159. Ndonga / Oshindonga
160. Nepali / नेपाली भाषा / Nepālī Bhāśā / Nepalese / Gorkhali
161. Nepali (abc)
162. North Ndebele / Sasenyakatho / Mthwakazi Ndebele
163. Northern Sami / Davvisámegiella
164. Norwegian / Norsk
165. Norwegian Bokmal / Bokmål / Norsk Bokmål
166. Norwegian Nynorsk / Nynorsk / Norsk Nynorsk
167. Occitan / Provençal / Provential / Provencal
168. Ojibwe / ᐊᓂᔑᓈᐯᒧᐎᓐ / Anishinaabemowin / Ojibway / Otchipwe / Ojibwemowin
169. Old English / ænglisc / Shakespearean English / Anglo-Saxon
170. Oriya / ଓଡ଼ିଆ / Odia / Odian / Odishan / Orissan
171. Oriya (abc)
172. Orkish / Mek Jargon
173. Oromo / Afaan Oromoo / Oromoo
174. Ossetian / Ossetic / ирон ӕвзаг / Iron ævzag / Ossete
175. Ossetian (abc)
176. Pali / Pāli / Pali-Magadhi
177. Panjabi / Punjabi / ਪੰਜਾਬੀ / پنجابی / Pãjābī
178. Panjabi (abc)
179. Persian / فارسی / Fārsiy / Farsi
180. Persian (abc)
181. Pig Latin / Igpay Atinlay
182. Pirate / Sea Shanty
183. Polish / Polski / Język Polski / Polszczyzna
184. Portuguese / Português / Português Europeu / European Portuguese
185. Purple Prose / First Year English Major / Pretentious
186. Pushto / Pashto / پښتو / Pax̌tow
187. Pushto (abc)
188. Quechua / Runa Simi / Kichwa Simi / Nuna Shimi / Quechuan
189. Rhyme / Poem / Rhyme Scheme / Poetry
190. Romanian / Moldavian / Română / ромынэ / Moldovan
191. Romansh / Rumantsch / Rumàntsch / Romauntsch / Romontsch / Romansch
192. Rundi / Ikirundi / Kirundi
193. Russian / русский язык / Russkiĭ âzyk
194. Russian (abc)
195. Samoan / Gagana Sāmoa
196. Sango / Yângâ Tî Sängö / Sangoic
197. Sanskrit / संस्कृतम् / Saṃskṛtam
198. Sanskrit (abc)
199. Sardinian / Sardu / Sard
200. Serbian / српски / Srpski
201. Serbian (abc)
202. Shona / Chishona
203. Sichuan Yi / Nuosu / ꆈꌠꉙ / Nuosuhxop / Northern Yi / Liangshan Yi / Nosu
204. Sichuan Yi (abc)
205. Sindhi / سنڌي / सिन्धी / Sindhī
206. Sindhi (abc)
207. Sinhalese / Sinhala / සිංහල / Siṁhala
208. Sinhalese (abc)
209. Slovak / Slovenčina / Slovakian
210. Slovenian / Slovenščina / Slovene
211. Somali / Soomaali / 𐒈𐒝𐒑𐒛𐒐𐒘 / سٝومالِ / Somalian
212. South Ndebele / Isindebele / Sakwandzundza
213. Southern Sotho / Sesotho / Sotho
214. Spanish / Castilian / Español / Castellano
215. Sundanese / Basa Sunda / بَاسَا سُوْندَا
216. Swahili / Kiswahili / كِسوَحِيلِ
217. Swati / Siswati / Swazi
218. Swedish / Svenska
219. Tagalog / Wikang Tagalog
220. Tahitian / Reo Tahiti
221. Tajik / тоҷикӣ / Tojikī / Tajiki
222. Tajik (abc)
223. Tamil / தமிழ் / Tamiḻ / Thamizh
224. Tamil (abc)
225. Tatar / татар теле / Tatar Tele / تاتار تئلئ
226. Tatar (abc)
227. Telugu / తెలుగు
228. Telugu (abc)
229. Thai / ภาษาไทย / Phasa Thai / Siamese / Central Thai
230. Thai (abc)
231. Tibetan / བོད་སྐད་ / Bodskad / ལྷ་སའི་སྐད་ / Lhas'iskad / Standard Tibetan / Lhasa Tibetan
232. Tibetan (abc)
233. Tigrinya / ትግርኛ / Təgrəñña / Tigrigna
234. Tigrinya (abc)
235. Tonga / Lea Faka-Tonga / Tongan / Tonga Islands
236. Traditional Chinese / 正體字 / 正体字 / Zhèngtǐzì / 繁體字 / Fántǐzì / 繁体字
237. Traditional Chinese (abc)
238. Tsonga / Xitsonga
239. Tswana / Setswana / Sechuana
240. Turkish / Türkçe / Türk Dili / Türkiye Türkçesi
241. Turkmen / Türkmençe / түркменче / تۆرکمنچه
242. Twi
243. Uighur / ئۇيغۇر تىلى / Uyghur / уйғур тили / Uyƣur Tili
244. Uighur (abc)
245. Ukrainian / українська / Ukraїnska
246. Ukrainian (abc)
247. Urdu / اُردُو / Urduw
248. Urdu (abc)
249. Uzbek / ózbekça / ўзбекча / ئوزبېچه
250. Valley Girl
251. Venda / Tshivenḓa / Tshivenda
252. Vietnamese / Tiếng Việt
253. Volapuk / Volapük
254. Walloon / Walon
255. Welsh / Cymraeg
256. Western Frisian / Frysk / Frisian / Fries
257. Wolof / وࣷلࣷفْ
258. Xhosa / Isixhosa / Xosa
259. Yiddish / ייִדיש / Yidiš / Judeo-German
260. Yiddish (abc)
261. Yoruba / èdè Yorùbá
262. Zhuang / Chuang / 話僮 / Vahcuengh
263. Zulu / Isizulu
</details>

---

## Tips

- Adventure quality varies between AI models, so try more than one
- Quality also varies between languages, especially rare ones
- Use a response length of 200 tokens for the best results
- Romanized "(abc)" versions are not necessarily more coherent than the native script
- Stay consistent by writing only in your selected language
- A custom Opening written in your language helps, though it's optional
- The Retry button is your friend, especially near the beginning of a new adventure
- Muse, Dynamic Small, and Wayfarer Small (in that order) may struggle with non-English
- Among the free models, Madness seems to be the best for multilingual writing

Tips from LewdLeah's original LoLa. Model recomendations have not been reevaluated since 2025.

---

## Troubleshooting

### The AI Storyteller is still writing in English

Check that you've told LoLa your language (see [Choosing Your Language](#choosing-your-language)). If you have, hit Retry a few times; the first turns of an adventure are the most likely to slip. Some AI models and some rarer languages simply work less well, so see [Tips](#tips) for which models to try.

### What is this `LoLa Instructions` story card?

> And can I unpin it?

If you installed LoLa as an Adventure Script and are playing on an Optimized Context AI Storyteller, LoLa keeps its language instructions to the AI Storyteller in this pinned story card. Adventure Scripts aren't allowed to use the memory slot the Script Editor version uses, and a pinned card is the next closest place to the end of what the AI reads.

You should not delete, modify, or unpin this card manually. LoLa manages it automatically, and empties and unpins it when you switch to an AI Storyteller without Optimized Context.

### Auto-Cards stopped making cards

Auto-Cards pauses while Optimized Context is on (see [How It Differs From the Original LoLa](#how-it-differs-from-the-original-lola)). Your card requests wait and resume when you switch to an AI Storyteller without Optimized Context.

---

## Credits

**Localized Languages (LoLa) and Auto-Cards**
LewdLeah — 2025

**Optimized Context modifications**
helpfulduckie (aka Aness) — 2026

**Bug fixes** found by the [InnerSelf-LoLa merge](https://github.com/DevilVonHell/InnerSelf-LoLa-Merge).

**License:** MIT — see the LICENSE file. In LewdLeah's words: "You have my full permission to use, copy, or modify LoLa." That includes your own published scenarios and scripts. 

**Try it:** [Optimized Context Localized Languages sample scenario](https://play.aidungeon.com/scenario/rBsB8Vv5C4UU/optimized-context-localized-languages)

**Original LoLa by LewdLeah**
- [Original Localized Languages repository](https://github.com/LewdLeah/Localized-Languages)
- [Original LoLa demo scenario](https://play.aidungeon.com/scenario/AX2nXYIPzcKd/localized-languages)
- [LewdLeah's AI Dungeon profile](https://play.aidungeon.com/profile/LewdLeah)
- [LoLa discussion thread](https://discord.com/channels/903327676884979802/1406127682365816852) on the [AI Dungeon Discord server](https://discord.gg/MXNqpSbuZT) (join the server first)

**What's new:** see [CHANGELOG.md](./CHANGELOG.md).

**Developers:** see [DEVELOPMENT.md](./DEVELOPMENT.md) for how this version works under the hood and how to run the tests.

---

**Questions or bug reports?**
Discord: Aness (helpfulduckie) | Email: helpfulduckie@gmail.com
