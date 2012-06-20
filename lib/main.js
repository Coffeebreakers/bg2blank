const bgToWidgets = require("widget");
const bgToTabs = require("tabs");
const bgToSs= require("simple-storage");
const bgToData = require("self").data;
var bgToContextMenu = require("context-menu");

// Set storage background
bgToSs.storage.bgToImgBg = bgToSs.storage.bgToImgBg || ""; 

// Create the Widget
var widget = bgToWidgets.Widget({
  id: "usar-a-imagem-como-background",
  label: "bg2blank",
  contentURL: bgToData.url("favicon.ico"),
  onClick: function() {
  	insertStorage(bgToTabs.activeTab.url);
    return;
  }
});

// Create the Context Menu
var menuItem = bgToContextMenu.Item({
	label: "Usar a imagem como background",
	context: bgToContextMenu.SelectorContext("img"),
	contentScript: 'on("click", function (node) {' +
                 '  postMessage(node.src);' +
                 '});',
  onMessage: function (context) {
  	insertStorage(context)
  }
});

//Functions
// Function to insert the image on storage
var insertStorage = function (urlImage) {
	var typesFile = /\.(jpg|jpeg|png|gif)$/gi
  var putStorage = urlImage;
  if (putStorage.match(typesFile) !== null) {
  	bgToSs.storage.bgToImgBg = putStorage;
  };
};
// Function to insert the image on page specifies
var setBg2Blank = function () {
  if (bgToTabs.activeTab.url === "about:blank" || 
      bgToTabs.activeTab.url === "about:home" || 
      bgToTabs.activeTab.url === "about:newtab" || 
  	  bgToTabs.activeTab.url === "undefined") {
    var worker = bgToTabs.activeTab.attach({
	  contentScript:
      'if (document.body !== undefined) {' + 
        'if (document.body.innerHTML === "") {' +
        'document.body.style.padding = "0px";' +
        'document.body.style.margin = "0px";' +
        'document.body.style.background = "url('+ bgToSs.storage.bgToImgBg +') no-repeat center 0"' +
        '}' +
      '} else {' +
  	  	'if (document.getElementById("newtab-scrollbox") !== null) {' +
  	  	'document.getElementById("newtab-scrollbox").style.background = "url('+ bgToSs.storage.bgToImgBg +') no-repeat center 0"' +
        '}' +
	  	'}'
    });
  };
};

// Call when firefox open
setBg2Blank();

// Listen for tab openings.
bgToTabs.on('ready', function onOpen(tab) {
	setBg2Blank();
});
