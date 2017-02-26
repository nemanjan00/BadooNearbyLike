// ==UserScript==
// @name BadooNearbyAutolike
// @author nemanjan00
// @include https://badoo.com/*
// @include https://*.badoo.com/*
// @include http://badoo.com/*
// @include http://*.badoo.com/*
// @downloadURL https://raw.githubusercontent.com/nemanjan00/BadooNearbyLike/master/badoo.user.js
// @namespace https://github.com/nemanjan00/BadooNearbyAutolike
// @updateURL https://raw.githubusercontent.com/nemanjan00/BadooNearbyLike/master/badoo.user.js
// @version 8
// ==/UserScript==

var code = atob("{{code}}");

location.href="javascript:(function(){" + code + "})()";

