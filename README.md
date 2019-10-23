# vis.js

vis.js is a visualizer for music files written in Javascript. Technologies utilized are [three.js](http://threejs.org/)
and [jQuery](https://jquery.com/). This project is inspired by the [Monstercat](https://youtube.com/Monstercat)
visualizer.

## Browser Support

:heavy_check_mark: Google Chrome

:heavy_check_mark: Microsoft Edge (minor issues but nothing huge)

:warning: Mozilla Firefox (works but sometimes freezes the browser)

:warning: Safari (Safari caps `fftSize` at 2048, resulting in odd/glitchy spectrum behavior)

:x: Microsoft Internet Explorer (no support for the AudioNode API)

## Common Issues

First and foremost, verify that you're using a supported browser as per the above section.

**Spectrum is jittery/choppy**

If the spectrum is jittery even though the framerate isn't dropping, you may need to reconfigure your system's audio settings. vis.js functions best at a sample rate of 44.1kHz. Higher rates may affect the visual quality of the spectrum.

**"Could not get audio context! (Are you using IE?)"**

The audio node could not be initialized because it is not supported by your browser. This is seen most commonly in Internet Explorer, which does not support the Audio API.

**"Could not set optimal fftSize! This may look a bit weird..."**

The audio node was not initialized properly. This might be resolved by using a different browser, although it may be a restriction caused by your system.

**404 in console on local install when loading audio**

vis.js needs a reverse proxy to be configured on the webserver in order to function due to Javascript restrictions. More specifically, `vis.mydomain.com/content/` should point to `docs.google.com`.

## Footnote

See the visualizer in action [here](http://vis.caseif.net/).

Based on [schisma/vis](https://github.com/schisma/vis).
