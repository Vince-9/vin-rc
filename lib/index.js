'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () {
            return e[k];
          }
        });
      }
    });
  }
  n['default'] = e;
  return Object.freeze(n);
}

var React__namespace = /*#__PURE__*/_interopNamespace(React);

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var viewHeight = window.innerHeight;
function Draw(props) {
  var children = props.children,
      _props$visiable = props.visiable,
      visiable = _props$visiable === void 0 ? false : _props$visiable,
      _props$minHeight = props.minHeight,
      minHeight = _props$minHeight === void 0 ? 30 : _props$minHeight,
      _props$maxHeight = props.maxHeight,
      maxHeight = _props$maxHeight === void 0 ? Math.round((viewHeight - 50) / viewHeight * 100) : _props$maxHeight,
      onClose = props.onClose,
      _props$className = props.className,
      className = _props$className === void 0 ? '' : _props$className,
      _props$style = props.style,
      style = _props$style === void 0 ? {} : _props$style;

  var _React$useState = React__namespace.useState(visiable ? minHeight : 0),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      height = _React$useState2[0],
      setHeight = _React$useState2[1];

  var contentRef = React__namespace.useRef({});
  var drawRef = React__namespace.useRef({});
  var isTouching = React__namespace.useRef(false);

  var _React$useState3 = React__namespace.useState(0),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      startY = _React$useState4[0],
      setStartY = _React$useState4[1];

  var _React$useState5 = React__namespace.useState(0),
      _React$useState6 = _slicedToArray(_React$useState5, 2),
      slideStartHeight = _React$useState6[0],
      setStartHeightY = _React$useState6[1];

  var _React$useState7 = React__namespace.useState(0),
      _React$useState8 = _slicedToArray(_React$useState7, 2),
      scrollStart = _React$useState8[0],
      setScrollStart = _React$useState8[1];

  var touchMovePath = React__namespace.useRef([]);
  var isScroll = React__namespace.useRef(false);
  var scrollTimer = React__namespace.useRef();
  var isHeightGoByDown = React__namespace.useRef(true);
  React__namespace.useEffect(function () {
    if (visiable) {
      setHeightSmoothly(minHeight);
    } else {
      setHeightSmoothly(0);
    }
  }, [visiable]);

  var _onTouchStart = function onTouchStart(e, move) {
    var clientY = e.targetTouches[0].clientY;
    setStartY(clientY);
    setStartHeightY(height);
    setScrollStart(0);
    touchMovePath.current = [];

    if (move || height === minHeight) {
      isTouching.current = true;
      isScroll.current = false;
    } else if (contentRef.current.scrollTop > 0) {
      toogleToScroll(clientY);
    } else {
      isTouching.current = false;
      isScroll.current = false;
    }
  };

  var _onTouchMove = function onTouchMove(e, move) {
    var clientY = e.targetTouches[0].clientY;

    if (!move && contentRef.current.scrollTop === 0 && !isTouching.current && isScroll.current && height >= maxHeight && touchMovePath.current.length > 2 && touchMovePath.current[2][0] - touchMovePath.current[0][0] > 0) {
      setStartY(clientY);
      setStartHeightY(height);
      isTouching.current = true;
      isScroll.current = false;
    } else if (move || isTouching.current) {
      e.stopPropagation();

      if ((slideStartHeight < maxHeight || isHeightGoByDown.current) && height >= maxHeight) {
        toogleToScroll(clientY);
        isHeightGoByDown.current = false;
      } else {
        var newHeight = slideStartHeight + (startY - clientY) / viewHeight * 100;
        setHeight(Math.min(maxHeight, newHeight));

        if (!isHeightGoByDown.current && newHeight < maxHeight) {
          isHeightGoByDown.current = true;
        }
      }
    } else if (isScroll.current) {
      e.stopPropagation();
      contentRef.current.scroll(0, scrollStart + startY - clientY);
    } else if (touchMovePath.current.length >= 2) {
      var path = touchMovePath.current;
      var sub = path[1][0] - path[0][0];

      if (sub <= 0) {
        isScroll.current = true;
      } else {
        isTouching.current = true;
      }
    }

    touchMovePath.current.push([clientY, e.timeStamp]);

    if (touchMovePath.current.length > 5) {
      touchMovePath.current.shift();
    }
  };

  var _onTouchEnd = function onTouchEnd(e, move) {
    e.stopPropagation();

    if (move || isTouching.current) {
      isTouching.current = false;

      if (touchMovePath.current.length < 5) {
        setHeightSmoothly(slideStartHeight);
      } else {
        var endY = touchMovePath.current[4][0];
        var sub = endY - touchMovePath.current[0][0];

        if (height < minHeight) {
          setHeightSmoothly(0);
          close();
        } else if (sub === 0) {
          setHeightSmoothly(slideStartHeight);
        } else if (sub < 0) {
          setHeightSmoothly(maxHeight);
        } else {
          setHeightSmoothly(minHeight);
        }
      }
    } else if (isScroll.current) {
      isScroll.current = false;
      var path = touchMovePath.current;

      if (path.length > 2) {
        var _path$ = _slicedToArray(path[0], 2),
            Y1 = _path$[0],
            t1 = _path$[1];

        var _path$2 = _slicedToArray(path[2], 2),
            Y2 = _path$2[0],
            t2 = _path$2[1];

        var speed = (Y2 - Y1) / (t2 - t1);
        var gap = 0.02;

        if (scrollTimer.current) {
          clearInterval(scrollTimer.current);
          scrollTimer.current = undefined;
        }

        var k = 100;
        var curTop = contentRef.current.scrollTop;
        scrollTimer.current = setInterval(function () {
          curTop -= speed * 5;
          contentRef.current.scroll(0, curTop);

          if (speed > 0) {
            speed = Math.max(0, speed - gap);
          } else {
            speed = Math.min(0, speed + gap);
          }

          gap = Math.max(Math.abs(speed) / k, 0.004);

          if (Math.abs(speed) === 0) {
            clearInterval(scrollTimer.current);
            scrollTimer.current = undefined;
          }
        }, 5);
      }
    }
  };

  var setHeightSmoothly = function setHeightSmoothly(target) {
    var start = height;
    var transition = 240;
    var step = (target - start) / (transition / 10);
    var cnt = 1;
    var timer = setInterval(function () {
      var newHeight = start + cnt * step;

      if (Math.abs(newHeight - target) <= 2) {
        setHeight(target);
        clearInterval(timer);
      } else {
        setHeight(start + cnt * step);
      }

      cnt++;
    }, 10);
  };

  var toogleToScroll = function toogleToScroll(clientY) {
    setScrollStart(contentRef.current.scrollTop);
    setStartY(clientY);
    isTouching.current = false;
    isScroll.current = true;

    if (scrollTimer.current) {
      clearInterval(scrollTimer.current);
      scrollTimer.current = undefined;
    }
  };

  var close = function close(e) {
    if (e) e.stopPropagation();
    setHeightSmoothly(0);
    onClose && onClose();
  };

  return /*#__PURE__*/React__namespace.createElement("div", {
    className: "vin-draw ".concat(className),
    style: Object.assign(Object.assign({}, style), {
      top: "".concat(100 - height, "%")
    }),
    ref: drawRef,
    onTouchStart: _onTouchStart,
    onTouchEnd: _onTouchEnd,
    onTouchMove: _onTouchMove
  }, /*#__PURE__*/React__namespace.createElement("div", {
    className: "vin-draw-top-bar",
    onTouchStart: function onTouchStart(e) {
      return _onTouchStart(e, true);
    },
    onTouchEnd: function onTouchEnd(e) {
      return _onTouchEnd(e, true);
    },
    onTouchMove: function onTouchMove(e) {
      return _onTouchMove(e, true);
    }
  }, /*#__PURE__*/React__namespace.createElement("div", {
    className: "touch-line-wrapper"
  }, /*#__PURE__*/React__namespace.createElement("div", {
    className: "touch-line"
  })), /*#__PURE__*/React__namespace.createElement("div", {
    className: "close-btn",
    onClick: close
  }, /*#__PURE__*/React__namespace.createElement("span", {
    className: "iconfont icon-close"
  }))), /*#__PURE__*/React__namespace.createElement("div", {
    className: "slide-content",
    ref: contentRef
  }, children));
}

function test() {
  React__namespace.useEffect(function () {
    console.log(2333);
  }, []);
  return /*#__PURE__*/React__namespace.createElement("div", null, "\u8FD9\u662F\u4E00\u4E2A\u6D4B\u8BD5\u7EC4\u4EF6");
}

exports.Draw = Draw;
exports.Test = test;
//# sourceMappingURL=index.js.map
