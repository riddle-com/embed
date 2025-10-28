(function() {
  "use strict";
  var RiddleTrackNetworks = /* @__PURE__ */ ((RiddleTrackNetworks2) => {
    RiddleTrackNetworks2["customTracking"] = "customTracking";
    RiddleTrackNetworks2["facebookPixel"] = "facebookPixel";
    RiddleTrackNetworks2["googleAnalytics"] = "googleAnalytics";
    RiddleTrackNetworks2["googleAnalytics4"] = "googleAnalytics4";
    RiddleTrackNetworks2["googleTagManager"] = "googleTagManager";
    RiddleTrackNetworks2["matomoTag"] = "matomoTag";
    RiddleTrackNetworks2["adobe"] = "adobe";
    RiddleTrackNetworks2["customer"] = "customer";
    return RiddleTrackNetworks2;
  })(RiddleTrackNetworks || {});
  function AddLoader(riddle) {
    const baseStyles = `
        [${riddle.uuidAttr}] .rid-load {
            background: ${riddle.config.colorBackground};
        }
        [${riddle.uuidAttr}] .rid-load i {
            background: ${riddle.config.colorBackground};
        }
        [${riddle.uuidAttr}] .rid-load i:before {
            border-color: ${riddle.config.colorForeground};
        }
        .rid-load {
            padding-top: 56%;
            border-radius: 24px;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            transition: opacity ease-out 0.5s;
            box-sizing: border-box;
        }
        .rid-load p {
            position: absolute;
            top: 50%;
            left: 50%;
            margin: -8px;
        }
        .rid-load i {
            position: absolute;
            display: block;
            width: 20px;
            height: 20px;
            border-radius: 5px;
            left: -8px;
            animation: 3s infinite rid-icon;
            transform: scale(1) rotate(30deg);
        }
        .rid-load i:before {
            box-sizing: border-box;
            content: '';
            display: block;
            position: absolute;
            left: 2px;
            right: 2px;
            bottom: 2px;
            top: 2px;
            border: 2px solid;
            border-radius: 3px;
        }
        .rid-load i+i {
            left: 0;
            top: -4px;
            transform: scale(1) rotate(45deg);
        }
        .rid-load i+i+i {
            left: 8px;
            top: 0;
            transform: scale(1) rotate(60deg);
        }
        @keyframes rid-icon {
            40% {
                left:  0;
                top: 0;
                transform: scale(1) rotate(0);
            }
            60% {
                left:  0;
                top: 0;
                transform: scale(1) rotate(0);
            }
        }

        @keyframes largeCircleMove {
            0%, 25% {
                width: 20px;
                height: 20px;
                left: -3px;
                top: -3px;
            }
            75%, 100% {
                width: 14px;
                height: 14px;
                left: 0px;
                top: 0px;
            }
        }

        @keyframes largeCircleColor {
            0%, 25% {
                background-color: ${riddle.config.colorForeground};
            }
            45% {
                background-color: ${riddle.config.colorForeground};
            }
            75%, 100% {
                background-color: transparent;
            }
        }

        @keyframes smallCircleMove {
            0%, 25% {
                width: 0px;
                height: 0px;
                left: 7px;
                top: 7px;
                opacity: 0;
                background-color: ${riddle.config.colorForeground};
            }
            75%, 100% {
                width: 4px;
                height: 4px;
                left: 5px;
                top: 15px;
                opacity: 1;
                background-color: ${riddle.config.colorForeground};
            }
        }`;
    let styles = baseStyles;
    riddle.wrapper.insertAdjacentHTML(
      "beforeend",
      `<style>${styles}</style>
        <div class="rid-load${""}">
            <p><i></i><i></i><i></i></p>
        </div>`
    );
    riddle.wrapper.style.position = "relative";
    riddle.wrapper.style.overflow = "hidden";
    riddle.wrapper.style.transition = "height ease-out 0.5s";
    const loader = riddle.wrapper.getElementsByClassName("rid-load")[0];
    if (loader) {
      riddle.wrapper.style.height = loader.getBoundingClientRect().height + "px";
      loader.style.height = "100%";
    }
  }
  function RemoveLoader(riddle) {
    const loadChild = riddle.wrapper.getElementsByClassName("rid-load")[0];
    if (loadChild) {
      loadChild.style.opacity = "0";
      riddle.wrapper.style.height = riddle.iframe.getBoundingClientRect().height + "px";
      const interval = setInterval(() => {
        riddle.wrapper.style.height = riddle.iframe.getBoundingClientRect().height + "px";
      }, 10);
      setTimeout(() => {
        clearInterval(interval);
        riddle.wrapper.style.removeProperty("position");
        riddle.wrapper.style.removeProperty("overflow");
        riddle.wrapper.style.removeProperty("transition");
        riddle.wrapper.style.removeProperty("height");
        loadChild.parentNode?.removeChild(loadChild);
        riddle.wrapper.removeChild(riddle.wrapper.children[riddle.wrapper.children.length - 1]);
      }, 500);
    }
  }
  class Riddle2 {
    id;
    uuidAttr;
    hasLoaded;
    wrapper;
    iframe;
    _isInFrameDetected = false;
    _prevBodyOverflow = "";
    config;
    constructor(el) {
      el.classList.add("inited");
      this.id = el.getAttribute("data-rid-id") || "";
      this.uuidAttr = "data-riddle-v2-" + window.riddle2API.riddles.length;
      el.setAttribute(this.uuidAttr, "");
      this.hasLoaded = false;
      this.wrapper = el;
      this.iframe = el.getElementsByTagName("iframe")[0];
      this.config = {
        autoScroll: el.getAttribute("data-auto-scroll") !== "false",
        autoScrollOffset: isNaN(parseInt(el.getAttribute("data-auto-scroll-offset") || "")) ? 0 : parseInt(el.getAttribute("data-auto-scroll-offset") || ""),
        colorBackground: el.getAttribute("data-bg") || "#fff",
        colorForeground: el.getAttribute("data-fg") || "#00205b",
        isFixedHeightEnabled: el.getAttribute("data-is-fixed-height-enabled") === "true",
        fixedHeight: el.getAttribute("data-fixed-height") || "650px"
      };
      var iframeStyle = this.iframe.style;
      iframeStyle.border = "none";
      iframeStyle.width = "100%";
      iframeStyle.position = "absolute";
      iframeStyle.opacity = "0";
      AddLoader(this);
      this.sendMessage({
        isRiddleApi: true,
        type: "requestRiddleStatus"
      });
    }
    sendMessage(msg) {
      this.iframe.contentWindow?.postMessage(msg, "*");
    }
    InitComplete() {
      if (!this.hasLoaded) {
        this.hasLoaded = true;
        let iframeStyle = this.iframe.style;
        iframeStyle.opacity = "1";
        iframeStyle.position = "static";
        if (this.config.isFixedHeightEnabled) {
          iframeStyle.height = this.config.fixedHeight;
        }
        RemoveLoader(this);
      }
    }
    UpdateHeight(height) {
      this.iframe.style.setProperty("height", height + "px", "important");
      let inIframe = false;
      try {
        inIframe = window.self !== window.top;
      } catch (e) {
        inIframe = true;
      }
      if (inIframe) {
        if (height > document.documentElement.scrollHeight * 0.95 && height < document.documentElement.scrollHeight * 1.05 && window.riddle2API.riddles.length == 1) {
          if (!this._isInFrameDetected) {
            this._isInFrameDetected = true;
            this._prevBodyOverflow = document.body.style.overflow;
            document.body.style.overflow = "hidden";
          }
        } else {
          if (this._isInFrameDetected) {
            this._isInFrameDetected = false;
            document.body.style.overflow = this._prevBodyOverflow;
          }
        }
      }
    }
    LazyLoad(iframeOffsetTop, viewtop, viewbottom) {
      let dataEmbedUrl = this.wrapper.getAttribute("data-embed-url");
      if (iframeOffsetTop != void 0 && viewtop != void 0 && viewbottom != void 0 && dataEmbedUrl && this.iframe.src != dataEmbedUrl && !this.iframe.src.includes("riddle.com")) {
        var iframeOffsetBottom = iframeOffsetTop + this.wrapper.getBoundingClientRect().height;
        var iframeTopVisible = viewtop <= iframeOffsetTop && iframeOffsetTop <= viewbottom;
        var iframeBottomVisible = viewtop <= iframeOffsetBottom && iframeOffsetBottom <= viewbottom;
        if (iframeTopVisible || iframeBottomVisible) {
          this.iframe.src = dataEmbedUrl;
        }
      }
    }
    HideRiddle = () => {
      this.wrapper.style.display = "none";
    };
  }
  const validateDataLayerItem = (target, value) => {
    const validKeyTypes = ["string", "number"];
    let isValid = true;
    if (typeof value !== "object") {
      console.log("typeof DataLayerItem:", typeof value);
      console.log('DataLayerItem must be an object like: { key: "key", value: "value" || 0 }');
      isValid = false;
    }
    if (typeof value.key !== "string") {
      console.log("typeof DataLayerItem.key:", typeof value.key);
      console.log('DataLayerItem must have a "key"');
      isValid = false;
    }
    if (!validKeyTypes.includes(typeof value.value)) {
      console.log("typeof DataLayerItem.value:", typeof value.value);
      console.log('DataLayerItem must have a "value" of type: ' + validKeyTypes.join(" or "));
      isValid = false;
    }
    if (isValid) {
      target.push(value);
    }
    return isValid;
  };
  class DataLayer {
    constructor() {
      this.initDataLayer();
      this.readFromUrl();
    }
    initDataLayer() {
      let dataLayer = [];
      const windowRiddleDataLayer = window.riddleDataLayer;
      if (windowRiddleDataLayer) {
        let isValid = true;
        windowRiddleDataLayer.forEach((value) => {
          if (isValid) {
            isValid = validateDataLayerItem([], value);
          }
        });
        if (isValid) {
          dataLayer = JSON.parse(JSON.stringify(windowRiddleDataLayer));
        }
      }
      const itemHandler = {
        set: this.setHandler
      };
      window.riddleDataLayer = new Proxy(dataLayer, itemHandler);
    }
    readFromUrl() {
      const queryString = window.location.search;
      const urlSearchParams = new URLSearchParams(queryString);
      const params = Object.fromEntries(urlSearchParams.entries());
      for (const key in params) {
        if (Object.prototype.hasOwnProperty.call(params, key)) {
          const value = params[key];
          this.push({
            key,
            value
          });
        }
      }
    }
    readFromIframeSrc(iframeSrc) {
      if (!iframeSrc || typeof iframeSrc !== "string") {
        return;
      }
      const url = new URL(iframeSrc);
      const params = Object.fromEntries(url.searchParams.entries());
      for (const key in params) {
        if (Object.prototype.hasOwnProperty.call(params, key)) {
          const value = params[key];
          this.push({
            key,
            value
          });
        }
      }
    }
    push(item) {
      if (window.riddleDataLayer) {
        const index = window.riddleDataLayer.findIndex((i) => i.key === item.key);
        if (index === -1) {
          window.riddleDataLayer.push(item);
        } else {
          window.riddleDataLayer[index] = item;
        }
      }
    }
    notifyAll() {
      const that = this;
      window.riddle2API.riddles.forEach((riddle) => {
        that.notifyRiddle(riddle);
      });
    }
    notifyRiddle(riddle) {
      riddle.sendMessage({
        dataLayer: JSON.parse(JSON.stringify(window.riddleDataLayer)),
        riddleQueryString: window.location.href.split("?")[1],
        riddleParentLocation: window.location.href
      });
    }
    setHandler(target, p, value) {
      if (p === "length") {
        target[p] = value;
        return true;
      }
      const isValid = validateDataLayerItem(target, value);
      if (isValid) {
        window.riddle2API?.riddles.forEach((riddle) => {
          riddle.sendMessage({ dataLayerItem: value });
        });
      }
      return isValid;
    }
  }
  let dataLayerInstance = window.riddle2API?.dataLayer;
  if (!dataLayerInstance) {
    dataLayerInstance = new DataLayer();
  }
  Object.freeze(dataLayerInstance);
  const dataLayerInstance$1 = dataLayerInstance;
  var originalWidth;
  function toggleFullScreen(riddleId) {
    var iframeWrapper = document.querySelectorAll('[data-rid-id="' + riddleId + '"]');
    var iframe = iframeWrapper[0].getElementsByTagName("iframe")[0];
    var button = document.getElementById("riddleFullScreenButton-" + riddleId);
    var elem = document.body;
    if (originalWidth == void 0) {
      originalWidth = iframeWrapper[0].style["width"];
    }
    if (window.riddleAPI.isFullScreen == false) {
      requestFullScreen(elem, iframeWrapper[0], iframe, button);
    } else {
      exitFullScreen(iframeWrapper[0], iframe, button);
    }
  }
  function requestFullScreen(docElm, iframeWrapper, iframe, button) {
    var eventName = "";
    if (docElm.requestFullscreen) {
      docElm.requestFullscreen();
      eventName = "fullscreenchange";
    } else if (docElm.msRequestFullscreen) {
      docElm.msRequestFullscreen();
      eventName = "MSFullscreenChange";
    } else if (docElm.mozRequestFullScreen) {
      docElm.mozRequestFullScreen();
      eventName = "mozfullscreenchange";
    } else if (docElm.webkitRequestFullScreen) {
      docElm.webkitRequestFullScreen();
      eventName = "webkitfullscreenchange";
    }
    document.addEventListener(eventName, function() {
      fullscreenChange(iframeWrapper, iframe, button);
    });
  }
  function exitFullScreen(iframeWrapper, iframe, button) {
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
    if (document.fullscreenEnabled || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement) {
      iframeWrapper.style.position = "fixed";
      iframeWrapper.style.width = "100%";
      iframeWrapper.style.top = "0";
      iframeWrapper.style.left = "0";
      iframeWrapper.style.background = "#fff";
      iframeWrapper.style.setProperty("height", "100%", "important");
      iframe.style.setProperty("height", "100%", "important");
      button.style.position = "fixed";
      button.style.bottom = "20px";
      button.style.left = "48%";
      window.riddleAPI.isFullScreen = true;
    } else {
      iframeWrapper.style.position = "static";
      iframeWrapper.style.top = "0";
      iframeWrapper.style.left = "0";
      iframeWrapper.style.width = originalWidth;
      iframeWrapper.style.setProperty("height", "auto");
      button.style.position = "static";
      window.riddleAPI.isFullScreen = false;
    }
  }
  var scrollPosition$1 = 0;
  document.addEventListener("scroll", function(e) {
    if (scrollPosition$1 != 0) {
      window.scrollTo(0, scrollPosition$1);
      scrollPosition$1 = 0;
    }
    sendPositionData();
  });
  function sendPositionData() {
    for (var i = 0; i < window.riddleAPI.riddles.length; i++) {
      var element = window.riddleAPI.riddles[i];
      var iframe = element.getElementsByTagName("iframe")[0];
      var iframeOffetTop = iframe.getBoundingClientRect().top + window.scrollY || window.pageYOffset;
      var viewtop = window.scrollY || window.pageYOffset;
      var viewbottom = viewtop + window.innerHeight;
      iframe.contentWindow.postMessage(
        {
          iframeOffetTop,
          viewtop,
          viewbottom
        },
        "*"
      );
      checkIframe(iframeOffetTop, viewtop, viewbottom, iframe);
    }
  }
  function checkIframe(iframeOffsetTop, viewtop, viewbottom, iframe) {
    if (iframeOffsetTop != void 0 && viewtop != void 0 && viewbottom != void 0 && iframe.src != iframe.parentElement?.getAttribute("data-embed-url") && iframe.src.indexOf("riddle.com") == -1) {
      var iframeOffsetBottom = iframeOffsetTop + (iframe.parentElement?.getBoundingClientRect().height ?? 0);
      var iframeTopIsVisible = viewtop <= iframeOffsetTop && iframeOffsetTop <= viewbottom;
      var iframeBottomIsVisible = viewtop <= iframeOffsetBottom && iframeOffsetBottom <= viewbottom;
      if (iframeTopIsVisible || iframeBottomIsVisible) {
        iframe.src = iframe.parentElement?.getAttribute("data-embed-url") ?? "";
      }
    }
  }
  function setScrollPosition(position) {
    scrollPosition$1 = position;
  }
  function onWindowMessage$1(event) {
    if (typeof event.data != "object") {
      return;
    }
    if (event.data.isRiddle2Event) {
      for (var i = 0; i < window.riddleAPI.riddles.length; i++) {
        var element = window.riddleAPI.riddles[i];
        var iframe = element.getElementsByTagName("iframe")[0];
        if (event.source === iframe.contentWindow) {
          window.riddle2API.initRiddle(element);
          break;
        }
      }
    }
    for (var i = 0; i < window.riddleAPI.riddles.length; i++) {
      var element = window.riddleAPI.riddles[i];
      var iframe = element.getElementsByTagName("iframe")[0];
      if (event.source != iframe.contentWindow) {
        continue;
      }
      if (event.data.riddleHeight) {
        var iframeStyle = iframe.style;
        if (!window.riddleAPI.isFullScreen) {
          iframeStyle.setProperty("height", event.data.riddleHeight + "px", "important");
        }
        if (iframeStyle.opacity == 0) {
          iframeStyle.opacity = 1;
          iframeStyle.position = "static";
          var loadChild = window.riddleAPI.riddles[i].getElementsByClassName("rid-load");
          while (loadChild.length > 0) {
            loadChild[0].parentNode.removeChild(loadChild[0]);
          }
        }
        if (window.parent != void 0) {
          window.parent.postMessage(
            {
              riddleHeight: event.data.riddleHeight + 55,
              riddleId: event.data.riddleId
            },
            "*"
          );
        }
        if (window.location.href.indexOf("?") != -1) {
          postQueryStringToRiddle(element);
        }
        postLocationHrefToRiddle(element);
        sendPositionData();
      }
      if (event.data.riddleEvent && window.onRiddleEvent) {
        window.onRiddleEvent(event.data.riddleEvent, iframe);
      }
      if (event.data.riddleEvent == "page-change" && element.getAttribute("data-auto-scroll") != "false" && !event.data.isUnrolledQuiz) {
        var offset = 0;
        if (!isNaN(element.getAttribute("data-auto-scroll-offset"))) {
          offset = element.getAttribute("data-auto-scroll-offset");
        }
        iframe.scrollIntoView(true);
        window.scrollBy(0, -10 - offset);
        sendPositionData();
      } else if (event.data.riddleEvent == "page-change" && element.getAttribute("data-auto-scroll") == "false") {
        preventSiteJump$1();
        sendPositionData();
      }
      if (event.data.riddleEvent && event.data.riddleEvent.action == "answer-poll" && element.getAttribute("data-auto-scroll") == "false") {
        preventSiteJump$1();
      }
      if (event.data.redirectToCustomLandingpagePath != void 0 && event.data.redirectToCustomLandingpageData != void 0) {
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
  function preventSiteJump$1() {
    var doc = document.documentElement;
    setScrollPosition((window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0));
  }
  function postQueryStringToRiddle(element) {
    var iframes = element.getElementsByTagName("iframe");
    iframes[0].contentWindow.postMessage(
      {
        riddleQueryString: window.location.href.split("?")[1]
      },
      "*"
    );
  }
  function postLocationHrefToRiddle(element) {
    var iframes = element.getElementsByTagName("iframe");
    iframes[0].contentWindow.postMessage(
      {
        riddleParentLocation: window.location.href
      },
      "*"
    );
  }
  if (!window.riddleAPI) {
    init();
  }
  const riddleV1API = window.riddleAPI;
  function init() {
    window.riddleAPI = {
      // initialise a specific riddle div
      init: initRiddle$1,
      // check for new riddles on page (deprecated - handled by main.ts)
      update: () => {
      },
      // no-op since main.ts handles the interval
      // list of initialised riddles
      riddles: [],
      // enter or exit fullscreen
      toggleFullScreen,
      isFullScreen: false
    };
    window.addEventListener("message", onWindowMessage$1, false);
  }
  function initRiddle$1(element) {
    if (!element.classList.contains("riddle-target-initialised")) {
      element.className = "riddle-target-initialised";
      var riddleId = "data-riddle-" + window.riddleAPI.riddles.length;
      element.setAttribute(riddleId, "");
      var iframes = element.getElementsByTagName("iframe");
      if (iframes.length == 0) {
        var url = element.getAttribute("data-url") || element.getAttribute("data-game");
        if (!url) {
          return;
        }
        element.innerHTML += '<iframe src="' + url + '"></iframe>';
      }
      var iframeStyle = iframes[0].style;
      iframeStyle.border = "none";
      iframeStyle.width = "100%";
      iframeStyle.position = "absolute";
      iframeStyle.opacity = "0";
      var loader = element.getElementsByClassName("rid-load");
      if (loader.length == 0) {
        var colorFg = element.getAttribute("data-fg") || "#1486cd";
        var colorBg = element.getAttribute("data-bg") || "#fff";
        element.insertAdjacentHTML(
          "beforeend",
          "<style>[" + riddleId + "] .rid-load {background: " + colorBg + ";}[" + riddleId + "] .rid-load i {background: " + colorFg + ';}.rid-load {border: 1px solid #cfcfcf!important;padding-top: 56%;border-radius: 5px;position: relative;}.rid-load p {position: absolute;top: 50%;left: 50%;margin: -8px}.rid-load i {position: absolute;width: 16px;height: 16px;border-radius: 3px;left: -25px;-webkit-animation: 1s infinite rid-icon;animation: 1s infinite rid-icon;-webkit-transform: scale(.4) rotate(62deg);transform: scale(.4) rotate(62deg);opacity: 0;}.rid-load i+i {-webkit-animation-delay: .17s;animation-delay: .17s;left: 0;}.rid-load i+i+i {-webkit-animation-delay: .34s;animation-delay: .34s;left: 25px;}@-webkit-keyframes rid-icon {50% {   opacity: 1;-webkit-transform: scale(1) rotate(62deg);}}@keyframes rid-icon {50% {opacity: 1;transform: scale(1) rotate(62deg);}}</style><div class="rid-load"><p><i></i><i></i><i></i></p></div>'
        );
      }
      window.riddleAPI.riddles.push(element);
      sendPositionData();
    }
  }
  class RiddleStorage {
    riddleStorage = [];
    isLocalStorageAvailable = false;
    isLocalStorageFull = false;
    constructor() {
      this.ensureLocalStorage();
      this.initRiddleStorage();
    }
    ensureLocalStorage() {
      try {
        if (typeof window.localStorage !== "undefined") {
          try {
            const testKey = "__storage_test__";
            window.localStorage.setItem(testKey, "test");
            window.localStorage.removeItem(testKey);
            this.isLocalStorageAvailable = true;
          } catch (e) {
            this.isLocalStorageAvailable = false;
            this.handleStorageError(e);
          }
        }
      } catch (error) {
        this.isLocalStorageAvailable = false;
      }
    }
    handleStorageError(e) {
      if (e instanceof DOMException && e.name === "QuotaExceededError" && // acknowledge QuotaExceededError only if there's something already stored
      // https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API#feature-detecting_localstorage
      window.localStorage && window.localStorage.length !== 0) {
        this.isLocalStorageFull = true;
        this.isLocalStorageAvailable = true;
      }
    }
    initRiddleStorage() {
      if (!this.isLocalStorageAvailable) {
        return;
      }
      const windowRiddleStorage = this.decryptValue(window.localStorage.getItem("riddleStorage"));
      if (windowRiddleStorage) {
        const riddleStorage = JSON.parse(windowRiddleStorage);
        if (Array.isArray(riddleStorage)) {
          this.riddleStorage = riddleStorage;
        }
      }
    }
    // Make the value for localStorage unreadable by human
    encryptValue(value) {
      return btoa(value.toString());
    }
    // Make the value for localStorage readable by human
    decryptValue(value) {
      if (!value) {
        return "";
      }
      return atob(value.toString());
    }
    setItem(key, value) {
      if (!this.isLocalStorageAvailable || this.isLocalStorageFull) {
        return;
      }
      const itemIndex = this.riddleStorage.findIndex((item) => item.key === key);
      if (itemIndex !== -1) {
        this.riddleStorage[itemIndex].value = value;
      } else {
        this.riddleStorage.push({ key, value });
      }
      try {
        window.localStorage.setItem(
          "riddleStorage",
          this.encryptValue(JSON.stringify(this.riddleStorage))
        );
      } catch (e) {
        this.handleStorageError(e);
      }
    }
    getItem(key) {
      const item = this.riddleStorage.find((item2) => item2.key === key);
      return item ? item.value : null;
    }
    deleteItem(riddleStorageItems) {
      if (!this.isLocalStorageAvailable) {
        return;
      }
      riddleStorageItems.forEach((riddleStorageItem) => {
        const itemIndex = this.riddleStorage.findIndex(
          (item) => item.key === riddleStorageItem.key
        );
        if (itemIndex !== -1) {
          this.riddleStorage.splice(itemIndex, 1);
        }
      });
      window.localStorage.setItem(
        "riddleStorage",
        this.encryptValue(JSON.stringify(this.riddleStorage))
      );
    }
    getRiddleStorage() {
      return this.riddleStorage;
    }
    notifyAll() {
      const that = this;
      window.riddle2API.riddles.forEach((riddle) => {
        that.notifyRiddle(riddle);
      });
    }
    notifyRiddle(riddle) {
      riddle.sendMessage({
        riddleStorage: JSON.parse(JSON.stringify(this.riddleStorage)),
        type: "riddleStorageRead"
      });
      riddle.sendMessage({
        type: "RiddleStorageInited"
      });
    }
  }
  let riddleStorageInstance = window.riddle2API?.riddleStorage;
  if (!riddleStorageInstance) {
    riddleStorageInstance = new RiddleStorage();
  }
  Object.freeze(riddleStorageInstance);
  const riddleStorageInstance$1 = riddleStorageInstance;
  let riddle2API;
  if (!window.riddle2API) {
    initAPI();
  } else {
    riddle2API = window.riddle2API;
  }
  function initAPI() {
    const dataLayer = dataLayerInstance$1;
    const riddleStorage = riddleStorageInstance$1;
    riddle2API = window.riddle2API = {
      initRiddle,
      checkForNewRiddles,
      riddles: [],
      isFullScreen: false,
      msgBacklog: [],
      isDOMReady: false,
      dataLayer,
      riddleStorage
    };
    window.addEventListener("message", onWindowMessage, false);
    if (document.readyState == "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        riddle2API.isDOMReady = true;
        checkForNewRiddles();
        WorkMsgBacklog();
      });
    } else {
      riddle2API.isDOMReady = true;
      checkForNewRiddles();
    }
  }
  function WorkMsgBacklog() {
    while (riddle2API.msgBacklog.length > 0) {
      const msg = riddle2API.msgBacklog.splice(0, 1)[0];
      onWindowMessage(msg);
    }
  }
  var riddle2IntervalCheck;
  function checkForNewRiddles() {
    clearTimeout(riddle2IntervalCheck);
    const selector = ".riddle2-wrapper, .riddle_target";
    var riddles = document.body.querySelectorAll(selector);
    for (const el of riddles) {
      if (isRiddleV1(el.getAttribute("data-rid-id") ?? "")) {
        riddleV1API.init(el);
      } else {
        initRiddle(el);
      }
    }
    riddle2IntervalCheck = setTimeout(checkForNewRiddles, 1e3);
  }
  function isRiddleV1(id) {
    return /^[0-9]+$/.test(id);
  }
  function initRiddle(el) {
    if (!el.classList.contains("inited")) {
      const riddle = new Riddle2(el);
      riddle2API.riddles.push(riddle);
      riddle2API.dataLayer?.readFromIframeSrc(riddle.iframe.src);
      sendPositionDataToIframes();
    }
  }
  function onWindowMessage(event) {
    if (typeof event.data != "object" || !event.data.isRiddle2Event) {
      return;
    }
    const riddleEvent2 = event.data;
    const riddle = riddle2API.riddles.find((i) => event.source === i.iframe.contentWindow);
    if (riddle && riddle2API.isDOMReady) {
      if (typeof event.data.category == "string" && event.data.category.startsWith("RiddleTrackEvent")) {
        const data = event.data;
        pushTrackEvent(data);
      }
      if (window.parent != void 0) {
        const e = JSON.parse(JSON.stringify(riddleEvent2));
        window.parent.postMessage(e, "*");
      }
      if (riddleEvent2.type === "RiddleStorageInit") {
        riddle2API.riddleStorage?.notifyRiddle(riddle);
      }
      if (riddleEvent2.type === "RiddleStorageDelete") {
        riddle2API.riddleStorage?.deleteItem(riddleEvent2.riddleStorageData);
      }
      if (riddleEvent2.type === "RiddleInited") {
        riddle.InitComplete();
        riddle2API.dataLayer?.notifyRiddle(riddle);
        riddle2API.riddleStorage?.notifyRiddle(riddle);
      }
      if (riddleEvent2.type === "RiddleStorageAdd") {
        if (riddleEvent2.riddleStorageData) {
          riddleEvent2.riddleStorageData.forEach((item) => {
            riddle2API.riddleStorage?.setItem(item.key, item.value);
          });
        }
      }
      if (riddleEvent2.height && !riddle.config.isFixedHeightEnabled) {
        riddle.UpdateHeight(riddleEvent2.height);
      }
      if (riddleEvent2.hideRiddle) {
        riddle.HideRiddle();
      }
      if (event.data.riddle2Event && window.onRiddle2Event) {
        window.onRiddle2Event(riddleEvent2, riddle.iframe);
      }
      if (riddleEvent2.height) {
        sendPositionDataToIframes();
      }
      if (event.data.action === "Block_View") {
        sendPositionDataToIframes();
      }
      const shouldScrollToTopOnViewAnswerExplanation = event.data.action === "Block_View_AnswerExplanation" && event.data.blockOptions["answerExplanationOptions"] && event.data.blockOptions["answerExplanationOptions"]["position"] === "Overlay";
      const shouldScrollToBottomOnViewAnswerExplanation = riddle.config.autoScroll && !riddleEvent2.isUnrolled && event.data.action === "Block_View_AnswerExplanation" && event.data.blockOptions["answerExplanationOptions"] && event.data.blockOptions["answerExplanationOptions"]["position"] === "BelowAnswers";
      if (shouldScrollToBottomOnViewAnswerExplanation) {
        const pos = riddle.iframe.getBoundingClientRect().bottom;
        const target = pos + window.scrollY - window.innerHeight + 10;
        window.scrollTo({
          top: target,
          behavior: "smooth"
        });
        sendPositionDataToIframes();
      } else if ((riddleEvent2.type == "PageChanged" || shouldScrollToTopOnViewAnswerExplanation || event.data.action === "Block_View") && riddle.config.autoScroll && !riddleEvent2.isUnrolled) {
        const pos = riddle.iframe.getBoundingClientRect().top;
        const target = pos + window.scrollY - 10 - riddle.config.autoScrollOffset;
        window.scrollTo({
          top: target,
          behavior: "smooth"
        });
        sendPositionDataToIframes();
      } else if (riddleEvent2.type == "PageChanged" && !riddle.config.autoScroll) {
        preventSiteJump();
        sendPositionDataToIframes();
      }
      if (riddleEvent2.type === "AnswerPoll" && !riddle.config.autoScroll) {
        preventSiteJump();
      }
      if (riddleEvent2.redirectToCustomLandingPage) {
        const path = riddleEvent2.redirectToCustomLandingPage.path;
        const data = riddleEvent2.redirectToCustomLandingPage.data;
        const form = window.parent.document.createElement("form");
        form.setAttribute("method", "post");
        form.setAttribute("action", path);
        const hiddenField = window.parent.document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", "data");
        hiddenField.setAttribute("value", data);
        form.appendChild(hiddenField);
        window.parent.document.body.appendChild(form);
        form.submit();
      }
    } else {
      riddle2API.msgBacklog.push(event);
    }
  }
  let scrollPosition = 0;
  document.addEventListener("scroll", function(e) {
    if (scrollPosition != 0) {
      window.scrollTo(0, scrollPosition);
      scrollPosition = 0;
    }
    sendPositionDataToIframes();
  });
  function sendPositionDataToIframes() {
    for (const riddle of riddle2API.riddles) {
      var iframeOffsetTop = riddle.iframe.getBoundingClientRect().top + window.scrollY || window.pageYOffset;
      var viewtop = window.scrollY || window.pageYOffset;
      var viewbottom = viewtop + window.innerHeight;
      riddle.iframe.contentWindow?.postMessage(
        {
          iframeOffsetTop,
          viewtop,
          viewbottom
        },
        "*"
      );
      riddle.LazyLoad(iframeOffsetTop, viewtop, viewbottom);
    }
  }
  function preventSiteJump() {
    var doc = document.documentElement;
    scrollPosition = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
  }
  function pushTrackEvent(riddleEvent) {
    if (riddleEvent.trackNetworks) {
      riddleEvent.trackNetworks.forEach((trackNetwork) => {
        try {
          if (trackNetwork.networkName === RiddleTrackNetworks.customer || trackNetwork.networkName === RiddleTrackNetworks.customTracking) {
            const tnef = trackNetwork.eventFunction;
            const ef = eval(tnef);
            ef(riddleEvent);
          } else {
            const tn = trackNetwork;
            const data = {
              ...riddleEvent
            };
            delete data.trackNetworks;
            switch (trackNetwork.networkName) {
              // facebook pixel
              case RiddleTrackNetworks.facebookPixel:
                const fbq = window[tn.networkObjectName];
                fbq("trackCustom", riddleEvent.category, {
                  eventAction: riddleEvent.action,
                  eventName: riddleEvent.name,
                  ...data
                });
                break;
              // google analytics
              case RiddleTrackNetworks.googleAnalytics:
                const ga = window[tn.networkObjectName];
                ga(
                  "send",
                  "event",
                  [riddleEvent.category],
                  [riddleEvent.action],
                  [riddleEvent.name],
                  ...data
                );
                break;
              case RiddleTrackNetworks.googleAnalytics4:
                const gtag = window[tn.networkObjectName];
                gtag("event", riddleEvent.category, {
                  event_name: riddleEvent.name,
                  event_action: riddleEvent.action,
                  ...data
                });
                break;
              // google tag manager
              case RiddleTrackNetworks.googleTagManager:
                const dataLayer = window[tn.networkObjectName];
                dataLayer.push({
                  event: "RiddleEvent",
                  event_category: riddleEvent.category,
                  event_action: riddleEvent.action,
                  event_name: riddleEvent.name,
                  ...data
                });
                break;
              // matomo tag
              case RiddleTrackNetworks.matomoTag:
                const _paq = window[tn.networkObjectName];
                _paq.push([
                  "trackEvent",
                  riddleEvent.category,
                  riddleEvent.action,
                  riddleEvent.name
                ]);
                break;
              // adobe
              case RiddleTrackNetworks.adobe:
                const s = window[tn.networkObjectName];
                s.track(riddleEvent.action, {
                  ...riddleEvent
                });
                break;
              default:
                break;
            }
          }
        } catch (error) {
          console.log("[RiddleTrackingError] " + trackNetwork.networkName + " not found");
        }
      });
    }
  }
})();
