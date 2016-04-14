<?php
$code = file_get_contents("badoo.js");
$template = file_get_contents("userscript.js");

$userscript = str_replace("{{code}}", base64_encode($code), $template);

file_put_contents("badoo.user.js", $userscript);

