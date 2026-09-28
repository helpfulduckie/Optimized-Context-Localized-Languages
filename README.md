# Localized Languages (LoLa)
Made by LewdLeah ❤️

## About this fork: Optimized Context
This fork makes LoLa work when AI Dungeon's **Optimized Context** setting is on. Optimized Context accepts a change to the context only if the script appends text to the end of it. Any other change, anywhere in the context, and AI Dungeon discards the script's whole context modification for that turn. Stock LoLa rewrites the context throughout, so under Optimized Context none of its language guidance reached the model.

**With Optimized Context off (`info.useCacheEfficient` is false), LoLa works exactly as it always has,** apart from the two bug fixes below. Header translation, the Author's Note reminder, the language block and truncation are all unchanged.

**With Optimized Context on, the language guidance goes in front memory (`state.memory.frontMemory`).** AI Dungeon places front memory at the very end of the context and always keeps it, while text a script appends only gets whatever budget is left over and is cut off at the end when there isn't enough. LoLa writes the `<SYSTEM lang="…">` block with its two language directives, then the `[ reminder ]` line. It writes them in the Input tab so they reach the same turn, and checks them again in the Context tab in case another script replaced front memory; a Context-tab write only reaches the model on the next turn. Other scripts' front memory text is left in place, with LoLa's block after it.

**Front memory holds only about the last 463 characters, and AI Dungeon cuts from the start.** LoLa's block is at most 257 characters in any language, with the reminder last. In a bundle, everything scripts put in front memory shares those 463 characters.

**Everything else is appended, and only when it fits:**
- the generic instructions, when your language differs from the scenario's (or `USE_GENERIC_AI_INSTRUCTIONS` is on). They go in whole only if `info.maxChars` minus the context length, minus a 2500-character margin, leaves room for them, and are skipped that turn otherwise. The margin was measured live: about 960 characters plus 3.6 per token of response length.
- the opening seed, at the start of an adventure or once after a mid-adventure language change

It does not translate headers, edit the Author's Note, remove the `{Language: …}` command, or truncate. The "You"/"You say" prefix of Do/Say actions is still rewritten into your language as you submit them, because that happens in the Input tab, which Optimized Context doesn't restrict.

**Auto-Cards pauses under Optimized Context.** Its card memories, trimming and generation prompts all rewrite the context, so with the setting on it passes the context through untouched. It won't start generating a card, and it won't capture a story output as a card. Card requests, including ones made with `/ac`, wait and resume once Optimized Context is off. Its control cards keep working.

### Adventure Script installs
**Adventure Scripts may not write front memory, so set `ADVENTURE_SCRIPT: true` in the copy you install as one.** The setting is in LoLa's settings at the top of `LocalizedLanguages`, and in the `MainSettings` control panel in `src/library.js`, which overrides it. The Adventure Script is built from `src`, the copy with Auto-Cards.

- **Optimized Context on:** the language block, the generic instructions (when they apply) and the reminder go in a pinned story card titled `LoLa Instructions`, which AI Dungeon places near the end of the context. Nothing else about the Optimized Context path changes, except that the generic instructions are no longer appended, since the card carries them. LoLa writes the card in the Input tab and repairs it in the Context tab, as it does front memory.
- **The pin is refused:** the language block and reminder go into the append instead, under the same room check as the generic instructions.
- **Optimized Context off:** LoLa behaves exactly like a scenario install, which already works in an Adventure Script because it only edits the context text. The card is unpinned and emptied, not deleted, and on the first turn after switching LoLa removes the card's text from the context so the language block isn't doubled.

With `ADVENTURE_SCRIPT: false`, the default, nothing above applies and front memory is used as described earlier.

### Bug fixes (apply with Optimized Context on or off)
- **A mid-adventure language change no longer replaces that turn's output.** Stock LoLa overwrote the model's reply with a "Continue our story…" line, which then stayed in the story permanently. The prompt now goes once at the end of that turn's context instead.
- **The reminder no longer deletes text after the last action.** When there was no Author's Note, stock LoLa rebuilt the end of the context from the last action's text and dropped anything after it, including other scripts' instructions.

Both fixes were found by the [InnerSelf-LoLa merge](https://github.com/DevilVonHell/InnerSelf-LoLa-Merge) (their K10 and K9).

### Tests
`npm install`, then `npm test`. The suite runs the real library and tabs for both `src` variants in a small AI Dungeon sandbox (`test/aid.js`). It checks that output with Optimized Context off matches stock LoLa at commit `3a515ba`, that output with it on always begins with the original context byte-for-byte, that LoLa's front memory block shares front memory with other scripts, and that an Adventure Script install never writes front memory.

## Overview
Localized Languages (LoLa) is a context overhaul script for playing AI Dungeon in your language of choice. LoLa also improves player inputs and supports (optional) [Auto-Cards](https://github.com/LewdLeah/Auto-Cards) integration. It’s free and open-source for anyone to use however they see fit. Creators are welcome to use LoLa for multilingual accessibility in their published scenarios. Fully compliant with international standard ISO 639-1 and more~ ❤️
## Supported Languages
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

## Gameplay Suggestions
- Dear Creators, please add `{Language: ${Select your (real) language or leave empty:}}` to your scenario Opening!
- Adventure quality varies between different AI models, so try multiple
- Quality also varies between different languages, especially rare ones
- Use a response length of 200 tokens for the best results
- Romanized language variants "(abc)" are not necessarily more coherent
- Try to remain consistent by using only your selected language
- Writing a custom opening in your language is helpful, though optional
- The "Retry" button is your friend, especially near the beginning of new adventures
- Muse, Dynamic Small, and Wayfarer Small (in that order) may struggle with non-English
- Among the free models, Madness is (seemingly) the best for multilingual writing
## Permission
LoLa is both free and open-source for anyone to use within their own scenarios or scripts, even including published works. You have my full permission to use, copy, or modify LoLa. Please enjoy! ❤️
## Scenario Script Installation Guide
1. Use the [AI Dungeon website](https://aidungeon.com/) on PC (or view as desktop if mobile-only)
2. [Create a new scenario](https://help.aidungeon.com/faq/what-are-scenarios) or edit one of your existing scenarios
3. Open the `DETAILS` tab at the top while editing your scenario
4. Scroll down to `Scripting` and toggle ON → `Scripts Enabled`
5. Select `EDIT SCRIPTS`
6. Select the `Input` tab on the left
7. Delete all code within said tab
8. Copy and paste the following code into your empty `Input` tab:
```javascript
// Your "Input" tab should look like this
const modifier = (text) => {
  // Your other input modifier scripts go here (preferred)
  text = AutoCards("input", text);
  text = LocalizedLanguages("input", text);
  // Your other input modifier scripts go here (alternative)
  return { text };
};
modifier(text);
```
9. Select the `Context` tab on the left
10. Delete all code within said tab
11. Copy and paste the following code into your empty `Context` tab:
```javascript
// Your "Context" tab should look like this
const modifier = (text) => {
  // Your other context modifier scripts go here (preferred)
  [text, stop] = AutoCards("context", text, stop);
  text = LocalizedLanguages("context", text);
  // Your other context modifier scripts go here (risky)
  return { text, stop };
};
modifier(text);
```
12. Select the `Output` tab on the left
13. Delete all code within said tab
14. Copy and paste the following code into your empty `Output` tab:
```javascript
// Your "Output" tab should look like this
const modifier = (text) => {
  // Your other output modifier scripts go here (preferred)
  text = AutoCards("output", text);
  // Your other output modifier scripts go here (alternative)
  return { text };
};
modifier(text);
```
15. Select the `Library` tab on the left
16. Delete all code within said tab
17. Open the Library code (hyperlink below) in a new browser tab
- [Library code](./src/library.js)
18. Copy the *full* code from the page above and paste into your empty `Library` tab
19. Click the big yellow `SAVE` button in the top right corner
20. For private/personal use, submit `{Language: ???}` using Do/Say/Story (replace `???` with your language)
21. When publishing scenarios, add `{Language: ${Select your (real) language or leave empty:}}` to the Opening
22. Step 21 is optional, but still VERY important! (defaults to English if blank) ❤️

<details>
<summary>Expand to learn why step 21 matters so much ℹ️</summary>
​

TL;DR - It's about effective communication, a seamless user experience, and good alignment between player expectations and actual scenario gameplay.

LoLa _relies_ on step 21 (or step 20) in order to correctly identify the requested language. If your scenario lacks this placeholder, then the script simply defaults to English every time, because it can't read the player's mind. Think of the {Language: ...} thingy like a command; it's how the script detects which language to engage, behind the scenes. Therefore, I _strongly_ recommend including `{Language: ${Select your (real) language or leave empty:}}` anywhere within your scenario's Opening plot component. At the top, bottom, or anywhere in-between. Your choice.

Players of published works aren't going to understand this on their own, so it's extremely helpful for Creators to follow this step. And, if there's one thing I've learned from AI Dungeon players, it's that virtually no one reads the description. And that may be especially true for the players we're trying to help the most here.

Anyway, including this placeholder _dramatically_ simplifies usage and prevents confusion. As a Creator myself, I strongly believe a seamless user experience is the _most important characteristic_ of highly successful AI Dungeon scenarios. That's my personal opinion.

Genuinely...and I mean this with kindness: __Assume players know nothing.__ So make things easy for them. Think of it as yet another dimension to accessibility. Simplicity and straightforwardness are key, because above all else, AI Dungeon players expect things to work on their own.

Thanks for listening, sorry about the excessive wall of text. 😅
</details>

## Useful Links
### Simple demo scenario
- [Localized Languages](https://play.aidungeon.com/scenario/AX2nXYIPzcKd/localized-languages)
### My AI Dungeon profile page
- [LewdLeah](https://play.aidungeon.com/profile/LewdLeah)
### LoLa discussion thread
- [Localized Languages - discussion](https://discord.com/channels/903327676884979802/1406127682365816852)
- [AI Dungeon official Discord server invite](https://discord.gg/MXNqpSbuZT) (required to access the first link)
- Feel free to ping me anytime @LewdLeah if you'd like to chat or share ideas. But please remember this is a personal passion project for me, something I do because I enjoy it, not as a job. Your kindness, patience, and love mean so much to me~ ❤️
