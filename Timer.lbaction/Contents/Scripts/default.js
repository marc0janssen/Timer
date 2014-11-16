
function runWithString(string) {
  return go(string);
}

function runWithItem(item) {
  return go(item.title);
}

function getDelay(time){

	var parts = time.split(':');
	
	if (parts.length == 2){var seconds = 0;}
	else{var seconds = parseInt(parts[2]);}

  	var d = new Date();
    var compareDate = new Date(d.getFullYear(), d.getMonth(), d.getDate(), parseInt(parts[0]), parseInt(parts[1]), seconds, 00);
    var diff = (compareDate - new Date())/1000;   
    
    if (diff < 0) {diff = 24*60*60 + diff;} //Negative?

	var hrs = ~~(diff / 3600);
	var mins = ~~((diff % 3600) / 60);
	var secs = ~~(diff % 60);

	var delay = '';
	if (hrs > 0){delay = delay + hrs + 'h';}
	if (mins > 0){delay = delay + mins + 'm';}
	if (secs > 0){delay = delay + secs + 's';}
 
	return delay; 
}

function go(str) {
  if (!str || str == undefined || str.length == 0) {
    return {'title':'Reminder is empty','icon':'NotFound.icns'};
  }
  try {  
  
    var delay = '';
    var assumedDelay2 = '';
    var parts = str.split(' ');
    var assumedDelay1 = parts.pop();
    if (parts.length != 0) {assumedDelay2 = parts.shift();}
    var reminder = parts.join(' ');
    var pattDelay = /^[0-9]{1,3}[hms]{1}([0-9]{1,3}[ms]{1})?([0-9]{1,3}[s]{1})?$/i;
    var pattTime = /^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;

    if (pattDelay.test(assumedDelay1)){
    	delay = assumedDelay1;
    	reminder = assumedDelay2 + ' ' + reminder;

    } else if (pattDelay.test(assumedDelay2)){
		delay = assumedDelay2;
    	reminder = reminder + ' ' + assumedDelay1;
    	
    } else if (pattTime.test(assumedDelay1)){
    	delay = getDelay(assumedDelay1);
    	reminder = assumedDelay2 + ' ' + reminder;

    } else if (pattTime.test(assumedDelay2)){
    	delay = getDelay(assumedDelay2);
    	reminder = reminder + ' ' + assumedDelay1;

    } else {
    	LaunchBar.displayNotification({'title' : 'Timer','subtitle' : 'No delay set', 'string' : 'Please set a delay time'});
    	return[];
    }
     
	if (reminder == ' '){LaunchBar.displayNotification({'title' : 'Timer','subtitle' : 'No reminder set', 'string' : 'Please enter a message'});return[];}
    
    
    LaunchBar.displayNotification({'title' : 'Timer','subtitle' : 'Timer set in '+delay});
    
    LaunchBar.displayInLargeType({
      'title' : 'Don\'t forget',
      'string' : reminder,
      'sound' : 'Tink',
      'delay': delay
    });
    
  } catch (exception) {
    return {'title': 'Timer Error ' + exception};
  }
}



