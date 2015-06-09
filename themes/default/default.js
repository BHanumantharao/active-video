/*
* @fileDescription Provides layout switching between multiple resolutions for test apps, 
* and any other shared functionality
*/

//sandbox of local variables and event listner dependencies
document.addEventListener('DOMContentLoaded',function(){
	var DEBUG = true;
	var log = function(obj){if(DEBUG){console.log(obj);}}
	var bufferTimeout = 3000;
	var layouts = {'d640x480':'','d720x576':'','d720x480':'','d1024x576':'','d1280x720':'','d1920x1080':''}
	var hotKeys = {
		'11' : 'switchLayouts',
		'12' : 'toggleGrid'
	}

	var buffer = '';
	var lastKey =Date.now();
	var $ = function(elem){return typeof(elem) == 'string' ? document.getElementById(elem) : elem};
	var $$ = function(str){return document.getElemnetsByClassName(str);}
	var lastPressed = "";
	//local and global constant
	var keys = window.KEYS = {
		        '49'		  : "1",
		        '50'		  : "2",
		        '51'		  : "3",
		        '52'		  : "4",
		        '53'		  : "5",
		        '54'		  : "6",
		        '55'		  : "7",
		        '56'		  : "8",
		        '57'		  : "9",
		        '48'		  : "0",
		        
		        '97'		  : "1",
		        '98'		  : "2",
		        '99'		  : "3",
		        '100'		  : "4",
		        '101'		  : "5",
		        '102'		  : "6",
		        '103'		  : "7",
		        '104'		  : "8",
		        '105'		  : "9",
		        '96'		  : "0",
		        
		        '40'		  : "D",//down
		        '39'		  : "R",//right
		        '38'		  : "U",//up
		        '37'		  : "L",//left
		        
		        '13'		  : "E",//enter
		        '4102'	  	  : "X",//exit
	}
	
	/*
	 * handleHotKeys - based on functions referenced in the hotKeys object, if a sequence is detected that links to 
	 * a function, we will call it from here
	 */
	var handleHotKeys = function(evt){
		var keyCode = evt.keyCode.toString();
		//log('kcode was: ' + keyCode);
		
		if(keys[keyCode] != undefined){
			var now = Date.now(), timeSinceLast = now - lastKey;
			lastKey=now
			//alert(typeof(now)); alert(lastKey);
			if(timeSinceLast > bufferTimeout){buffer='';}//clear buffer if longer than the bufferTimeout for keypresses
			buffer+=keys[keyCode];
			//log(buffer + ' ' + timeSinceLast + 'ms since last');
			
			if(hotKeys[buffer] != undefined){
				//evt.stopPropagation();
				//evt.preventDefault();
				
				actions[hotKeys[buffer]] ();//in the actions object, execute the desired action
				buffer='';//clear buffer
			}
			
		}else{
			buffer = '';
		}		
		
		//check for navigation
		checkForNav(evt);
	}
	
	//Begin Navigation
	var checkForNav = function(evt){
		var dir='',id = keys[evt.keyCode] != undefined ? keys[evt.keyCode] : '';
		switch(id){
			case "D": dir = 'down';	break;
			case "R": dir = 'right';	break;
			case "L": dir = 'left';	break;
			case "U": dir = 'up';	break;
		}
		//console.log(id)
		if(dir){navX(dir,evt.target, evt);}
		else if((evt.keyCode == 104 || evt.keyCode == 56)){
			if(lastPressed == 104 || lastPressed == 56){
				if(window.opener){
					console.log("Closing self on 8 key, showing window.opener()")
					try{window.opener.focus();}catch(eNotBrowser){}
					window.close();
				}else{
					console.log('Cannot close down window... nothing beneath me');
					alert('Cannot close down window... nothing beneath me');//browser friendly
				}
			}
			lastPressed = evt.keyCode;
		}
		lastPressed = evt.keyCode;
	}
	//navX - given a direction and a focused element, implement the CSS3 nav-x module
	var navX = function(dir, elem, evt){
		var camelized = 'nav'+dir.substring(0,1).toUpperCase() + dir.substring(1), 
			dir = 'nav-' + dir;
		
		var nav = elem.style[camelized];
		if(nav==undefined){
			var style = elem.getAttribute('style');
			if(style == undefined){return false;}
			var navRegEx = new RegExp(dir + ":?([^;]*)");
			var match = navRegEx.exec(style);
			//log([dir + ":?([^;]*)",match]);
			if (match != null && match.length >= 2) {
				var nav = removeExtraWhitespace(match[1]);
			}
		}
		if(nav == undefined){return;}//oh well
		//log(nav);
		var elem = $(nav.replace('#',''));
		if(elem){
			log("Focusing " + nav);
			scrollIfNeeded(evt, elem);
			elem.focus();
			
		}
	}
	//End Navigation
	
	
	/* removeExtraWhitespace - helper to trim extra whitespace between and on ends of removeExtraWhitespace class strings and other strings*/
	var removeExtraWhitespace = function(str){
		return str.replace(/^\s+|\s+$/g,"").replace(/\s{2,}/g, ' ')
	}
	
	var actions = {
		switchLayouts  :  function(){
			var curClass = document.body.className, curLayout='', nextLayout ='', defaultLayout = '';
			
			for(var layout in layouts){if(defaultLayout==''){defaultLayout=layout;}if(curClass.indexOf(layout) != -1){curLayout=layout;}else if(curLayout!=''){nextLayout=layout; break;/*Done*/}}//set to 1st layout by default
			if(!nextLayout){nextLayout=defaultLayout;}
			document.body.className  = removeExtraWhitespace(curClass.replace(curLayout,'') + ' ' + nextLayout);

			log('switchLayouts() - changed from "' + curClass +'" to "' + document.body.className + '"');
		},
		
		toggleGrid : function(){
			var m = document.body;
			var newClass = '';
			if(m.className != undefined && m.className.indexOf('layoutGrid') != -1){m.className = m.className.replace('layoutGrid','');}
			else{m.className = removeExtraWhitespace(m.className + ' ' +  'layoutGrid');}
		}	
		
		
	};
	
	//logo placement
	var logo = document.createElement('div');
	logo.setAttribute('class', 'logo');
	

	var main = document.getElementById('main');
	if(main){main.insertBefore(logo, main.firstChild);}else{document.body.appendChild(logo);}
	//alert(main);
	
	//attach to global
	var scrollIfNeeded = window.scrollIfNeeded = function(evt, nextElem){
		var parentElement = evt.target.parentNode;
					
		//parent position & height
		var startContainer = parentElement.scrollTop;
		var parentHeight = parseFloat(window.getComputedStyle(parentElement).height)
		var endContainer = parentElement.scrollTop + parentHeight;
		
		//element position & height
		var startElem = nextElem.offsetTop;
		var elemHeight = parseFloat(window.getComputedStyle(nextElem).height);
		var endElem = startElem + elemHeight;

		console.log({
			startContainer : startContainer,
			parentHeight : parentHeight,
			endContainer : endContainer,
			startElem : startElem,
			elemHeight : elemHeight,
			endElem : endElem			
		});
		
		//scroll down into view
		if(startElem < startContainer){
			parentElement.scrollTop = startElem;
		//if end of element is off screen, scroll up into view	
		}else if(endElem > endContainer){
			parentElement.scrollTop = endElem - parentHeight;
		}else{
			return;
		}
		cancelEvent(evt);
		nextElem.focus();
		console.log('scrolled to ' + parentElement.scrollTop);
	}
	
	var cancelEvent = function(evt){
		if(typeof(evt.stopPropagation) == 'function'){return;}
		evt.stopPropagation();
		evt.preventDefault();
		console.log("Event cancelled");
	}
	
	
	
	//subscribe
	document.body.addEventListener('keydown', handleHotKeys, false);
	
	//$('button1').focus();
}, true);