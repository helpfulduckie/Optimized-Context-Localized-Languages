const { Adventure, buildContext } = require("./aid");

// Initialize LoLa's state the way a real adventure would, then pick a language without a mid-adventure change
// The last history entry matches the context's last action, as it does in AI Dungeon
function adventureIn(language, options = {}, lastAction = "\n> You greet the steward.\n") {
    const adventure = new Adventure(options).skipOpening();
    adventure.input(lastAction);
    adventure.history.push({ text: lastAction, type: "do" });
    adventure.state.LocalizedLanguages.language = language;
    adventure.state.LocalizedLanguages.change = false;
    return adventure;
}

// German strings pulled from LoLa's own translation table, so the assertions don't hardcode translations
function germanStrings() {
    const adventure = adventureIn("german");
    const translated = adventure.context(buildContext());
    const directives = translated.match(/<SYSTEM lang="de">([\s\S]*?)<\/SYSTEM>/)[1];
    return { directives };
}

describe.each(["full", "noAC"])("%s variant", (variant) => {
    describe("Optimized Context off", () => {
        test.each([
            ["english", {}],
            ["german", {}],
            ["german", { authorsNote: false }],
            ["french", { lastAction: "\nThe steward bows.\n" }]
        ])("matches stock LoLa in %s %j", (language, contextOptions) => {
            const context = buildContext(contextOptions);
            const lastAction = contextOptions.lastAction;
            const fork = adventureIn(language, { variant }, lastAction).context(context);
            const stock = adventureIn(language, { variant, stock: true }, lastAction).context(context);
            expect(fork).toBe(stock);
        });

        test("still translates headers and puts the language block before the plot", () => {
            const translated = adventureIn("german", { variant }).context(buildContext());
            expect(translated.indexOf("<SYSTEM lang=\"de\">")).toBeGreaterThan(-1);
            expect(translated.indexOf("<SYSTEM lang=\"de\">")).toBeLessThan(translated.indexOf("You are Kael"));
            expect(translated).not.toContain("World Lore:");
            expect(translated).not.toContain("Recent Story:");
        });
    });

    describe("Optimized Context on", () => {
        test("leaves an English adventure's context byte-identical", () => {
            const context = buildContext();
            expect(adventureIn("english", { variant }).context(context, { optimized: true })).toBe(context);
        });

        test("puts the language block and reminder in front memory, reminder last", () => {
            const adventure = adventureIn("german", { variant });
            const result = adventure.context(buildContext(), { optimized: true });
            expect(result).not.toContain("<SYSTEM");
            const front = adventure.state.memory.frontMemory;
            expect(front.startsWith("<SYSTEM lang=\"de\">")).toBe(true);
            expect(front).toContain(germanStrings().directives.trim());
            expect(front).toMatch(/\n\n\[ [^\]]+ \]$/);
        });

        test.each(["german", "spanish", "russian", "hindi", "japanese", "chinese", "arabic"])(
            "the %s front memory block fits AI Dungeon's 463-character front memory",
            (language) => {
                const adventure = adventureIn(language, { variant });
                adventure.context(buildContext(), { optimized: true });
                expect(adventure.state.memory.frontMemory.length).toBeGreaterThan(0);
                expect(adventure.state.memory.frontMemory.length).toBeLessThanOrEqual(463);
            }
        );

        test("the input hook writes front memory so it reaches the same turn", () => {
            const adventure = new Adventure({ variant }).skipOpening();
            adventure.input("{Language: German}", { info: { actionCount: 10, useCacheEfficient: true } });
            expect(adventure.state.memory.frontMemory).toContain("<SYSTEM lang=\"de\">");
        });

        test("the input hook falls back to the last context hook when it isn't told the setting", () => {
            const adventure = adventureIn("german", { variant });
            adventure.context(buildContext(), { optimized: true });
            adventure.state.memory.frontMemory = "";
            adventure.input("\n> You wait.\n");
            expect(adventure.state.memory.frontMemory).toContain("<SYSTEM lang=\"de\">");
        });

        test("keeps other scripts' front memory and repairs its own block once", () => {
            const adventure = adventureIn("german", { variant });
            adventure.state.memory = { frontMemory: "[It is noon.]" };
            adventure.context(buildContext(), { optimized: true });
            const front = adventure.state.memory.frontMemory;
            expect(front.startsWith("[It is noon.]\n<SYSTEM lang=\"de\">")).toBe(true);
            // Unchanged when nothing removed it
            adventure.context(buildContext(), { optimized: true });
            expect(adventure.state.memory.frontMemory).toBe(front);
            // Another script rewrites front memory; LoLa adds its block back after it
            adventure.state.memory.frontMemory = "[It is dusk.]";
            adventure.context(buildContext(), { optimized: true });
            expect(adventure.state.memory.frontMemory).toBe(front.replace("noon", "dusk"));
        });

        test("appends the generic instructions when they fit in the room AI Dungeon leaves", () => {
            const context = buildContext();
            const result = adventureIn("german", { variant }).context(context, { optimized: true });
            expect(result.startsWith(context)).toBe(true);
            expect(result.slice(context.length)).toMatch(/^\n\n\S[\s\S]*\n- [\s\S]*\n\n$/);
        });

        test("skips the generic instructions when they don't fit", () => {
            const context = buildContext();
            const maxChars = context.length + 2500 + 100;
            expect(adventureIn("german", { variant }).context(context, { optimized: true, maxChars })).toBe(context);
        });

        test("leaves the context alone when it is too long for stock LoLa's truncation", () => {
            const story = "The rain keeps falling on the keep. ".repeat(400);
            const context = buildContext({ story });
            const result = adventureIn("german", { variant }).context(context, { optimized: true, maxChars: 4000 });
            expect(result).toBe(context);
        });

        test("turning it off removes the front memory block without doubling the language block", () => {
            const adventure = adventureIn("german", { variant });
            adventure.context(buildContext(), { optimized: true });
            const block = adventure.state.memory.frontMemory;
            // AI Dungeon still includes this turn's front memory at the end of the context
            const result = adventure.context(buildContext({ tail: "\n" + block }));
            expect(result.split("<SYSTEM lang=\"de\">").length).toBe(2);
            expect(adventure.state.memory.frontMemory).toBe("");
        });

        test("appends the opening seed at the start of an adventure", () => {
            const adventure = new Adventure({ variant });
            adventure.input("{Language: German}\n\n");
            const context = buildContext({ story: "", authorsNote: false, lastAction: "\n{Language: German}\n\n" });
            const result = adventure.context(context, { optimized: true });
            expect(result.startsWith(context)).toBe(true);
            expect(result.endsWith(" ")).toBe(true);
            expect(result.length).toBeGreaterThan(context.length + 200);
        });
    });

    describe("Adventure Script install", () => {
        const adventure = (options = {}) => ({ variant, adventureScript: true, ...options });
        const instructionsCard = (a) => a.storyCards.find(card => card.title === "LoLa Instructions");

        test("under Optimized Context keeps the guidance in a pinned card and never writes front memory", () => {
            const a = adventureIn("german", adventure());
            const context = buildContext();
            const result = a.context(context, { optimized: true });
            // The card carries the generic instructions, so nothing is appended mid-adventure
            expect(result).toBe(context);
            expect(a.state.memory).toBeUndefined();
            const card = instructionsCard(a);
            expect(card.isPinned).toBe(true);
            expect(card.entry.startsWith("<SYSTEM lang=\"de\">")).toBe(true);
            expect(card.entry).toContain(germanStrings().directives.trim());
            expect(card.entry).toMatch(/\n\n[^\n]*\n- [\s\S]*\n\n\[ [^\]]+ \]$/);
        });

        test("the input hook writes the card so it reaches the same turn", () => {
            const a = new Adventure(adventure()).skipOpening();
            a.input("{Language: German}", { info: { actionCount: 10, useCacheEfficient: true } });
            expect(instructionsCard(a).isPinned).toBe(true);
            expect(instructionsCard(a).entry).toContain("<SYSTEM lang=\"de\">");
            expect(a.state.memory).toBeUndefined();
        });

        test("an English adventure gets no card", () => {
            const a = adventureIn("english", adventure());
            const context = buildContext();
            expect(a.context(context, { optimized: true })).toBe(context);
            expect(instructionsCard(a)).toBeUndefined();
        });

        test("a refused pin moves the language block and reminder into the append", () => {
            const a = adventureIn("german", adventure({ refusePins: true }));
            const context = buildContext();
            const result = a.context(context, { optimized: true });
            expect(result.startsWith(context)).toBe(true);
            const appended = result.slice(context.length);
            expect(appended).toContain("<SYSTEM lang=\"de\">");
            expect(appended).toMatch(/\n- [\s\S]*<SYSTEM[\s\S]*\n\n\[ [^\]]+ \]\n\n$/);
            expect(a.state.memory).toBeUndefined();
        });

        test("without Optimized Context matches a scenario install and makes no card", () => {
            const context = buildContext();
            const a = adventureIn("german", adventure());
            expect(a.context(context)).toBe(adventureIn("german", { variant }).context(context));
            expect(instructionsCard(a)).toBeUndefined();
            expect(a.state.memory).toBeUndefined();
        });

        test("turning Optimized Context off unpins the card without doubling the language block", () => {
            const a = adventureIn("german", adventure());
            a.context(buildContext(), { optimized: true });
            const entry = instructionsCard(a).entry;
            // AI Dungeon still includes the pinned card in this turn's context
            const result = a.context(buildContext({ tail: "\n" + entry }));
            expect(result.split("<SYSTEM lang=\"de\">").length).toBe(2);
            expect(instructionsCard(a).isPinned).toBe(false);
            expect(instructionsCard(a).entry).toBe("");
            expect(a.state.memory).toBeUndefined();
        });
    });

    describe("reminder placement keeps text after the last action (K9)", () => {
        const tail = "\n\n<another script's instructions>";

        test("the fork keeps it", () => {
            const result = adventureIn("german", { variant }).context(buildContext({ authorsNote: false, tail }));
            expect(result).toContain("<another script's instructions>");
        });

        test("stock LoLa dropped it", () => {
            const result = adventureIn("german", { variant, stock: true }).context(buildContext({ authorsNote: false, tail }));
            expect(result).not.toContain("<another script's instructions>");
        });
    });

    describe("mid-adventure language change (K10)", () => {
        const model = " The steward answers in a language you now understand.";

        function switchToGerman(options) {
            const adventure = new Adventure(options).skipOpening();
            adventure.input("\n> You look around.\n");
            const command = adventure.input("{Language: German}");
            adventure.history.push({ text: command.text, type: "story" });
            return adventure;
        }

        test.each([false, true])("seeds the new language in that turn's context (optimized %s)", (optimized) => {
            const adventure = switchToGerman({ variant });
            const context = buildContext({ authorsNote: false, lastAction: "\n{Language: German}\n\n" });
            const result = adventure.context(context, { optimized });
            expect(result).toMatch(/:\n\n$/);
            if (optimized) {
                expect(result.startsWith(context)).toBe(true);
            }
            // The seed is used once
            expect(adventure.context(context, { optimized })).not.toBe(result);
        });

        test("leaves the model's output alone", () => {
            const adventure = switchToGerman({ variant });
            adventure.context(buildContext());
            expect(adventure.output(model).text).toContain(model.trim());
        });

        test("stock LoLa replaced the model's output", () => {
            const adventure = switchToGerman({ variant, stock: true });
            adventure.context(buildContext());
            expect(adventure.output(model).text).not.toContain(model.trim());
        });
    });

    describe("info card", () => {
        // LoLa adds the card after 30 turns in one language
        function infoCard(language) {
            const adventure = adventureIn(language, { variant });
            for (let turn = 0; turn < 40; turn++) {
                adventure.actionCount++;
                adventure.input("\n> You wait.\n");
                adventure.context(buildContext());
                adventure.output(" Time passes.");
                const card = adventure.storyCards.find(({ title }) => title === "Localized Languages");
                if (card) {
                    return card;
                }
            }
            throw new Error("no info card after 40 turns");
        }

        test("names OC-LoLa and links the repo instead of LewdLeah's profile", () => {
            const [intro, link] = infoCard("english").entry.split("\n\n");
            expect(intro).toBe("Optimized Context Localized Languages (OC-LoLa) v1.0.2-oc.2 is an open-source script for any AI Dungeon scenario. ❤️");
            expect(link).toBe("https://github.com/helpfulduckie/Optimized-Context-Localized-Languages");
        });

        // Thai has no sentence terminator between the two sentences; Rhyme ends its first with a semicolon
        test.each(["thai", "rhyme"])("keeps only the first sentence in %s", (language) => {
            const [intro] = infoCard(language).entry.split("\n\n");
            expect(intro).not.toMatch(/\{\d\}|LewdLeah|profile|โปรไฟล์/);
            expect(intro).toMatch(/AI Dungeon.{0,20} ❤️$/);
        });
    });
});

describe("Auto-Cards under Optimized Context", () => {
    test("the library-scope cleanup leaves the context alone", () => {
        const story = "The gates creak open.\n\n>>> please select \"continue\" (0%) <<<\n\nThe steward waits.";
        const context = buildContext({ story });
        const adventure = adventureIn("english", { variant: "full" });
        expect(adventure.context(context, { optimized: true })).toBe(context);
        // Without Optimized Context the same cleanup does rewrite it
        expect(adventureIn("english", { variant: "full" }).context(context)).not.toBe(context);
    });

    // Enable Auto-Cards, request a card, then play turns until its generation prompt would reach the model
    function playWithCardRequest(optimizedTurns, totalTurns) {
        const adventure = new Adventure({ variant: "full" }).skipOpening();
        adventure.run("input", "\n> You look around.\n", {
            code: "AutoCards().API.toggle(true); AutoCards().API.generateCard(\"Silver Keep\"); ({ text })"
        });
        const turns = [];
        for (let turn = 0; turn < totalTurns; turn++) {
            const optimized = turn < optimizedTurns;
            adventure.actionCount++;
            const input = adventure.input("\n> You wait.\n").text;
            adventure.history.push({ text: input, type: "do" });
            const context = buildContext({ lastAction: input, story: adventure.history.map(action => action.text).join("") });
            const result = adventure.context(context, { optimized });
            const output = adventure.output(" The steward nods slowly.", { optimized }).text;
            adventure.history.push({ text: output, type: "continue" });
            adventure.actionCount++;
            turns.push({ optimized, context, result, output });
        }
        return turns;
    }

    const isGenerationPrompt = (text) => /informational entry for Silver Keep/.test(text);

    test("without Optimized Context the request does produce a generation prompt", () => {
        const turns = playWithCardRequest(0, 10);
        expect(turns.some(turn => isGenerationPrompt(turn.result))).toBe(true);
    });

    test("with Optimized Context the prompt is paused, the context untouched and the output never captured", () => {
        const turns = playWithCardRequest(10, 14);
        for (const turn of turns.filter(t => t.optimized)) {
            expect(turn.result).toBe(turn.context);
            expect(turn.output).toContain("The steward nods slowly.");
        }
        // The request survives and resumes once Optimized Context is off
        expect(turns.filter(t => !t.optimized).some(turn => isGenerationPrompt(turn.result))).toBe(true);
    });
});
