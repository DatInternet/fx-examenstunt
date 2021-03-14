$( "inject" ).each(function() {
  console.log($(this).attr("data-component"));
  $(this).load("components/" + $(this).attr("data-component") + ".html")
});

jQuery.fn.center = function(parent) {
  if (parent) {
      parent = this.parent();
  } else {
      parent = window;
  }
  this.css({
      "position": "absolute",
      "top": ((($(parent).height() - this.outerHeight()) / 2) + $(parent).scrollTop() + "px"),
      "left": ((($(parent).width() - this.outerWidth()) / 2) + $(parent).scrollLeft() + "px")
  });
return this;
}

// [GENERAL] Play Sound

function playSound(type) {
  audio = new Audio('assets/sounds/' + type + '.wav');

  audio.pause();
  audio.currentTime = 0;
  audio.play();
}

// [TASKBAR] Append Icon
nummertje = 1;

function appendTaskbar(id) {

  $('#VanRijn_Taskbar_Left').append('<div class="VanRijn_Taskbar_Item" id="VanRijn_Taskbar_' + id + nummertje + '"><div class="VanRijn_Taskbar_Icon" id="VanRijn_Taskbar_' + id + nummertje + '_Icon">');
  $('#VanRijn_Taskbar_' + id + nummertje + '_Icon').append('<img src="'+ id +'.png">');
  nummertje++
}

// [TASKBAR] Get and set time

Taskbar_Clock = document.getElementById("VanRijn_Taskbar_Clock");

function getTime() {
  return new Date().toLocaleTimeString('en-US', { hour12: false, hour: 'numeric', minute: 'numeric' }).toString();
}
  /*
function setTime() {
  var time = getTime();
  Taskbar_Clock.innerText = time;
}
  
setInterval( setTime , 1000);
setTime();
*/
// [TASKBAR] Get and set date

Taskbar_Date = document.getElementById("VanRijn_Taskbar_Date");

function setDate() {
  var d = new Date();
  var Loos_Months = new Array(12);
  Loos_Months[0] = "Jan";
  Loos_Months[1] = "Feb";
  Loos_Months[2] = "Maa";
  Loos_Months[3] = "Apr";
  Loos_Months[4] = "Mei";
  Loos_Months[5] = "Jun";
  Loos_Months[6] = "Jul";
  Loos_Months[7] = "Aug";
  Loos_Months[8] = "Sept";
  Loos_Months[9] = "Okt";
  Loos_Months[10] = "Nov";
  Loos_Months[11] = "Dec";
  
  var Current_Day = d.getDate();
  var Current_Month = Loos_Months[d.getDay()];
  var Current_Year = d.getFullYear();

  Taskbar_Date.innerText = Current_Day + "-" + Current_Month + "-" + Current_Year;
}

setInterval( setDate() , 1000);
setDate();

// [Notification]

var Notification_Counter = 0;

function CreateNotification(name, desc, icon, type){

  var Notification_Template = '<div class="notification" id="notification' + Notification_Counter + '" data-hover="false"><div class="notification_image_container"><img src="'+ icon +'.png"></div><div class="notification_text_container"><p style="font-weight: bold;">' + name +'</p><p style="color: #a5a5a5">'+ desc + '</p></div><div class="notification_button_container"><button class="notification_button" onclick="RemoveNotification('+ Notification_Counter +');"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048"><path d="M1115 1024l690 691-90 90-691-690-691 690-90-90 690-691-690-691 90-90 691 690 691-690 90 90z"/></svg></button><button class="notification_button"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048"><path d="M1955 1533l-931-930-931 930-90-90L1024 421l1021 1022z"/></svg></button></div></div>';
  
  //Maakt de notificatie
  $('#notification_container').append(NotificationTemplate({ counter: Notification_Counter, img: icon, name: name, desc: desc }));

  if (($('#VanRijn_ActionCenter_Notifications_' + icon).length)) {
    $('#VanRijn_ActionCenter_Notifications_' + icon).append(Notification_Template);
  } else {
    $('#VanRijn_ActionCenter_Notification_Container').append('<div id="VanRijn_ActionCenter_Notifications_' + icon + '"><div class="VanRijn_ActionCenter_Category"><span><img src="app.png">Application</span></div>');
    $('#VanRijn_ActionCenter_Notifications_' + icon).append(Notification_Template);
  }

  var ding = Notification_Counter;

  setTimeout(function() {
      if ($('#notification' + ding).attr('data-hover') == '20') {
        $('#notification' + ding).attr('data-needremove', 'true')
      } else {
        RemoveNotification(ding);
      }
  }, 4000);
  Notification_Counter++;
  setNotiCount()
  playSound(type);

}

function RemoveNotification(id) {

  $('#notification' + id).addClass("notification_remove");

  setTimeout(function() {
    $('#notification' + id).empty().remove();
  }, 600);
}

$('#notification_container').on('mouseenter', '.notification', function(){
  $( this ).attr('data-hover', '20');      
});

$('#notification_container').on('mouseleave', '.notification', function(){
  var test = '#' + $(this).attr("id");
  var id = test.slice(test.length - 1)
  if ($(this).attr('data-needremove') == 'true') {
    setTimeout(function() {
      RemoveNotification(id)
    }, 1600);
  } else {
    $( this ).attr('data-hover', 'false');
  }    
});

function setNotiCount() {
  var count = $("#notification_container .notification").length;
  if (count == 0) {
    $('#VanRijn_Taskbar_ActionCenter_Count span').text("");
    $("#VanRijn_Taskbar_ActionCenter_Count").css("display", "none"); 
    $('#VanRijn_Taskbar_ActionCenter_Icon_Filled').removeClass("VanRijn_Taskbar_ActionCenter_Icon_Filled_Show");
  } else {
    $('#VanRijn_Taskbar_ActionCenter_Count span').text(count);
    $("#VanRijn_Taskbar_ActionCenter_Count").css("display", "block"); 
    $('#VanRijn_Taskbar_ActionCenter_Icon_Filled').addClass("VanRijn_Taskbar_ActionCenter_Icon_Filled_Show");
  }

}

setInterval( setNotiCount , 1000);
setNotiCount();

// Templates

var WinCount = 0;

var NotificationTemplate = Handlebars.compile('<div class="notification" id="notification{{counter}}" data-hover="false"><div class="notification_image_container"><img src="{{img}}.png"></div><div class="notification_text_container"><p style="font-weight: bold;">{{name}}</p><p style="color: #a5a5a5">{{desc}}</p></div><div class="notification_button_container"><button class="notification_button" onclick="RemoveNotification({{counter}});"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048"><path d="M1115 1024l690 691-90 90-691-690-691 690-90-90 690-691-690-691 90-90 691 690 691-690 90 90z"/></svg></button><button class="notification_button"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048"><path d="M1955 1533l-931-930-931 930-90-90L1024 421l1021 1022z"/></svg></button></div></div>');


// a

function makeWin() {
  
  var Wincount1 = WinCount;
  WinCount++
  var TWindow = '<div class="VanRijn_Window_Container" id="App'+ Wincount1 +'" style="top: 40%; left: 55%"><div class="VanRijn_Window_Titlebar"><span class="VanRijn_Window_Titlebar_Title"><img src="app.png">VanRijn Verkenner</span><div class="VanRijn_Window_Titlebar_Controls"><button><i class="mi mi-ChromeMinimize"></i> </button><button class="VanRijn_Window_Titlebar_Controls_Maximize"><i class="mi mi-ChromeMaximize"></i></button><button class="VanRijn_Window_Titlebar_Controls_Close"><i class="mi mi-ChromeClose"></i> </button></div></div><div class="VanRijn_Window_Content">test</div></div>'
  $( "body" ).prepend( TWindow );
  $("#App" + Wincount1).center(true);
  $( ".VanRijn_Window_Container" ).draggable({ handle: ".VanRijn_Window_Titlebar", containment: "#VanRijn_Window_Container", scroll: false });
}

function virus() {
  
  var Wincount1 = WinCount;
  WinCount++
  var TWindow = '<div class="VanRijn_Window_Container" id="App'+ Wincount1 +'" style="top: 40%; left: 55%"><div class="VanRijn_Window_Titlebar"><span class="VanRijn_Window_Titlebar_Title"><img src="app.png">VanRijn Verkenner</span><div class="VanRijn_Window_Titlebar_Controls"><button><i class="mi mi-ChromeMinimize"></i> </button><button class="VanRijn_Window_Titlebar_Controls_Maximize"><i class="mi mi-ChromeMaximize"></i></button><button class="VanRijn_Window_Titlebar_Controls_Close"><i class="mi mi-ChromeClose"></i> </button></div></div><div class="VanRijn_Window_Content">test</div></div>'

  $( "body" ).prepend( TWindow );
  //var winWid = $( window ).width();
  //var winHei = $( window ).height();
  //var posx = (Math.random() * 10 < 5 ? "-" : "+") + Math.random() * 100 + "px";
  //var posy = (Math.random() * 10 < 5 ? "-" : "+") + Math.random() * 100 + "px";
  //var randomPos = "left" + (Math.random() * 10 < 5 ? "-" : "+") + Math.random() * 100 + " " + "top" + (Math.random() * 10 < 5 ? "-" : "+") + Math.random() * 100;
  //$("#App" + Wincount1).css({top: posy, left: posx});
  $("#App" + Wincount1).css({"left": Math.random() * window.outerWidth , "top": Math.random() * window.outerHeight});
  $( ".VanRijn_Window_Container" ).draggable({ handle: ".VanRijn_Window_Titlebar", containment: "#VanRijn_Window_Container", scroll: false });
  playSound('error');
  setTimeout(function (){
    virus()
  }, 250);

}

function makeWinDebugTheme() {
  
  var Wincount1 = WinCount;
  WinCount++
  var TWindow = '<div class="VanRijn_Window_Container" id="App'+ Wincount1 +'" style="width: 1400px;"><div class="VanRijn_Window_Titlebar"><span class="VanRijn_Window_Titlebar_Title"><img src="app.png">DEBUG Skin Viewer</span><div class="VanRijn_Window_Titlebar_Controls"><button><i class="mi mi-ChromeMinimize"></i> </button><button class="VanRijn_Window_Titlebar_Controls_Maximize"><i class="mi mi-ChromeMaximize"></i></button><button class="VanRijn_Window_Titlebar_Controls_Close"><i class="mi mi-ChromeClose"></i> </button></div></div><div class="VanRijn_Window_Content" id="VanRijn_Debug_Skin'+ Wincount1 +'"></div></div>'
  $( "body" ).prepend( TWindow );
  $( ".VanRijn_Window_Container" ).draggable({ handle: ".VanRijn_Window_Titlebar", containment: "#VanRijn_Window_Container" });
  addColor(Wincount1)
  $("#App" + Wincount1).center(true);
}

themecount = 1;

function addColor(winID) {
  $(" #VanRijn_Debug_Skin" + winID).append('<div class="Debug_ThemeBox VanRijn_Theme_' + themecount +'" id="'+ themecount +'">'+ themecount +'</div>');
  themecount++;
  if (themecount >= 49) {
    themecount = 1;
  } else {
    addColor(winID)
  }
}

/*$(function () {
  $(".VanRijn_Window_Titlebar_Controls_Maximize").click(function (e) {
    console.log(e.target.offsetParent.offsetParent.id)
  });
});*/

$(function () {
  $(document).on('click',".Debug_ThemeBox", function(e){
    CreateNotification('DEBUG Skin view', 'Theme nummer ' + e.target.id + ' is gekozen', 'app', 'sound')
    $("body").removeClass();
    $("body").addClass("VanRijn_Theme_" + e.target.id);
  });
});

$(function () {
  $(document).on('click',".VanRijn_Window_Titlebar_Controls_Maximize", function(e){
    console.log(e.target.offsetParent.parentNode.parentNode.id)
  });
});

$(function () {
  $(document).on('click',".VanRijn_Window_Titlebar_Controls_Close", function(e){
    id = "#" + e.target.offsetParent.parentNode.parentNode.id;
    document.getElementById(e.target.offsetParent.parentNode.parentNode.id).classList.add("VanRijn_Window_Out");
    setTimeout(function (){
      $(id).empty();
      $(id).remove();
      console.log(id);
    }, 400);
  });
});