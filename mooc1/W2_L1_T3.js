// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//            Standard Start Code
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var starter_path = "W2_L1_T3_Starter.xml";
// The id is to act as a course identifier.
// NOTE: FOR NOW YOU ALSO HAVE TO ADD THE ID TO THE BOTTOM OF THE PAGE.
var courseID = "BJC.4x";  // e.g. "BJCx"
// Specify a prerequisite task id, should be null if no such requirement.
var preReqTaskID = null;
var preReqID = courseID + preReqTaskID;
// taskID uniquely identifies the task for saving in browser sessionStorage.
var taskID = "_W2_L1_T3"; //this should follow the name of the nomenclature document
var id = courseID + taskID;
var isEDX = isEDXurl();
// if this question is not meant to be graded, change this flag to false
var graded = true;
// to hide feedback for this problem, set this to false
var showFeedback = true;
// to allow ability to regrade certain tests, set this to true
var regradeOn = true;


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//           Actual Autograder Code
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function AGTest(outputLog) {
    var fb = new FeedbackLog(
            world,
            id,
            "Sentence Creations" //Name of the particular task you are creating.
            );

    //Standard code to find the SpriteIndex (read documentation if you're unclear why you need this)
    // var spriteIndex;
    // var ide = world.children[0];
    // var sprites = ide.sprites.contents;
    // for (var i = 0; i < sprites.length; i++) {
    //     if (sprites[i].name === "NameOfSprite") {
    //         spriteIndex = i;
    //         break;
    //     }
    // }
    var simpleSentence = "simple sentence";

    var chunk_0 = fb.newChunk("Make the " + simpleSentence + " block.");

    var sentenceExists_0 = function () {
        return spriteContainsBlock(simpleSentence);
    }

    var containsJoinBlock_0 = function () {
        return customBlockContains(simpleSentence, "join %words") || 
        customBlockContains(simpleSentence, "join words %mult%txt");
    }
 
    // Add a first tip to that first test chunk
    var tip_0_1 = chunk_0.newTip("Make sure you name your block exactly " + simpleSentence + ".", 'Great job!');

    tip_0_1.newAssertTest(
        sentenceExists_0,
        "Testing if there is a " + simpleSentence + " block in the scripting area.",
        "There is a " + simpleSentence + " block in the scripting area.",
        "Make sure you name your block exactly " + simpleSentence + " and place it in the scripting area.",
        1);

    var tip_0_2 = chunk_0.newTip('Try using a join block.',
        'Great job!');

    tip_0_2.newAssertTest(
        containsJoinBlock_0,
        "Testing if there is a join block in the custom block.",
        "There is a join block in the " + simpleSentence + " block.",
        "Make sure there is a join block in the " + simpleSentence + " block.",
        1);

    const nounPhrase = "noun phrase";

    var chunk_1 = fb.newChunk('Make the ' + nounPhrase + ' block.');

    var nounPhraseExists_1 = function () {
        return spriteContainsBlock(nounPhrase);
    }

    var containsPickAnyFromNouns_1 = function () {
        return customBlockContains(nounPhrase, "item %idx of %l", ["random","nouns"])
    }


            // Add a first tip to that first test chunk
    var tip_1_1 = chunk_1.newTip('Make sure you name your block exactly ' + nounPhrase + '.',
        'Great job!');

    tip_1_1.newAssertTest(
        nounPhraseExists_1,
        "Testing if there is a " + nounPhrase + " block in the scripting area.",
        "There is a " + nounPhrase + " block in the scripting area.",
        "Make sure you name your block exactly " + nounPhrase + " and place it in the scripting area.",
        1);

    var tip_1_2 = chunk_1.newTip('Try using an "item (random) of (nouns)" block.',
        'Great job!');

    tip_1_2.newAssertTest(
        containsPickAnyFromNouns_1,
        "Testing if there is an item (random) of (nouns) block in the " + nounPhrase + " block.",
        "There is a item (random) of (nouns) in the " + nounPhrase + " block.",
        "Make sure there is a item (random) of (nouns) in the " + nounPhrase + " block.",
        1);

        /* Create chunk_2 for the exercise 2 : prepositionalPhrase */
    const prepositionalPhrase = "prepositional phrase";

    var chunk_2 = fb.newChunk('Make the ' + prepositionalPhrase + ' block.');

    var prepPhraseExists_2 = function () {
        return spriteContainsBlock(prepositionalPhrase);
    }

    var containsPickAnyFromPrepositionals_2 = function () {
        return customBlockContains(prepositionalPhrase, "item %idx of %l", ["random","prepositionals"]) ||
        customBlockContains(prepositionalPhrase, "item %idx of %l", ["random","prepositions"]);
    }


    // Add a first tip to that first test chunk
    var tip_2_1 = chunk_2.newTip("Make sure you name your block exactly " + prepositionalPhrase + ".",
        'Great job!');

    tip_2_1.newAssertTest(
        prepPhraseExists_2,
        "Testing if there is a " + prepositionalPhrase + " block in the scripting area.",
        "There is a " + prepositionalPhrase + " block in the scripting area.",
        "Make sure you name your block exactly " + prepositionalPhrase + " and place it in the scripting area.",
        1);

    var tip_2_2 = chunk_2.newTip('Try using an "item (random) of (prepositionals)" block.',
        'Great job!');

    tip_2_2.newAssertTest(
        containsPickAnyFromPrepositionals_2,
        "Testing if there is an item (random) of (prepositionals) block in the " + prepositionalPhrase + " block.",
        "There is a item (random) of (prepositionals) in the " + prepositionalPhrase + " block.",
        "Make sure there is a item (random) of (prepositionals) in the " + prepositionalPhrase + " block.",
        1);

    /* Create chunk_3 for the exercise 3 : verbPhrase */

    const verbPhrase = "verb phrase";

    var chunk_3 = fb.newChunk('Make the verb phrase block.');

    var verbPhraseExists_3 = function () {
        return spriteContainsBlock(verbPhrase);
    }

    var containsPickAnyFromVerbs_3 = function () {
        return customBlockContains(verbPhrase, "item %idx of %l", ["random","verbs"])
    }


    // Add a first tip to that first test chunk
    var tip_3_1 = chunk_3.newTip("Make sure you name your block exactly " + verbPhrase + ".",
        'Great job!');

    tip_3_1.newAssertTest(
        verbPhraseExists_3,
        "Testing if there is a " + verbPhrase + " block in the scripting area.",
        "There is a " + verbPhrase + " block in the scripting area.",
        "Make sure you name your block exactly " + verbPhrase + " and place it in the scripting area.",
        1);

    var tip_3_2 = chunk_3.newTip('Try using an "item (random) of (verbs)" block.',
        'Great job!');

    tip_3_2.newAssertTest(
        containsPickAnyFromVerbs_3,
        "Testing if there is an item (random) of (verbs) block in the " + verbPhrase + " block.",
        "There is a item (random) of (verbs) in the " + verbPhrase + " block.",
        "Make sure there is a item (random) of (verbs) in the " + verbPhrase + " block.",
        1);
    
    const complexSentence = "complex sentence";

    var chunk_4 = fb.newChunk('Make the sentence block.');

    var sentenceExists_4 = function () {
        return spriteContainsBlock(complexSentence);
    }

    var containsJoinBlock_4 = function () {
        return customBlockContains(complexSentence, "join %words") || 
        customBlockContains(complexSentence, "join words %mult%txt");
    }


    // Add a first tip to that first test chunk
    var tip_4_1 = chunk_4.newTip("Make sure you name your block exactly " + complexSentence + ".",
        'Great job!');

    tip_4_1.newAssertTest(
        sentenceExists_4,
        "Testing if there is a " + complexSentence + " block in the scripting area.",
        "There is a " + complexSentence + " block in the scripting area.",
        "Make sure you name your block exactly " + complexSentence + " and place it in the scripting area.",
        1);

    var tip_4_2 = chunk_4.newTip('Try using a join block.',
        'Great job!');

    tip_4_2.newAssertTest(
        containsJoinBlock_4,
        "Testing if there is a join block in the custom block.",
        "There is a join block in the " + complexSentence + " block.",
        "Make sure there is a join block in the " + complexSentence + " block.",
        1);


    return fb;

}
