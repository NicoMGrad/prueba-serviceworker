// ZIM Foundation for Creative Coding icon
    function createIcon(frame, x, y, callback) {
        if (zot(x)) x = 580;
        if (zot(y)) y = 450;
        var iconLoad = frame.loadAssets("icon.png", "https://d309knd7es5f10.cloudfront.net/codepen/");
        iconLoad.on("complete", ()=>{
            const icon = frame.asset("icon.png");
            // make button - or add a mouseover and mouseout event to icon
            const button = new Button({
                label:"",
                backing:icon.alp(.5), // chainable short method to set alpha
                rollBacking:icon.clone().alp(.8)
            }).pos(x, y, frame.stage).alp(0).animate({alpha:1}, 700);
            button.on("click", ()=>{zgo("http://zimjs.com", "_blank")});
            if (callback) callback(button);
            frame.stage.update();
        });
    }

