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

        test("only appends the language block and reminder", () => {
            const context = buildContext();
            const result = adventureIn("german", { variant }).context(context, { optimized: true });
            expect(result.startsWith(context)).toBe(true);
            const added = result.slice(context.length);
            expect(added).toContain("<SYSTEM lang=\"de\">");
            expect(added).toContain(germanStrings().directives.trim());
            expect(added).toMatch(/\[ [^\]]+ \]\n\n$/);
        });

        test("appends even when the context is too long for stock LoLa's truncation", () => {
            const story = "The rain keeps falling on the keep. ".repeat(400);
            const context = buildContext({ story });
            const result = adventureIn("german", { variant }).context(context, { optimized: true, maxChars: 4000 });
            expect(result.startsWith(context)).toBe(true);
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
