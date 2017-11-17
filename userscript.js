// ==UserScript==
// @name BadooNearbyAutolike
// @author nemanjan00
// @include https://badoo.com/*
// @include https://*.badoo.com/*
// @include http://badoo.com/*
// @include http://*.badoo.com/*
// @include https://blendr.com/*
// @include https://*.blendr.com/*
// @include http://blendr.com/*
// @include http://*.blendr.com/*
// @downloadURL https://raw.githubusercontent.com/nemanjan00/BadooNearbyLike/master/badoo.user.js
// @namespace https://github.com/nemanjan00/BadooNearbyAutolike
// @updateURL https://raw.githubusercontent.com/nemanjan00/BadooNearbyLike/master/badoo.user.js
// @version 10
// ==/UserScript==

var code = atob("{{code}}");

location.href="javascript:(function(){" + code + "})()";

