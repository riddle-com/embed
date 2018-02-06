/*
 * Riddle embed.js v3.18
 * Copyright Riddle, Inc.
 */
(function() {
    // check whether riddle API was initialised
    if (!window.riddleAPI) {
        initialise();
    } else if (document.readyState != "loading") {
        checkForNewRiddles();
    }

    function initialise() {
        // global API
        window.riddleAPI = {
            // initialise a specific riddle div
            init: initRiddle,
            // check for new riddles on page
            update: checkForNewRiddles,
            // list of initialised riddles
            riddles: []
        }
        // listen for resize events coming from riddles
        window.addEventListener("message", onWindowMessage, false);
        // check if DOM is loaded and ready to be manipulated
        if (document.readyState == "loading") {
            document.addEventListener("DOMContentLoaded", checkForNewRiddles);
        } else {
            checkForNewRiddles();
        }
    }

    function checkForNewRiddles() {
        // find un-initialised riddles currently on page
        var newRiddles = document.body.getElementsByClassName("riddle_target");

        while (newRiddles.length) {
            // initialise
            initRiddle(newRiddles[0]);
        }
    }

    function initRiddle(element) {
        // prevent future initialisation
        element.className = "riddle-target-initialised";
        // for riddle specific styling
        var riddleId = "data-riddle-" + riddleAPI.riddles.length;
        element.setAttribute(riddleId, "");

        try {
            if (element.nextSibling.nextSibling.innerText == 'Quiz Maker - powered by Riddle') {
                element.nextSibling.parentNode.removeChild(element.nextSibling.nextSibling);
            }
        } catch (e) {}

        // check whether we need to add iframe (legacy riddles don't have one)
        var iframes = element.getElementsByTagName("iframe");

        if (iframes.length == 0) {
            // retrieve Riddle URL (legacy embeds use data-game attribute)
            var url = element.getAttribute("data-url") || element.getAttribute("data-game");
            if (!url) {
                // invalid embed code
                return;
            }
            element.innerHTML +=
                '<iframe src="' + url + '"></iframe>';
        }

        var iframeStyle = iframes[0].style;
        iframeStyle.border = "none";
        iframeStyle.width = "100%";
        iframeStyle.position = "absolute";
        iframeStyle.opacity = 0;

        if (window.location.href.indexOf('?') != -1) {
            iframes[0].src = iframes[0].src + window.location.href.split('?')[1];
        }

        // check whether we can add a loader (legacy riddles already have them)
        var loader = element.getElementsByClassName("rid-load");

        if (loader.length == 0) {
            var colorFg = element.getAttribute("data-fg") || "#1486cd";
            var colorBg = element.getAttribute("data-bg") || "#fff";
            element.insertAdjacentHTML('beforeend',
                '<style>' +
                '[' + riddleId + '] .rid-load {' +
                'background: ' + colorBg + ';' +
                '}' +
                '[' + riddleId + '] .rid-load i {' +
                'background: ' + colorFg + ';' +
                '}' +
                '.rid-load {' +
                'border: 1px solid #cfcfcf!important;' +
                'padding-top: 56%;' +
                'border-radius: 5px;' +
                'position: relative;' +
                '}' +
                '.rid-load p {' +
                'position: absolute;' +
                'top: 50%;' +
                'left: 50%;' +
                'margin: -8px' +
                '}' +
                '.rid-load i {' +
                'position: absolute;' +
                'width: 16px;' +
                'height: 16px;' +
                'border-radius: 3px;' +
                'left: -25px;' +
                '-webkit-animation: 1s infinite rid-icon;' +
                'animation: 1s infinite rid-icon;' +
                '-webkit-transform: scale(.4) rotate(62deg);' +
                'transform: scale(.4) rotate(62deg);' +
                'opacity: 0;' +
                '}' +
                '.rid-load i+i {' +
                '-webkit-animation-delay: .17s;' +
                'animation-delay: .17s;' +
                'left: 0;' +
                '}' +
                '.rid-load i+i+i {' +
                '-webkit-animation-delay: .34s;' +
                'animation-delay: .34s;' +
                'left: 25px;' +
                '}' +
                '@-webkit-keyframes rid-icon {' +
                '50% {' +
                '   opacity: 1;' +
                '-webkit-transform: scale(1) rotate(62deg);' +
                '}' +
                '}' +
                '@keyframes rid-icon {' +
                '50% {' +
                'opacity: 1;' +
                'transform: scale(1) rotate(62deg);' +
                '}' +
                '}' +
                '</style>' +
                '<div class="rid-load"><p><i></i><i></i><i></i></p></div>'
            );
        }

        // store reference
        riddleAPI.riddles.push(element);
    }

    var scrollPosition = 0;
    document.addEventListener("scroll", function(e) {
        if (scrollPosition != 0) {
            window.scrollTo(0, scrollPosition);
            scrollPosition = 0;
        }
    });

    function onWindowMessage(event) {
        // number type required for height update
        if (typeof event.data != "object") {
            return;
        }

        // check whether the event originated from one of our riddles
        for (var i = 0; i < riddleAPI.riddles.length; i++) {
            var element = riddleAPI.riddles[i];
            var iframe = element.getElementsByTagName("iframe")[0];

            if (event.source != iframe.contentWindow) {
                // event didn't come from this iframe
                continue;
            }

            if (event.data.riddleHeight) {
                // update height
                var iframeStyle = iframe.style;
                iframeStyle.setProperty("height", event.data.riddleHeight + "px", "important");
                if (iframeStyle.opacity == 0) {
                    // this is the first size event coming from this riddle, show it
                    iframeStyle.opacity = 1;
                    iframeStyle.position = "static";
                    // remove placeholder content
                    var loadChild = riddleAPI.riddles[i].getElementsByClassName("rid-load");
                    while (loadChild.length > 0) {
                        loadChild[0].parentNode.removeChild(loadChild[0]);
                    }
                }

                if (window.parent != undefined) {
                    window.parent.postMessage({
                        riddleHeight: event.data.riddleHeight + 55,
                        riddleId: event.data.riddleId
                    }, '*');
                }
            }

            if (event.data.riddleEvent && window.onRiddleEvent) {
                // notify riddle event
                window.onRiddleEvent(event.data.riddleEvent, iframe);
            }

            if (event.data.riddleEvent == "page-change" && element.getAttribute("data-auto-scroll") != "false") {
                // scroll to top of riddle
                iframe.scrollIntoView(true);
                // add small offset
                window.scrollBy(0, -10);
            } else if (event.data.riddleEvent == "page-change" && element.getAttribute("data-auto-scroll") == "false") {
                var doc = document.documentElement;
                scrollPosition = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
            }

            if (event.data.redirectToCustomLandingpagePath != undefined &&
                event.data.redirectToCustomLandingpageData != undefined) {
                var path = event.data.redirectToCustomLandingpagePath;
                var data = event.data.redirectToCustomLandingpageData;

                var form = window.parent.document.createElement("form");
                form.setAttribute("method", "post");
                form.setAttribute("action", path);

                var hiddenField = window.parent.document.createElement("input");
                hiddenField.setAttribute("type", "hidden");
                hiddenField.setAttribute("name", "data");
                hiddenField.setAttribute("value", data);

                form.appendChild(hiddenField);

                window.parent.document.body.appendChild(form);

                form.submit();
            }
        }
    }
})();
