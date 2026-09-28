// Minimal AI Dungeon sandbox for running LoLa's real library and hook tabs under Jest.
// Each hook call gets a fresh VM context, like AI Dungeon, which reruns the Library tab before every hook.
// state, storyCards and history persist across calls on the same Adventure.

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { execFileSync } = require("child_process");

const ROOT = path.join(__dirname, "..");

// LewdLeah/Localized-Languages main at the time of forking; the stock behavior the fork is compared against
const STOCK_COMMIT = "3a515ba";

const VARIANTS = {
    full: "src",
    noAC: "src (Without Auto-Cards)"
};

const scripts = new Map();

function readSource(dir, file, commit) {
    const source = commit
        ? execFileSync("git", ["show", `${commit}:${dir}/${file}`], {
            cwd: ROOT,
            encoding: "utf8",
            maxBuffer: 64 * 1024 * 1024
        })
        : fs.readFileSync(path.join(ROOT, dir, file), "utf8");
    // The working tree may be checked out with CRLF; AI Dungeon receives pasted LF text
    return source.replace(/\r\n/g, "\n");
}

// adventureScript sets ADVENTURE_SCRIPT to true, the way the Adventure Script upload is configured
function getScript(variant, file, commit, adventureScript = false) {
    const key = [variant, file, commit || "fork", adventureScript].join("|");
    if (!scripts.has(key)) {
        let source = readSource(VARIANTS[variant], file, commit);
        if (adventureScript) {
            source = source.replace(/(?<=ADVENTURE_SCRIPT: )false/g, "true");
        }
        scripts.set(key, new vm.Script(source, { filename: `${commit || "fork"}/${VARIANTS[variant]}/${file}` }));
    }
    return scripts.get(key);
}

class Adventure {
    // refusePins makes every story card ignore isPinned = true, as AI Dungeon's unstated host limits may
    constructor({ variant = "full", stock = false, adventureScript = false, refusePins = false } = {}) {
        this.variant = variant;
        this.commit = stock ? STOCK_COMMIT : null;
        this.adventureScript = adventureScript;
        this.refusePins = refusePins;
        this.state = {};
        this.storyCards = [];
        this.history = [];
        this.actionCount = 0;
        this.nextCardId = 1;
    }

    addStoryCard(keys = "", entry = "", type = "", title = keys, description = "") {
        const card = { id: String(this.nextCardId++), keys, entry, type, title, description, isPinned: false };
        if (this.refusePins) {
            Object.defineProperty(card, "isPinned", { get: () => false, set: () => {}, enumerable: true });
        }
        this.storyCards.push(card);
        return this.storyCards.length;
    }

    // Run one hook tab. `code` replaces the tab's own source when a test needs to call LoLa's APIs directly.
    run(hook, text, { info = {}, code = null } = {}) {
        const context = vm.createContext({
            state: this.state,
            storyCards: this.storyCards,
            history: this.history,
            info: Object.assign({ actionCount: this.actionCount }, info),
            text,
            addStoryCard: (...args) => this.addStoryCard(...args),
            removeStoryCard: (index) => {
                if ((0 <= index) && (index < this.storyCards.length)) {
                    this.storyCards.splice(index, 1);
                }
            },
            updateStoryCard: (index, keys = "", entry = "", type = "", title = keys, description = "") => {
                if ((0 <= index) && (index < this.storyCards.length)) {
                    Object.assign(this.storyCards[index], { keys, entry, type, title, description });
                }
            },
            log: () => {},
            console
        });
        getScript(this.variant, "library.js", this.commit, this.adventureScript).runInContext(context);
        const hookScript = code === null
            ? getScript(this.variant, `${hook}.js`, this.commit, this.adventureScript)
            : new vm.Script(code);
        const result = hookScript.runInContext(context);
        // history may have been reassigned by the library's own validation
        this.history = context.history;
        return result;
    }

    input(text, options) {
        return this.run("input", text, options);
    }

    // Returns the context text the model would receive
    context(text, { optimized = false, maxChars = 16000 } = {}) {
        return this.run("context", text, { info: { maxChars, useCacheEfficient: optimized } }).text;
    }

    output(text, { optimized = false } = {}) {
        return this.run("output", text, { info: { useCacheEfficient: optimized } });
    }

    // Advance to a mid-adventure turn so isOpening() is false
    skipOpening() {
        this.history.push(
            { text: "The gates creak open.", type: "story" },
            { text: " The steward waits in the courtyard, lantern raised.", type: "continue" }
        );
        this.actionCount = 10;
        return this;
    }
}

// The pieces AI Dungeon assembles into a context, in its order
function buildContext({ lastAction = "\n> You greet the steward.\n", authorsNote = true, story = null, tail = "" } = {}) {
    const recent = story ?? "The gates creak open. The steward waits in the courtyard, lantern raised.";
    return [
        "You are Kael, a wandering knight.",
        "World Lore:\nThe Silver Keep stands above the valley.",
        "Story Summary:\nKael arrived at the keep.",
        "Memories:\nKael met the steward.",
        "Recent Story:\n" + recent
    ].join("\n\n") + (authorsNote ? "\n[Author's note: Dark fantasy, second person.]" : "") + lastAction + tail;
}

module.exports = { Adventure, buildContext, VARIANTS, STOCK_COMMIT };
