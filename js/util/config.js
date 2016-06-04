// NOTE: Not all config values may necessarily be changed by the user at
// runtime. Some are mutated internally after intialization, meaning changing
// them at runtime may not work as expected.

/* *********************** */
/* * Audio node settings * */
/* *********************** */
var volumeStep = 0.05; // the step for each volume notch as a fraction of 1

/* *************************** */
/* * Basic spectrum settings * */
/* *************************** */
// BASIC ATTRIBUTES
var spectrumSize = 63; // number of bars in the spectrum
var spectrumDimensionScalar = 4.5; // the ratio of the spectrum width to its height
var spectrumSpacing = 7; // the separation of each spectrum bar in pixels at width=1920
var maxFftSize = 16384; // the preferred fftSize to use for the audio node (actual fftSize may be lower)
// BASIC TRANSFORMATION
var spectrumStart = 4; // the first bin rendered in the spectrum
var spectrumEnd = 1200; // the last bin rendered in the spectrum
var spectrumScale = 1.8; // the logarithmic scale to adjust spectrum values to
// EXPONENTIAL TRANSFORMATION
var spectrumMaxExponent = 5; // the max exponent to raise spectrum values to
var spectrumMinExponent = 3; // the min exponent to raise spectrum values to
var spectrumExponentScale = 2; // the scale for spectrum exponents
// DROP SHADOW
var spectrumShadowBlur = 6; // the blur radius of the spectrum's drop shadow
var spectrumShadowOffsetX = 0; // the x-offset of the spectrum's drop shadow
var spectrumShadowOffsetY = 0; // the y-offset of the spectrum's drop shadow

/* ********************** */
/* * Smoothing settings * */
/* ********************** */
var smoothingPoints = 3; // points to use for algorithmic smoothing. Must be an odd number.
var smoothingPasses = 1; // number of smoothing passes to execute
var temporalSmoothing = 0.25; // passed directly to the JS analyzer node

/* ************************************ */
/* * Spectrum margin dropoff settings * */
/* ************************************ */
var headMargin = 7; // the size of the head margin dropoff zone
var tailMargin = 0; // the size of the tail margin dropoff zone
var minMarginWeight = 0.6; // the minimum weight applied to bars in the dropoff zone

/* *************************** */
/* * Basic particle settings * */
/* *************************** */
// COUNT
var baseParticleCount = 2000; // the number of particles at 1080p
var fleckCount = 50; // total fleck count
var bokehCount = 250; // total bokeh count
// OPACITY
var particleOpacity = 0.7; // opacity of primary particles
var bokehOpacity = 0.5; // opacity of bokeh (raising this above 0.5 results in weird behavior)
// SIZE
var minParticleSize = 4; // the minimum size scalar for particle systems
var maxParticleSize = 7; // the maximum size scalar for particle systems
var particleSizeExponent = 2; // the exponent to apply during dynamic particle scaling (similar to spectrum exponents)
// POSITIONING
var yVelRange = 3; // the range for particle y-velocities
var xPosBias = 4.5; // bias for particle x-positions (higher values = more center-biased)
var zPosRange = 450; // the range of z-particles
var zModifier = -250; // the amount to add to z-positions
var zPosBias = 2.3; // bias for particle z-positions (higher values = more far-biased)
var leftChance = 0.88; // the chance for a particle to spawn along the left edge of the screen
var rightChance = 0.03; // the chance for a particle to spawn along the right edge of the screen
var topBottomChance = 0.09; // the chance for a particle to spawn along the top/bottom edges of the screen
// VELOCITY
var velBias = 1.8; // bias for particle velocities (higher values = more center-biased)
var minParticleVelocity = 2.5; // the minimum scalar for particle velocity
var maxParticleVelocity = 3.5; // the maximum scalar for particle velocity
var absMinParticleVelocity = 0.001; // the absolute lowest speed for particles
var fleckVelocityScalar = 1.75; // velocity of flecks relative to normal particles
var fleckYVelScalar = 0.75; // y-velocity range of flecks relative to x-velocity
var bokehMinVelocity = maxParticleVelocity * 0.15; // the minimum velocity of bokeh
var bokehMaxVelocity = maxParticleVelocity * 0.3; // the maximum velocity of bokeh

/* ****************************** */
/* * Particle analysis settings * */
/* ****************************** */
var ampLower = 7; // the lower bound for amplitude analysis (inclusive)
var ampUpper = 30; // the upper bound for amplitude analysis (exclusive)
var particleExponent = 4.5; // the power to raise velMult to after initial computation

/* ***************** */
/* * Misc settings * */
/* ***************** */
var cycleSpeed = 4; // the (arbitrary) scalar for cycling rainbow spectrums
var blockWidthRatio = 0.63; // the width of the Monstercat logo relative to its containing block
var blockHeightRatio = 0.73; // the height of the Monstercat logo relative to its containing block
var mouseSleepTime = 1000; // inactivity period in milliseconds before the bottom text is hidden
