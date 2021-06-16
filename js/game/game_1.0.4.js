// ZIM - http://zimjs.com - Code Creativity!
// JavaScript Canvas Framework for General Interactive Media
// free to use - donations welcome of course! http://zimjs.com/donate

// ZIM GAME - see http://zimjs.com/code#libraries for examples

// ~~~~~~~~~~~~~~~~~~~~~~~~
// DESCRIPTION - coded in 2017 (c) Inventor Dan Zen http://danzen.com
// Helper code for making games on the HTML Canvas with JavaScript
// Zim already has a number of functions and classes that can help with games for example:
// well... just about everthing in ZIM ;-)  Okay, here are a list of common ones:
// hitTestPoint, hitTestReg, hitTestRect, hitTestCircle, hitTestGrid
// Sprite, Dynamo, Scroller, Accelerator, loadAssets and asset
// animate, move, Ticker, GamePad, MotionController
// Label, Button, Slider, Dial, Tabs, Pane, ColorPicker, Swipe, Swiper, Indicator
// scale, scaleTo, center, centerReg, addTo, removeFrom
// Circle, Rectangle, Triangle
// constrain, Damp, ProportionDamp

// The Game Module provides a LeaderBoard and a Meter for now with planned Shooter, etc.

// ~~~~~~~~~~~~~~~~~~~~~~~~
// DOCS

/*--
zim.LeaderBoard = function(data, title, width, height, corner, color, titleColor, colors, total, scoreWidth, scorePlaces, scoreZeros, spacing, arrows, borderColor, borderWidth, shadowColor, shadowBlur, reverse, allowZero, font, fontSize, nameShift, scoreShift)

LeaderBoard
zim class - extends a zim.Container which extends a createjs.Container

DESCRIPTION
Shows leaders in a game.  Allows player to enter initials if in top players as set by the total parameter (default 10)
For the data parameter you can set an ID for ZIM data storage - get the ID at http://zimjs.com/leaderboard/
Or you can set the data parameter to "localStorage" for device only or "manual" for data from a custom database
See the ZIM ZONG game example for putting a LeaderBoard in a zim.Pane http://zimjs.com/zong/

EXAMPLE
var lb = new zim.LeaderBoard({
    data:"E-MAILED CODE FROM http://zimjs.com/leaderboard/",
    corner:0,
    color:frame.dark
}).center();

// then to record a score at some point later:
lb.score(500);
END EXAMPLE

PARAMETERS supports DUO - parameters or single object with properties below

data - (default "localStorage") localStorage will let a user keep their high score on a computer
    set data to an ID that is provided at http://zimjs.com/leaderboard/ to use the free ZIM data service
    set data to an Array of score objects: [{player:"RAJ", score:20}, {player:"DAN", score:18}] for manual database usage
title - (default null) - set to a String to create a title above the board
width - (default 400) - the width of the board
height - (default 600) - the height of the board
corner - (default 20) - the rounded corner of the board - set to 0 for no corner
color - (default "white") - the backing color of the board
titleColor - (default "#222") - the title text color if a title is provided
colors - (default the object detailed below) - an object literal that sets the colors of the boxes and texts
    the object holds rank, name and score backing colors, font colors, and current colors for each
    whatever properties you provide will overwrite the default color - but you do not have to provide them all
    Note: that frame.darker is just a ZIM shortcut to #111111, etc. you can use any CSS style color like "green", etc.
    {
        rankColor: frame.darker,
        rankFontColor: frame.light,
        currentRankColor: frame.pink,
        currentRankFontColor: "white",

        nameColor: frame.lighter,
        nameFontColor: frame.darker,
        currentNameColor: "#f0d2e8",
        currentNameFontColor: frame.darker,

        scoreColor: frame.light,
        scoreFontColor: frame.darker,
        currentScoreColor: "#f0d2e8",
        currentScoreFontColor: frame.darker
    }
total - (default 10) the number of rows to show
scoreWidth - (default 300) the width of the score field (the whole grid will be scaled to fit inside the width and height)
scorePlaces - (default 6) the maximum number of digits expected
scoreZeros - (default false) set to true to fill in zeros up to the scorePlaces- ie. 00023
spacing - (default 10) the spacing between the fields (the whole grid will be scaled to fit inside the width and height)
arrows - (default false) set to true to show arrows above and below the name when the player enters their name
borderColor - (default null) the border color
borderWidth - (default null unless borderColor then default 2) the border thickness
shadowColor - (default rgba(0,0,0,.3)) the shadow color - set to -1 for no shadow
shadowBlur - (default 14) set to 0 for no shadow
reverse - (default false) put smallest score at top
allowZero - (default false) allow a zero score - good for when reverse is set
font - (default courier) the font for the store name and score
fontSize - (default 60) the font size
nameShift - (default 0) vertical shift for the name if the font is off center
scoreShift - (default 0) vertical shift for the score if the font is off center


METHODS
score(score) - set a score - will allow user to enter initials
save() - this method is automatically done by save button when initials are filled in
cancel() - this method is automatically called when the user presses off the board without saving
startTime() - start timing the game - if a points per minute was provided during ZIM LeaderBoard setup (not for localStorage or manual)
stopTime() - stop timing the game - if a points per minute was provided during ZIM LeaderBoard setup (not for localStorage or manual)
redraw(newData, newWinner) - this method is automatically done at various points to redraw the grid with new data
    newData is in an array with score objects like so: [{player:"RAJ", score:20}, {player:"DAN", score:18}]
    newWinner is an optional index of the winner - who will then be able to enter their id
    leave out the newWinner to show the board with current scores set (no blanks for entering name)
dispose() - remove event listeners - you need to remove the LeaderBoard from the stage

NOTE: if you are using manual data then you can use any of these methods manually
NOTE: the leaderBoard extends a zim.Container so also has all container methods

PROPERTIES
winner - the index of the current winner if there is one (name getting entered) otherwise null
place - the index of the player's score even if not on the LeaderBoard
backing - reference to the zim.Rectangle used for the backing
filled - true if the winner name is filled in with three characters else false
grid - reference to the zim.Container used for the grid
    the grid has row containers and each row has a rank stepper, three name steppers and a score Label
    access these with:
    var score2 = grid.getChildAt(1).getChildAt(4);
    or to loop through all:
    zim.loop(grid, function(row, i) {
        var rank = row.getChildAt(0);
        var name1 = row.getChildAt(1);
        var name2 = row.getChildAt(2);
        var name3 = row.getChildAt(3);
        var score = row.getChildAt(4);
    });
titleText - reference to the zim.Label used for the title if the title parameter is provided
dataSource - get the of data used as a string: database (using an ID), localStorage or manual (custom)
    NOTE: if there is a problem with your data ID then this will revert from database to localStorage
    You can tell when you save a score / name the save button says LOCAL if localStorage and SENT if database or manual
key - the ID (from http://zimjs.com/leaderboard/) if provided

NOTE: the leaderBoard extends a zim.Container so also has all container properties

EVENTS
dispatches a change event for each time the name letters are changed changed
dispatches a press event for when the save button is pressed
dispatches a save event for when the data is saved in localStorage or database (key) mode but not manual mode
dispatches an error event if data connection is not made properly
dispatches a cancel event when a new score is requested before an older score is saved

*/

/*--
zim.Meter = function(stage, vertical, horizontal, color, textColor, padding, decimals, alpha, skew) {

Meter
zim class - extends a zim.Label

DESCRIPTION
A meter that shows measured FPS in a text label

EXAMPLE
var meter = new zim.Meter(stage, "top", "left"); // adds to stage at top left - default bottom left
END EXAMPLE

PARAMETERS supports DUO - parameters or single object with properties below

stage - the stage
vertical (default "bottom") set to "top" for top - no middle
horizontal (default "left") set to "right" for right - no middle
color (default frame.green) color of backing
textColor (default "black") color of text
padding (default 20) the distance from Meter to edge
decimals (default 0) the number of decimals to show
alpha (default .6) the alpha of the Meter
skew (default 10) the skewX of the Meter

METHODS
dispose()

PROPERTIES
text - the text of the meter
position(vertical, horizontal) - reset the position

Plus all the methods and properties of a Label
*/

var zim = function(zim) {

    zim.LeaderBoard = function(data, title, width, height, corner, color, titleColor, colors, total, scoreWidth, scorePlaces, scoreZeros, spacing, arrows, borderColor, borderWidth, shadowColor, shadowBlur, reverse, allowZero, font, fontSize, nameShift, scoreShift) {
        var duo; if (duo = zob(zim.LeaderBoard, arguments, null, this)) return duo;

        if (zot(data)) data = "localStorage";
        if (zot(width)) width = 400;
        if (zot(height)) height = 600;
        this.super_constructor(width, height);
        if (zot(corner)) corner = 20;
        if (zot(color)) color = "white";
        if (zot(titleColor)) titleColor = "#222";
        if (zot(total)) total = 10;
        if (zot(scoreWidth)) scoreWidth = 300;
        if (zot(scorePlaces)) scorePlaces = 6;
        if (zot(scoreZeros)) scoreZeros = false;
        if (zot(spacing)) spacing = 10;
        if (zot(arrows)) arrows = false;
        if (!zot(borderColor) && zot(borderWidth)) borderWidth = 2;
        if (zot(shadowColor)) shadowColor="rgba(0,0,0,.3)";
		if (zot(shadowBlur)) shadowBlur=14;
        if (zot(reverse)) reverse=false;
        if (zot(allowZero)) allowZero=false;
        if (zot(font)) font = "courier";
        if (zot(fontSize)) fontSize = 60;
        if (zot(nameShift)) nameShift = 0;
        if (zot(scoreShift)) scoreShift = 0;

        var backing = this.backing = new zim.Rectangle(width, height, color, borderColor, borderWidth, corner);
        backing.mouseEnabled = false;
        var backingEvent = backing.on("click", function(){});
        backing.off("click", backingEvent);
        this.addChild(backing);
        this.filled = false;
        this.info = {reverse:reverse, total:total, allowZero:allowZero, type:gameSaved}; // ES6 to fix
        if (shadowColor != -1 && shadowBlur > 0) backing.shadow = new createjs.Shadow(shadowColor, 3, 3, shadowBlur);

        var grid = this.grid = new zim.Container();
        var row;
        var stepper;
        var rank;
        var score;
        var that = this;

        var c = {
            rankColor: frame.darker,
            rankFontColor: frame.light,
            currentRankColor: frame.pink,
            currentRankFontColor: "white",

            nameColor: frame.lighter,
            nameFontColor: frame.darker,
            currentNameColor: "#f0d2e8",
            currentNameFontColor: frame.darker,

            scoreColor: frame.light,
            scoreFontColor: frame.darker,
            currentScoreColor: "#f0d2e8",
            currentScoreFontColor: frame.darker
        }
        var c = zim.merge(c, colors);

        var fakeText = zim.decimals(8,-scorePlaces,true); // force text to 000008 to start
        var winSteppers;
        var gameSaved;
        var button;
        var winRow;

        if (data == "localStorage") {
            initLocalStorage();
        } else if (!Array.isArray(data)) { // data is a key to get the data from the ZIM Game Database
            that.dataSource = "database";
            that.key = data;
            zim.async("https://zimjs.com/gamedata.php?id="+data, gameData);
        	function gameData(d){
                if (d == "error") {
                    var e = new createjs.Event("error");
                    e.type = "data";
                    that.dispatchEvent(e);
                    initLocalStorage(); // drop to localStorage
                    return;
                }
                if (d == "noscores") {
                    d = [];
                }
                data=d;
                makeGrid();
            }

        } else {
            that.dataSource = "custom";
            makeGrid();
        }

        function initLocalStorage() {
            // localStorage.clear();
            that.dataSource = "localStorage";
            if (localStorage && localStorage.gameData) {
                data = JSON.parse(localStorage.gameData);
            } else {
                data = [];
            }
            makeGrid();
        }

        var keydownEvent;

        function makeGrid() {
            scaleStart = that.scaleX;
            that.sca(1);
            that.filled = false;
            frame.off("keydown", keydownEvent);
            if (!zot(title)) {
                var titleText = that.titleText = new zim.Label({
                    text:title,
                    size:fontSize,
                    color:titleColor,
                    align:"center",
                    font:font
                }).addTo(grid);
                titleText.pos(titleText.width/2);
                titleText.mouseEnabled = false;
            }

            var winCheck;
            if (!zot(that.winner)) winSteppers = [];
            backing.mouseEnabled = false;
            backing.off("click", backingEvent);
            for (var j=0; j<total; j++) {
                winCheck = j==that.winner;
                if (data[j]) {
                    p = data[j].player;
                    s = data[j].score;
                } else {
                    p = s = "   ";
                }
                row = new zim.Container();
                rank = new zim.Label({
                    text:(j+1),
                    size:50,
                    color:j==that.winner?c.currentRankFontColor:c.rankFontColor,
                    align:"center",
                    backing:new zim.Rectangle(100,100,winCheck?c.currentRankColor:c.rankColor),
                });
                rank.addTo(row);
                if (arrows && !zot(that.winner)) {
                    rank.mov(0,j>=that.winner?50:0)
                        .mov(0,j>that.winner?50:0)
                }
                for (var i=0; i<3; i++) {
                    stepper = new zim.Stepper({
            			list:winCheck?"ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-*_".split(""):p[i],
            			width:100,
            			continuous:true,
                        label:new zim.Label({text:"", font:font, color:j==that.winner?c.currentNameFontColor:c.nameFontColor, size:fontSize+4, align:"center"}),
                        color:winCheck?c.currentNameColor:c.nameColor,
                        vertical:false,
                        arrows:false,
            			arrows2:(winCheck&&arrows),
            			corner:0,
                        shadowBlur:0
            		});
                    if (winCheck) {
                        backing.mouseEnabled = true;
                        backing.on("click", backingEvent);
                        if (frame.tabOrder) frame.tabOrder.push(stepper);
                        winSteppers.push(stepper);
                        stepper.currentValue = "_";
                        stepper.on("change", function() {
                            var waitCheck = zim.loop(winSteppers, function(s) {
                                if (s.currentValue == "_") return true;
                            });
                            if (!waitCheck) {
                                that.filled = true;
                                winScore.text = "";
                                button.addTo(winRow);
                                if (that.stage) that.stage.update();
                            }
                            that.dispatchEvent("change");
                        });
                        if (i==0) stepper.keyFocus = true;
                    }
                    stepper.label.reg(0,-2-nameShift)
                    stepper.pos(rank.width + spacing + i*(stepper.width+spacing));
                    if (arrows && !zot(that.winner)) {
                        stepper.mov(0,j>=that.winner?50:0)
                            .mov(0,j>that.winner?50:0);
                    }
                    // stepper.enabled = winCheck;
                    row.addChild(stepper);

                    var scoreText = new zim.Label({
                        text:fakeText,
                        color:winCheck?c.currentScoreFontColor:c.scoreFontColor,
                        font:font,
                        size:fontSize+4,
                        align:"right",
                        backing:new zim.Rectangle(scoreWidth,100,winCheck?c.currentScoreColor:c.scoreColor)
                    });
                    scoreText.text = scoreZeros?zim.decimals(s, -scorePlaces, true):s;
                    scoreText.label.regY = -4 - scoreShift;
                    scoreText.label.skewX = 10;
                    row.addChild(scoreText);
                    scoreText.pos(rank.width + spacing + 3*(stepper.width+spacing));
                    if (arrows && !zot(that.winner)) {
                        scoreText.mov(0,j>=that.winner?50:0)
                            .mov(0,j>that.winner?50:0);
                    }
                }
                if (winCheck) {
                    winRow = row;
                    var winScore = scoreText;
                    button = that.button = new zim.Button({
                        label:new zim.Label({text:"SAVE", size:50, align:"center", color:c.currentRankFontColor, rollColor:c.currentRankColor}),
                        width:scoreText.width,
                        color:c.currentRankColor,
                        rollColor:c.currentRankFontColor,
                        height:100,
                        corner:0,
                        shadowBlur:0
                    }).pos(scoreText.x, scoreText.y);
                    if (frame.tabOrder) frame.tabOrder.push(button);
                    button.on("mousedown", that.submitScore);

                    keydownEvent = frame.on("keydown", function(e) {
                        if (!that.stage) return;
                        if (button.focus && e.keyCode == 13) { // enter key
                            submitScore();
                            e.preventDefault();
                        }
                    });
                }
                row.addTo(grid).pos(0, (zot(title)?0:(titleText.height + spacing*2)) + j*(100 + spacing));
                row.mouseChildren = winCheck;
                row.mouseEnabled = winCheck;

            }
            if (!zot(title)) titleText.center(grid).pos(null,0);
            grid.scaleTo(that, 95, 95)
                .center(that);
            that.sca(scaleStart);
        }

        this.submitScore = function() {
            button.text = that.dataSource=="localStorage"?"LOCAL":"SENT";
            winRow.mouseChildren = false;
            winRow.mouseEnbabled = false;
            that.stage.update();
            if (zot(data[that.winner])) data[that.winner] = {};
            data[that.winner].player = winSteppers[0].currentValue + winSteppers[1].currentValue + winSteppers[2].currentValue;
            var e = new createjs.Event("press");
            var player = e.player = data[that.winner].player;
            var score = e.score = data[that.winner].score;
            e.key = that.key;
            e.info = that.info;
            that.dispatchEvent(e);

            if (that.dataSource == "custom") return;
            if (zim.decimals(score, null, null, null, null, null, e)) that.save();
        }

        this.score = function(score) {
            if (!zot(that.pendingIndex)) that.cancel();
            var position = zim.loop(data, function(s, i) {
                if ((!reverse && s.score <= score) || (reverse && s.score >= score)) {
                    data.splice(i, 0, {player:"", score:score});
                    return i;
                }
            });
            if (zot(position) && (allowZero || score > 0) && (data.length == 0 || data.length < total)) {
                 data.push({player:"", score:score});
                 position = data.length-1;
            }
            if (!zot(position)) {
                that.pendingIndex = position;
                that.redraw(null, position);
            }
            return position;
        }

        this.save = function() {
            if (zot(that.pendingIndex))  return that;
            if (that.dataSource == "database") {
                var player = data[that.pendingIndex].player;
                var score = data[that.pendingIndex].score;
                zim.async("https://zimjs.com/gamedata.php?id="+that.key+"&player="+player+"&score="+score+"&reverse="+reverse+"&total="+total+"&allowZero="+allowZero, gameSaved);
            }
            if (that.dataSource == "localStorage") {
                that.pendingIndex = null;
                if (localStorage) localStorage.gameData = JSON.stringify(data);
                zim.timeout(500, function() {
                    button.text = "DONE";
                    if (that.stage) that.stage.update();
                });
                zim.timeout(1500, function() {that.redraw();});
            }
            return that;
        }

        function gameSaved(d){
            if (d == "error") {
                var e = new createjs.Event("error");
                e.type = "save";
                that.dispatchEvent(e);
                button.text = "ERROR";
                data.splice(that.pendingIndex, 1);
            } else {
                var e = new createjs.Event("save");
                e.data = data = d;
                that.dispatchEvent(e);
                button.text = "DONE";
            }
            that.pendingIndex = null;
            if (that.stage) that.stage.update();
            zim.timeout(1000, function() {that.redraw();});
        }

        this.startTime = function() {
            zim.async("https://zimjs.com/gamedata.php?id="+that.key+"&command=start", timeReply);
        }
        this.stopTime = function() {
            zim.async("https://zimjs.com/gamedata.php?id="+that.key+"&command=stop", timeReply);
        }
        function timeReply(data){};

        this.cancel = function() {
            if (zot(that.pendingIndex)) return that;
            data.splice(that.pendingIndex, 1);
            that.pendingIndex = null;
            that.redraw();
            var e = new createjs.Event("cancel");
            e.data = data;
            that.dispatchEvent(e);
            return that;
        }
        var scaleStart = that.scaleX;
        this.redraw = function(newData, newWinner) {
            if (newData) data = newData;
            scaleStart = that.scaleX;
            that.dispose();
            if (zot(newWinner)) {that.winner = null} else {that.winner = newWinner;}
            grid.removeAllChildren();
            makeGrid();
            if (that.stage) that.stage.update();
            return that;
        }

        this.dispose = function() {
            if (winSteppers) {
                var ind;
                zim.loop(winSteppers, function(s) {
                    if (frame.tabOrder) {
                        var ind = frame.tabOrder.indexOf(s);
                        if (ind > -1) frame.tabOrder.splice(ind, 1);
                    }
                    s.dispose();
                });
                if (frame.tabOrder) {
                    ind = frame.tabOrder.indexOf(button);
                    if (ind > -1) frame.tabOrder.splice(ind, 1);
                }
                if (button) button.dispose();
            }
        }
    }
    zim.extend(zim.LeaderBoard, zim.Container);


    zim.Meter = function(stage, vertical, horizontal, color, textColor, padding, decimals, alpha, skew) {
        var duo; if (duo = zob(zim.Meter, arguments, null, this)) return duo;

        if (zot(vertical)) vertical = "bottom";
        if (zot(horizontal)) horizontal = "left";
        if (zot(padding)) padding = 20;
        if (zot(decimals)) decimals = 0;
        if (zot(color)) color = "#acd241"; // frame.green
        if (zot(textColor)) textColor = "black"; // frame.green
        if (zot(alpha)) alpha = .6;
        if (zot(skew)) skew = 10;
        this.super_constructor("null", 30, null, textColor, null, null, null, "center", null, null, null, null, new zim.Rectangle(100,40,color));
        var that = this;
        var meterFunction;
        var initFunction;
        if (zot(stage)) {initFunction = that.on("added", init);} else {init();}
        var fps = new zim.Label({text:"FPS", size:18, color:textColor}).rot(-90).addTo(that).pos(82, 38).alp(.5)
        function init() {
            if (zot(stage)) stage = that.stage;
            if (zot(stage)) return;
            that.off("added", initFunction);
            stage.addChild(that);
            that.alpha = alpha;
            that.skewX = skew;
            that.x = horizontal=="left"?padding+skew/2:stage.getBounds().width-that.width-padding-skew/2;
            that.y = vertical=="top"?padding:stage.getBounds().height-that.height-padding;
            meterFunction = zim.Ticker.add(function() {
                that.text = zim.decimals(createjs.Ticker.getMeasuredFPS(), decimals, true);
                stage.update();
            }, stage);
        }
        this.position = function(v, h) {
            if (!zot(v)) vertical = v;
            if (!zot(h)) horizontal = h;
            that.x = horizontal=="left"?padding+skew/2:stage.getBounds().width-that.width-padding-skew/2;
            that.y = vertical=="top"?padding:stage.getBounds().height-that.height-padding;
        }
    }
    zim.extend(zim.Meter, zim.Label);

    return zim;
}(zim || {});
