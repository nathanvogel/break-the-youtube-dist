!function(n){function e(o){if(t[o])return t[o].exports;var i=t[o]={i:o,l:!1,exports:{}};return n[o].call(i.exports,i,i.exports,e),i.l=!0,i.exports}var t={};e.m=n,e.c=t,e.i=function(n){return n},e.d=function(n,t,o){e.o(n,t)||Object.defineProperty(n,t,{configurable:!1,enumerable:!0,get:o})},e.n=function(n){var t=n&&n.__esModule?function(){return n.default}:function(){return n};return e.d(t,"a",t),t},e.o=function(n,e){return Object.prototype.hasOwnProperty.call(n,e)},e.p="",e(e.s=3)}([function(module,exports,__webpack_require__){"use strict";eval('\n\nvar _App = __webpack_require__(1);\n\nvar _App2 = _interopRequireDefault(_App);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nconsole.log("Creating APPliu from index.js");\n// window.addEventListener("DOMContentLoaded", function(e) { new App(); });\nnew _App2.default();\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/index.js\n// module id = 0\n// module chunks = 0\n\n//# sourceURL=webpack:///./src/index.js?')},function(module,exports,__webpack_require__){"use strict";eval('\n\nObject.defineProperty(exports, "__esModule", {\n  value: true\n});\n\nvar _AudioTool = __webpack_require__(2);\n\nvar _AudioTool2 = _interopRequireDefault(_AudioTool);\n\nvar _FontSizeEffector = __webpack_require__(5);\n\nvar _FontSizeEffector2 = _interopRequireDefault(_FontSizeEffector);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\n__webpack_require__(4);\n\n/*\r\n * The App is responsible for managing the lifecycle and the interaction\r\n * between AudioTool and the visual side.\r\n */\nvar App = function App() {\n  console.log("app is running");\n  this.tool = null;\n  this.isMic = false;\n  // this.stop = false;\n  // if (this.stop) { return;}\n\n  this.effectors = [];\n\n  this.tool = new _AudioTool2.default();\n  this.tool.setupBeatDetector(16, 1.05);\n\n  this.setup();\n  this.draw();\n};\n\nApp.prototype = {\n  setup: function setup() {\n\n    addEventListener("keydown", this.onKeyDown.bind(this));\n    this.effectors.push(new _FontSizeEffector2.default(document.getElementById("eow-title"), 1, 2));\n    this.effectors.push(new _FontSizeEffector2.default(document.getElementById("watch7-views-info").firstChild, 5, 2));\n  },\n\n  draw: function draw() {\n\n    if (this.tool) {\n      this.tool.updateFrequency();\n      this.tool.updateWave();\n      this.tool.analyzeBeats();\n\n      // if (Math.random() < 0.015) {\n      //   console.log(this.tool.dataBeat);\n      // }\n\n      if (this.tool.data) {\n        for (var i = 0; i < this.effectors.length; i++) {\n          this.effectors[i].update(this.tool.dataBeat);\n        }\n      }\n    }\n    // refresh\n    requestAnimationFrame(this.draw.bind(this));\n  },\n\n  onKeyDown: function onKeyDown(e) {\n    switch (e.keyCode) {\n      case 65:\n        // A\n        this.tool.toggleBeatDetection();\n        break;\n      case 37:\n        // ArrowLeft\n        this.tool.adjustThreshold(-0.1);\n        break;\n      case 39:\n        // ArrowRight\n        this.tool.adjustThreshold(0.1);\n        break;\n    }\n  }\n\n};\n\nexports.default = App;\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/App.js\n// module id = 1\n// module chunks = 0\n\n//# sourceURL=webpack:///./src/App.js?')},function(module,exports,__webpack_require__){"use strict";eval('\n\nObject.defineProperty(exports, "__esModule", {\n  value: true\n});\n\n/*\r\n * AudioTool adapted from Gael Hugo.\r\n * It searches through the audio and video elements of the existing page\r\n * and attaches an AnalyserNode to it.\r\n */\n\nvar AudioTool = function AudioTool(mp3) {\n  this.soundURL = mp3 || null;\n  this.audioContext = null;\n  this.audio = null;\n  this.isPlaying = false;\n  // MIC stuff\n  this.stream = null;\n  this.analyserNode = null;\n  this.data = [];\n  this.dataWave = [];\n  this.size = 2048;\n  this.counter = 0;\n  this.setup();\n};\n\nAudioTool.prototype = {\n\n  isAudioContextSupported: function isAudioContextSupported() {\n    window.AudioContext = window.AudioContext || window.webkitAudioContext;\n    if (window.AudioContext) {\n      return true;\n    } else {\n      return false;\n    }\n  },\n\n  setup: function setup() {\n    if (this.isAudioContextSupported()) {\n      this.audioContext = new AudioContext();\n      // Setup audio stuff\n      this.update(this.soundURL);\n    } else {\n      alert("this browser doesn\'t support the Web Audio API. Come on...");\n    }\n  },\n\n  update: function update(url) {\n\n    this.mic = null;\n    // console.log(document.getElementsByTagName("audio"));\n    this.audio = document.getElementsByTagName("audio")[0];\n    if (this.audio) {\n      this.broadcast();\n    } else {\n      console.log("No audio element");\n      console.log(document.getElementsByTagName("video"));\n      this.audio = document.getElementsByTagName("video")[0];\n      if (this.audio) {\n        this.broadcast();\n      } else {\n        console.log("No video element");\n      }\n    }\n  },\n\n  broadcast: function broadcast() {\n    if (this.source == null) this.source = this.audioContext.createMediaElementSource(this.audio);\n    this.analyserNode = this.audioContext.createAnalyser();\n    this.analyserNode.fftSize = this.size;\n    this.source.connect(this.analyserNode);\n    this.analyserNode.connect(this.audioContext.destination);\n    this.data = new Uint8Array(this.analyserNode.frequencyBinCount);\n    this.dataWave = new Uint8Array(this.analyserNode.frequencyBinCount);\n  },\n\n  onStream: function onStream(stream) {\n    this.stream = stream;\n    this.mic = this.audioContext.createMediaStreamSource(stream);\n    this.analyserNode = this.audioContext.createAnalyser();\n    this.analyserNode.fftSize = this.size;\n    this.mic.connect(this.analyserNode);\n    // two kind of analysis\n    this.data = new Uint8Array(this.analyserNode.frequencyBinCount);\n    this.dataWave = new Uint8Array(this.analyserNode.frequencyBinCount);\n  },\n\n  noStream: function noStream() {\n    alert("problem with mic");\n  },\n\n  updateFrequency: function updateFrequency() {\n    if (this.analyserNode) {\n      this.analyserNode.getByteFrequencyData(this.data);\n    }\n  },\n\n  updateWave: function updateWave() {\n    if (this.analyserNode) {\n      this.analyserNode.getByteTimeDomainData(this.dataWave);\n    }\n  }\n};\n\nexports.default = AudioTool;\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/AudioTool.js\n// module id = 2\n// module chunks = 0\n\n//# sourceURL=webpack:///./src/AudioTool.js?')},function(module,exports,__webpack_require__){eval("module.exports = __webpack_require__(0);\n\n\n//////////////////\n// WEBPACK FOOTER\n// multi ./src/index.js\n// module id = 3\n// module chunks = 0\n\n//# sourceURL=webpack:///multi_./src/index.js?")},function(module,exports,__webpack_require__){"use strict";eval('\n\nvar _AudioTool = __webpack_require__(2);\n\nvar _AudioTool2 = _interopRequireDefault(_AudioTool);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\n\'use strict\';\n\n/**\n * USAGE :\n *\n * After creating new AudioTool() :\n *      this.tool.setupBeatDetector(subbandCount, initialThreshold);\n *       where subbandCount is a power of 2 ideally,\n *       and initialThreshold a value around 1-3\n *\n * Every frame after this.tool.updateFrequency() :\n *      this.tool.analyzeBeats();\n *        this.tool.dataBeat will then be available as an array of length subbandCount\n *        each band will contain 0\n *        or the last average sample value for the band if a peak was detected.\n *\n */\n\n/**\n * CONTROL SNIPPET for onKeyDown :\n  case 65: // A\n   this.tool.toggleBeatDetection();\n   break;\n case 37: // ArrowLeft\n   this.tool.adjustThreshold(-0.1);\n   break;\n case 39: // ArrowRight\n   this.tool.adjustThreshold(0.1);\n   break;\n*/\n\n_AudioTool2.default.prototype.setupBeatDetector = function (subbandCount, initialThreshold) {\n  this.bandcount = subbandCount;\n  this.threshold = initialThreshold;\n  this.history_maxsize = 10;\n  this.sampleSize = 2048;\n  this.e_history = [];\n  this.local_total = [];\n  this.dataBeat = [];\n  this.es = [];\n  this.doFilterBeats = true;\n\n  for (var i = 0; i < this.bandcount; i++) {\n    this.local_total[i] = 0;\n  }\n  for (var _i = 0; _i < this.bandcount; _i++) {\n    this.dataBeat.push(0);\n  }\n\n  this.bandwidthes = [];\n  var amount = this.sampleSize / this.bandcount;\n\n  for (var _i2 = 0; _i2 < this.bandcount; _i2++) {\n    this.bandwidthes.push(amount);\n  }\n\n  // TODO : séparation ~exponentielle pour mieux séparer les basses.\n  // this.bandwidthes = [8,14,20,26,32,36,38,40,42,44,46,48,50,52,54,56,58,60,66,72,78,80];\n  // console.log(this.bandwidthes);\n};\n\n_AudioTool2.default.prototype.dequeueFromHistory = function () {\n  // Remove the oldest present value from the history queue\n  var old_es = this.e_history.shift();\n\n  // Adjust the local total accordingly for each band\n  for (var i = 0; i < this.bandcount; i++) {\n    this.local_total[i] -= old_es[i];\n  }\n};\n\n_AudioTool2.default.prototype.toggleBeatDetection = function () {\n  this.doFilterBeats = !this.doFilterBeats;\n  console.log("Turning beat detection " + (this.doFilterBeats ? "on" : "off"));\n};\n\n_AudioTool2.default.prototype.adjustThreshold = function (adjustement) {\n  this.threshold += adjustement;\n  console.log("Set threshold to : " + this.threshold);\n};\n\n_AudioTool2.default.prototype.analyzeBeats = function () {\n\n  var samplesI = 0;\n  // Energy of subband\n  var es = [];\n  for (var i = 0; i < this.bandcount; i++) {\n    // add the corresponding samples\n    // TODO : 1024 to 2048\n    var aggregated = 0;\n    for (var j = 0; j < this.bandwidthes[i]; j++) {\n      aggregated += this.data[samplesI];\n      samplesI++;\n    }\n    // finalize the computation of the band energy\n    // by dividing by the number of elements added\n    es.push(aggregated / this.bandwidthes[i]);\n    // es.push(aggregated);\n  }\n\n  // finalize the computation of the band energy\n  // by dividing by the number of elements added\n  // for (let i = 0; i < this.bandcount; i++) {\n  //   // es[i] *= (this.bandwidthes[i]/this.sampleSize);\n  //   es[i] /= (this.bandwidthes[i]);\n  // }\n\n  for (var _i3 = 0; _i3 < this.bandcount; _i3++) {\n    this.local_total[_i3] += es[_i3];\n  }\n  this.e_history.push(es);\n\n  if (this.e_history.length > this.history_maxsize) {\n    this.dequeueFromHistory();\n  }\n\n  // Actually filters beat\n  for (var _i4 = 0; _i4 < this.bandcount; _i4++) {\n    if (es[_i4] > this.threshold * this.local_total[_i4] / this.e_history.length || !this.doFilterBeats) {\n      this.dataBeat[_i4] = es[_i4];\n    } else {\n      this.dataBeat[_i4] = 0;\n    }\n  }\n};\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/AudioBeatTool.js\n// module id = 4\n// module chunks = 0\n\n//# sourceURL=webpack:///./src/AudioBeatTool.js?')},function(module,exports,__webpack_require__){"use strict";eval('\n\nObject.defineProperty(exports, "__esModule", {\n  value: true\n});\n\nvar FontSizeEffector = function FontSizeEffector(element, dataIndex, factor) {\n  this.element = element;\n  this.dataIndex = dataIndex;\n  this.factor = factor || 1;\n\n  this.speed = 0.1;\n  this.original = parseFloat(window.getComputedStyle(this.element, null).getPropertyValue(\'font-size\'));\n  this.currentValue = this.original;\n};\n\nFontSizeEffector.prototype = {\n  update: function update(data) {\n    // On a new data (beat or regular)\n    if (data[this.dataIndex] && data[this.dataIndex] > 0) {\n      this.currentValue = this.original + this.factor * data[this.dataIndex] / 10;\n    }\n    // The size is always falling back to it\'s original value\n    this.currentValue -= (this.currentValue - this.original) * this.speed;\n    // Update the UI\n    this.element.style.fontSize = this.currentValue + "px";\n  }\n\n};\n\nexports.default = FontSizeEffector;\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/FontSizeEffector.js\n// module id = 5\n// module chunks = 0\n\n//# sourceURL=webpack:///./src/FontSizeEffector.js?')}]);
