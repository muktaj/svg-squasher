window.bugHandler = {
	score : 0,
	currentTime : 0,
	bugsKilled : 0,
	bugBigTime : 14,
	bugMedTime : 12,
	bugSmallTime : 10,
	pathPoints : 0,
	contentHeight : 0,
	contentWidth : 1028,	
	bugBigAlive : true,
	bugMedAlive : true,
	bugSmallAlive : true,
	contentBorder : 0,
	bugClicked : false,
	ignoreEndGame :3,
	bugTimeOut : [],
	highScores : [],

//Initialize variables before game begins
	initVariables : function(){
		window.bugHandler.score = 0;
		window.bugHandler.currentTime = 0;
		window.bugHandler.bugsKilled = 0;
		window.bugHandler.pathPoints = 0;
		window.bugHandler.bugBigTime = 14;
		window.bugHandler.bugMedTime = 12;
		window.bugHandler.bugSmallTime = 10;
		window.bugHandler.bugBigAlive = true;
		window.bugHandler.bugMedAlive = true;
		window.bugHandler.bugSmallAlive = true;
		window.bugHandler.contentBorder = 0;
		window.bugHandler.bugClicked = false;
		window.bugHandler.bugTimeOut=[];
		
		window.bugHandler.contentHeight = $("#content").height();
		window.bugHandler.contentWidth = $("#content").outerWidth(true);

		$("#content").css('background-image','url(../images/'+$('input:radio[name=optionBG]:checked').val()+'.jpg)');

	},

//Reset animations at the start of new game
	resetAnimations : function() {
		$("#bugBigAnimate").attr("path", window.bugHandler.randomizePath());
		$("#bugMedAnimate").attr("path", window.bugHandler.randomizePath());
		$("#bugSmallAnimate").attr("path", window.bugHandler.randomizePath());

		$("#bugBigAnimate").attr("dur", window.bugHandler.bugBigTime);
		$("#bugMedAnimate").attr("dur", window.bugHandler.bugMedTime);
		$("#bugSmallAnimate").attr("dur", window.bugHandler.bugSmallTime);
		
		$("#bugBigAnimate").attr("onend", "window.bugHandler.endGame('big')");
		$("#bugMedAnimate").attr("onend", "window.bugHandler.endGame('med')");
		$("#bugSmallAnimate").attr("onend", "window.bugHandler.endGame('small')");

		$("#bugBig")[0].unpauseAnimations();
		$("#bugMed")[0].unpauseAnimations();
		$("#bugSmall")[0].unpauseAnimations();

		$("#bugBigAnimate")[0].beginElement();
		$("#bugMedAnimate")[0].beginElement();
		$("#bugSmallAnimate")[0].beginElement();

		$("#bugBig").attr("currentClicked","false");
		$("#bugMed").attr("currentClicked","false");
		$("#bugSmall").attr("currentClicked","false");
	},

//Setup game
	initBugs : function(){

		window.bugHandler.initVariables();
		window.bugHandler.setCurrentScore();

		window.bugHandler.setGameTime();
		window.bugHandler.setBugsKilled();
		var audioSlap = new Audio("./audio/slap.mp3");
		var audioKill = new Audio("./audio/kill.mp3");

		window.bugHandler.resetAnimations();		
		$("#content").click(function(){

			$("#content").css('cursor','url(./images/pinYellowClicked.png) ,auto');
			setTimeout(function() {
				$("#content").css('cursor','url(./images/pinYellow.png) ,auto');
			}, 200);

			audioSlap.play();

		});

	        $("svg[id^=bug]").click(function(){
			if($(this).attr("currentClicked")=="true")
			{
				return;
			}
			$(this).attr("currentClicked","true");
			audioKill.play();
        	        $(this)[0].pauseAnimations();
			window.bugHandler.bugsKilled += 1;
			window.bugHandler.setBugsKilled();
			var currentBug = $(this);
			var anim = "#"+this.id+"Animate";

			$(this).fadeToggle(300).fadeToggle(300).fadeToggle(300).fadeToggle(300).fadeToggle(300);
			var bugType = this.id.substr(3);

			window.bugHandler.increaseScore(bugType);
			window.bugHandler.setBugAnimation(anim, bugType);
			$(this).fadeToggle();
	                window.bugHandler.bugTimeOut.push(setTimeout( function(){
        	        	currentBug[0].unpauseAnimations();
				window.bugHandler.bugClicked = true;
		        	$(anim)[0].beginElement();
				currentBug.attr("currentClicked","false");
			}, 1500));
        	});

	},

//Check if game has ended
	endGame : function(bugType){
		if( window.bugHandler.ignoreEndGame < 1 && !window.bugHandler.bugClicked)
		{
			for (var i = 0; i < window.bugHandler.bugTimeOut.length; i++)
			{
			    clearTimeout(window.bugHandler.bugTimeOut[i]);
			}	
			$("#bugBigAnimate").removeAttr("onend");
			$("#bugMedAnimate").removeAttr("onend");
			$("#bugSmallAnimate").removeAttr("onend");

			switch(bugType) {
				case "big":	
					$("#bugMedAnimate")[0].endElement();
					$("#bugSmallAnimate")[0].endElement();
					break;
				case "med" :
					$("#bugBigAnimate")[0].endElement();
					$("#bugSmallAnimate")[0].endElement();
					break;
				case "small" :
					$("#bugBigAnimate")[0].endElement();
					$("#bugMedAnimate")[0].endElement();
					break;
			}
			clearInterval(window.bugHandler.resetTimeInterval);
			$("#alert_gameOver").modal({
					  backdrop: 'static'
			});
			if(window.bugHandler.isHighScore(window.bugHandler.getScore()))
			{
				$("#modal_highScore").show();
				$("#modal_lowScore").hide();
			}
			else {
				$("#modal_highScore").hide();
				$("#modal_lowScore").show();
			}

		}
		else{
			window.bugHandler.bugClicked = false;
			window.bugHandler.ignoreEndGame--;
		}
	},

//Increase score based on the type of bug killed
	increaseScore : function(type){
		var points = 0;
		switch(type) {
			case "Big":
				points = window.def.getBigPoints();
		        	break;
		        case "Small":
				points = window.def.getSmallPoints();
			        break;
		        case "Med":
				points = window.def.getMedPoints();
			        
		}	
		window.bugHandler.score = window.bugHandler.score + points;
		window.bugHandler.setCurrentScore();
	},

//Returns score
	getScore : function(){
		return window.bugHandler.score;
	},

//sets new score
	setScore : function(newScore){
		window.bugHandler.score = newScore;
	},

//display score on game page
	setCurrentScore : function(){
		$("#score").text(window.bugHandler.getScore());
	},

//display number of bugs killed on game page
	setBugsKilled : function() {
		$("#bugsKilled").text(window.bugHandler.bugsKilled);
	},

//display time elapsed on game page
	setGameTime : function(){
		window.bugHandler.resetTimeInterval = setInterval(function() {
			$("#time").text(window.bugHandler.currentTime++);

		        if (window.bugHandler.currentTime % window.def.getLevelTime() == 1)
		        {
				window.bugHandler.pathPoints += 2;
				if(window.bugHandler.currentTime % (2*window.def.getLevelTime()) == 1)
				{
					if(window.bugHandler.bugBigTime > 3)
					{
						window.bugHandler.bugBigTime -= 1;
					}
					if(window.bugHandler.bugMedTime > 3)
					{
						window.bugHandler.bugMedTime -= 1;
					}
					if(window.bugHandler.bugSmallTime > 3)
					{

						window.bugHandler.bugSmallTime -= 1;
					}
				}
	        	}
		}, 1000);
	},

//set bug animation based on bug type
	setBugAnimation : function(animateId, bugType) {
		switch(bugType) {
			case "Big":
				$(animateId).attr("dur", window.bugHandler.bugBigTime);
		        	break;
		        case "Small":
				$(animateId).attr("dur", window.bugHandler.bugSmallTime);
			        break;
		        case "Med":
				$(animateId).attr("dur", window.bugHandler.bugMedTime);
			        
		}
		$(animateId).attr("path", window.bugHandler.randomizePath());
	},

//generate random path for animation
	randomizePath : function() {
	//Generate y coordinate for entry: range(0,windowHeight)
		var y1 = Math.floor(Math.random()*(window.bugHandler.contentHeight+1));
		var path="M 0,"+y1;
		var prevX = 0;		
		var xgradient = window.bugHandler.contentWidth / (window.bugHandler.pathPoints+1);
		for(i=0; i<window.bugHandler.pathPoints; ++i)
		{
//We could randomize x with :			
//			var x = Math.floor(Math.random()*(window.bugHandler.contentWidth-prevX+1)+prevX);
			var x = prevX + xgradient;
			var y = Math.floor(Math.random()*(window.bugHandler.contentHeight+1));
			
			path = path+" L"+x+","+y;
			prevX = x;
		}

	//Generate y coordinate for exit: range(0,windowHeight)
		var y2 = Math.floor(Math.random()*(window.bugHandler.contentHeight+1));
		path = path+" L"+window.bugHandler.contentWidth+","+y2;
		return path;
	},

	displayDiv : function(divId){
		$("#content").hide();
		$(divId).show();
	},

	loadGame : function() {
		window.bugHandler.showGameOrHome("#div_game");
		window.bugHandler.displayDiv("#content");
		window.bugHandler.initBugs();		
	},

//Show game or home page
	showGameOrHome : function(divId){
		$("#div_welcome").slideToggle(1000);
		$("#div_game").slideToggle(1000);
		$("#alert_gameOver").modal('hide');
	},

//Check if current score is in top n scores
	isHighScore : function(newScore){
		if(window.bugHandler.highScores.length < window.def.getHighScoresToStore())
		{
			return true;
		}
		if(window.bugHandler.highScores[window.def.getHighScoresToStore() - 1].score < newScore)
		{
			return true;
		}
		return false;
	},

//Add to the array of high scores and keep it sorted
	addToHighScores : function(){
		var player = $("input:text").val();
		if(window.bugHandler.highScores.length == 10)
		{
			window.bugHandler.highScores[9]={username:player, score:window.bugHandler.getScore(), time:window.bugHandler.currentTime};
		}
		else{
			window.bugHandler.highScores[window.bugHandler.highScores.length]={username:player, score:window.bugHandler.getScore(), time:window.bugHandler.currentTime};
		}
		window.bugHandler.highScores.sort(function(a, b){
	        	return b.score-a.score;
		})
		$("#alert_gameOver").modal('hide');
		window.bugHandler.displayHighScores();
	},

//display high scores in a table
	displayHighScores : function(){
		$("#tbl_highScores tbody").empty();
		for(var i=0; i<window.bugHandler.highScores.length; ++i)
		{
			$('#tbl_highScores tbody').append('<tr><td>'+window.bugHandler.highScores[i].username+'</td><td>'+window.bugHandler.highScores[i].score+'</td><td>'+window.bugHandler.highScores[i].time+'</td></tr>');
	
		}
		window.bugHandler.showGameOrHome("#div_welcome");
	}

};
