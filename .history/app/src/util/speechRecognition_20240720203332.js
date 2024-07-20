// src/speechRecognition.js
const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const sr = new Recognition();

export default sr;
