/*
 * Riddle embed.js v3.22
 * Copyright Riddle Technologies AG.
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
            riddles: [],
            // enter or exit fullscreen
            toggleFullScreen: toggleFullScreen,
            isFullScreen: false
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

    var originalWidth;

    function toggleFullScreen(riddleId) {
        var iframeWrapper = document.querySelectorAll('[data-rid-id="' + riddleId + '"]');
        var iframe = iframeWrapper[0].getElementsByTagName("iframe")[0];
        var button = document.getElementById('riddleFullScreenButton-' + riddleId);
        var elem = document.body;

        if (originalWidth == undefined) {
            originalWidth = iframeWrapper[0].style['width'];
        }

        if (window.riddleAPI.isFullScreen == false) {
            requestFullScreen(elem, iframeWrapper[0], iframe, button);
        } else {
            exitFullScreen(iframeWrapper[0], iframe, button);
        }
    }

    function requestFullScreen(docElm, iframeWrapper, iframe, button) {
        var eventName = '';

        if (docElm.requestFullscreen) {
            docElm.requestFullscreen();
            eventName = 'fullscreenchange';

        } else if (docElm.msRequestFullscreen) {
            docElm.msRequestFullscreen();
            eventName = 'MSFullscreenChange';
        } else if (docElm.mozRequestFullScreen) {
            docElm.mozRequestFullScreen();
            eventName = 'mozfullscreenchange';
        } else if (docElm.webkitRequestFullScreen) {
            docElm.webkitRequestFullScreen();
            eventName = 'webkitfullscreenchange';
        }

        document.addEventListener(eventName, function() {
            fullscreenChange(iframeWrapper, iframe, button);
        });
    }

    function exitFullScreen(iframeWrapper, iframe, button) {
        var eventName = '';

        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }

        fullscreenChange(iframeWrapper, iframe, button);
    }

    function fullscreenChange(iframeWrapper, iframe, button) {
        if (document.fullscreenEnabled ||
            document.webkitIsFullScreen ||
            document.mozFullScreen ||
            document.msFullscreenElement) {

            iframeWrapper.style.position = 'fixed';
            iframeWrapper.style.width = '100%';
            iframeWrapper.style.top = '0';
            iframeWrapper.style.left = '0';
            iframeWrapper.style.background = "#fff";
            iframeWrapper.style.setProperty("height", "100%", "important");
            iframe.style.setProperty("height", "100%", "important");

            button.style.position = 'fixed';
            button.style.bottom = '20px';
            button.style.left = '48%';

            window.riddleAPI.isFullScreen = true;
        } else {
            iframeWrapper.style.position = 'static';
            iframeWrapper.style.top = '0';
            iframeWrapper.style.left = '0';
            iframeWrapper.style.width = originalWidth;
            iframeWrapper.style.setProperty("height", "auto");

            button.style.position = 'static';

            window.riddleAPI.isFullScreen = false;
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

        // send position data to riddle iframes
        sendPositionData();
    });

    function sendPositionData() {
        for (var i = 0; i < riddleAPI.riddles.length; i++) {
            var element = riddleAPI.riddles[i];
            var iframe = element.getElementsByTagName("iframe")[0];
            var iframeOffetTop = iframe.getBoundingClientRect().top + window.scrollY || window.pageYOffset;
            var viewtop = window.scrollY || window.pageYOffset;
            var viewbottom = viewtop + window.innerHeight;

            iframe.contentWindow.postMessage({
                iframeOffetTop: iframeOffetTop,
                viewtop: viewtop,
                viewbottom: viewbottom
            }, '*');
        }
    }

    function preventSiteJump() {
        var doc = document.documentElement;
        scrollPosition = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
    }

    function postQueryStringToRiddle(element) {
        var iframes = element.getElementsByTagName("iframe");

        iframes[0].contentWindow.postMessage({
            riddleQueryString: window.location.href.split('?')[1]
        }, '*');
    }

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
                if (!window.riddleAPI.isFullScreen) {
                    iframeStyle.setProperty("height", event.data.riddleHeight + "px", "important");
                }
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

                if (window.location.href.indexOf('?') != -1) {
                    postQueryStringToRiddle(element);
                }

                // send position data to riddle iframes
                sendPositionData();
            }

            if (event.data.riddleEvent && window.onRiddleEvent) {
                // notify riddle event
                window.onRiddleEvent(event.data.riddleEvent, iframe);
            }

            if (event.data.riddleEvent == "page-change" && element.getAttribute("data-auto-scroll") != "false") {
                // scroll to top of riddle
                var offset = 0;

                if (!isNaN(element.getAttribute("data-auto-scroll-offset"))) {
                    offset = element.getAttribute("data-auto-scroll-offset");
                }

                iframe.scrollIntoView(true);
                // add small offset
                window.scrollBy(0, -10 - offset);
                // send position data to riddle iframes
                sendPositionData();
            } else if (event.data.riddleEvent == "page-change" && element.getAttribute("data-auto-scroll") == "false") {
                preventSiteJump()
                // send position data to riddle iframes
                sendPositionData();
            }

            if (event.data.riddleEvent && event.data.riddleEvent.action == 'answer-poll' && element.getAttribute("data-auto-scroll") == "false") {
                preventSiteJump()
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
