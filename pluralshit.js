/*Create a "plural %" block that makes nouns plural*/
            var exists;
            var pluralExists = function pluralExists() {
                exists = findBlockInPalette("plural %");
                if (exists !== null) {
                    exists = true;
                } else {
                    exists = false;
                }
                return exists;
            }
            testAssert(outputLog, pluralExists,
                "There is a 'plural %' block.",
                "There is no 'plural %' block.",
                "Make sure you name your block exactly 'plural %'.");
            if (exists) {
                multiTestBlock(outputLog, 
                    "plural %",
                    ["day", "boss", "medicine", "box", "cat"],
                    ["days", "bosses", "medicines", "boxes", "cats"],
                    [-1, -1, -1, -1, -1],
                    [true, true, true, true, true],
                    1);
            }

            return outputLog;
        }