/*Added an array of videos*/

document.addEventListener('DOMContentLoaded',function(){
console.log('loaded');
var topMenu = document.getElementById('main');
var downPresses = [];
var upPresses = [];
var cap = 10;


//INIT	
	var init = function(){				
		var hiddenNavButton = document.getElementById('focusButton');
		hiddenNavButton.focus();	
		hiddenNavButton.style.display = "none";	
		topMenu.addEventListener('keydown', keypressListenerDown, true);
		topMenu.addEventListener('keyup', keypressListenerUp, true);
	}
		
	var keypressListenerDown = function(evt){	
		console.log("Something was pressed...");		
		updateArray(evt, downPresses);
		var leftMenu = document.getElementById("leftMenu");
		leftMenu.innerHTML = downPresses.join("");
	}	
	
	var keypressListenerUp = function(evt){	
		console.log("Something was pressed...");
		updateArray(evt, upPresses);
		var leftMenu = document.getElementById("rightMenu");
		rightMenu.innerHTML = upPresses.join("");
	}	
	
	var updateArray = function(evt, arrayToUpdate){
		if(arrayToUpdate.length > cap){
			arrayToUpdate.shift();
		}
		arrayToUpdate.push(evt.keyCode + " (" + evt.keyIdentifier + ")<br>");
	}	
	init();
	
}, true)
