
/* eslint no-console: "off" */
var HangarXPLOR = HangarXPLOR || {};

HangarXPLOR.Log = function()
{
  if (HangarXPLOR._logEnabled) {
    console.log.apply(this, Array.from(arguments));
  }
}
