define("ace/mode/nbcl_highlight_rules", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text_highlight_rules"], function(require, exports, module) {
    "use strict";

    var oop = require("../lib/oop");
    var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

    var NBCLHighlightRules = function() {
        this.$rules = {
            "start": [
                {
                    token: "comment.block",
                    regex: "#-",
                    next: "blockComment"
                },
                {
                    token: "comment.line",
                    regex: "#.*$"
                },
                {
                    token: ["keyword.declaration", "text", "entity.name.function"],
                    regex: "(fn)(\\s+)([a-z][a-zA-Z0-9_]*)\\b" 
                },
                {
                    token: ["keyword.declaration", "text", "entity.name.type"],
                    regex: "\\b(component)(\\s+)([A-Z][a-zA-Z0-9]*)\\b"
                },
                {
                    token: "keyword.control",
                    regex: "\\b(if|else|while|for|in|return|match)\\b"
                },
                {
                    token: "keyword.declaration",
                    regex: "\\b(fn|component|import|as|local|global|set|any)\\b"
                },
                {
                    token: "constant.language.boolean",
                    regex: "\\b(true|false)\\b"
                },
                {
                    token: "constant.language",
                    regex: "\\bnull\\b"
                },
                {
                    token: "support.type",
                    regex: "\\b(String|Int|Float|Bool|List|Map|Any)\\b"
                },
                {
                    token: "entity.name.tag", // Node Invocation
                    regex: "\\b[A-Z][a-zA-Z0-9]*\\b"
                },
                {
                    token: "entity.name.function", // Function call
                    regex: "([a-z_][a-zA-Z0-9_]*)(?=\\s*\\()"
                },
                {
                    token: "support.type.property-name", // Property or Map key
                    regex: "\\b[a-z_][a-zA-Z0-9_]*(?=\\s*[:=])"
                },
                {
                    token: "string",
                    regex: '"',
                    next: "qqstring"
                },
                {
                    token: "string",
                    regex: "'",
                    next: "qstring"
                },
                {
                    token: "constant.numeric", // float
                    regex: "-?\\b\\d+\\.\\d+\\b"
                },
                {
                    token: "constant.numeric", // integer
                    regex: "-?\\b\\d+\\b"
                },
                {
                    token: "keyword.operator",
                    regex: "=>|==|!=|<=|>=|&&|\\|\\||\\.\\.\\.(?:=)?|\\?\\.|[\\+\\-\\*/%<>!=\\.]|\\|(?!\\|)"
                }
            ],
            "blockComment": [
                { regex: "-#", token: "comment.block", next: "start" },
                { defaultToken: "comment.block" }
            ],
            "qqstring": [
                { token: "constant.character.escape", regex: "\\\\(?:[ntr\\\\\"'u]|u[0-9a-fA-F]{4})" },
                { token: "string", regex: '"', next: "start" },
                { defaultToken: "string" }
            ],
            "qstring": [
                { token: "constant.character.escape", regex: "\\\\(?:[ntr\\\\\"'u]|u[0-9a-fA-F]{4})" },
                { token: "string", regex: "'", next: "start" },
                { defaultToken: "string" }
            ]
        };
    };

    oop.inherits(NBCLHighlightRules, TextHighlightRules);
    exports.NBCLHighlightRules = NBCLHighlightRules;
});

define("ace/mode/nbcl", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text", "ace/mode/nbcl_highlight_rules"], function(require, exports, module) {
    "use strict";

    var oop = require("../lib/oop");
    var TextMode = require("./text").Mode;
    var NBCLHighlightRules = require("./nbcl_highlight_rules").NBCLHighlightRules;

    var Mode = function() {
        this.HighlightRules = NBCLHighlightRules;
    };
    oop.inherits(Mode, TextMode);

    (function() {
        this.$id = "ace/mode/nbcl";
    }).call(Mode.prototype);

    exports.Mode = Mode;
});