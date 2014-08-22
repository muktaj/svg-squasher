//var def = require("./def");
window.bugHandler = {
	var score : 0,
	var level : 1,

	initBugs = function(){

		var windowWidth = $(window).width();
        	var windowHeight = $(window).height();

	        $(bugBigAnimate).attr("from", "0");
        	$(bugBigAnimate).attr("to", windowWidth);
	        $(bugMedAnimate).attr("from", "0");
        	$(bugMedAnimate).attr("to", windowWidth);
	        $(bugSmallAnimate).attr("from", "0");
        	$(bugSmallAnimate).attr("to", windowWidth);
	

	        $("svg[id^=bug]").click(function(){
        	        $(this)[0].pauseAnimations();
			var currentBug = $(this)[0];
			var bld = "#"+this.id+"Blood";
			var anim = "#"+this.id+"Animate";
		
                	$(bld).attr("visibility", "visible");
	                setTimeout( function(){
        	        	currentBug.unpauseAnimations();
			        $(bld).attr("visibility", "hidden");
		        	$(anim)[0].beginElement();
			}, 1500);
        	});
	},

	beginAnimate(bugId){
        $(bugId)[0].unpauseAnimations();
        $("#bugBigBlood").attr("visibility", "hidden");
        $("#bugBigAnimate")[0].beginElement();

}

window.getScore = function(){
	return score;
}

window.setScore = function(newScore){
	score = newScore;
}

window.getHighestScore = function(){
	return 1000;
}
window.getLevel = function(){
	return level;
}

window.setLevel = function(newLevel){
	level = newLevel;
}

window.setRemainingTime = function(){
	var timeRem = getLevelTime();
	var interval = setInterval(function() {
		$("timer").text(--timeRem);	
//		document.getElementById('timer').innerHTML = --timeRem;

	        if (timeRem <= 0)
	        {
//	        	document.getElementById('timer').innerHTML = 'You are ready';
//		        clearInterval(interval);
	        }
	}, 1000);
}

window.setCurrentLevel = function(){
	$("#level").text(getLevel());
}
//module.exports.initBugs = initBugs;
//module.exports.getLevel = getLevel;
//module.exports.setLevel = setLevel;
//module.exports.getScore = getScore;
//module.exports.setScore = setScore;

