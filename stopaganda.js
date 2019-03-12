// function to add decal to target element
function updateHTML(el, sourceHash, oldReddit){
  var sourceMatch = el[1];
  // dig one level deeper for domain if no match exists in sourceHash
  if(sourceHash[sourceMatch] != null){
    var sourceData = sourceHash[sourceMatch];
  }else{
    var sourceMatch = sourceMatch.match(/(?:.*?)\.(.*)/)[1];
    var sourceData = sourceHash[sourceMatch];
  }
  
  // unsure whether to include "blog" in regex -- better to have false negatives or false positives?
  var opRegex = /opinion/;
  var opinion = el[0].href.match(opRegex);
  if(oldReddit){
    var html = el[2].outerHTML;
  }else{
    var html = el[0].outerHTML;
  }

  if(sourceData != null){
    if(sourceData['href'] != "NO URL FOUND"){
      var url = sourceData['href'];
    }else{
      var url = '#';
    }
    switch(sourceData['bias']){
      case 'left':
        biasStyle = "background-color: rgb(0,0,150); color: white";
        break;
      case 'left-center':
        biasStyle = "background-color: rgb(0,200,200); color: white";
        break;
      case 'center':
        biasStyle = "background-color: rgb(0,150,0); color: white";
        break;
      case 'right-center':
        biasStyle = "background-color: rgb(150,125,0); color: white";
        break;
      case 'right':
        biasStyle = "background-color: rgb(150,0,0); color: white";
        break;
      case 'fake-news':
        biasStyle = "background-color: rgb(255,0,0); color: white";
        break;
      case 'conspiracy':
        biasStyle = "background-color: rgb(255,0,0); color: white";
        break;
      case 'pro-science':
        biasStyle = "background-color: rgb(0,150,0); color: white";
        break;
      default:
        biasStyle = "background-color: rgb(0,0,0); color: white";
        break;
    }

    switch(sourceData['accuracy']){
      case 'VERY LOW':
        accStyle = "background-color: rgb(150,0,0); color: white";
        break;
      case 'LOW':
        accStyle = "background-color: rgb(150,125,0); color: white";
        break;
      case 'MIXED':
        accStyle = "background-color: rgb(200,200,0); color: white";
        break;
      case 'HIGH':
        accStyle = "background-color: rgb(125,150,0); color: white";
        break;
      case 'VERY HIGH':
        accStyle = "background-color: rgb(0,150,0); color: white";
        break;
      case 'FAKE':
        accStyle = "background-color: rgb(255,0,0); color: white";
        break;
      default:
        accStyle = "background-color: rgb(0,0,0); color: white";
        break;
    }
  }else{
    accStyle = "color: rgb(0,0,0)'";
    biasStyle = "color: rgb(0,0,0)'";
  }

  if(opinion != null){
    opHTML = "<span class='stopaganda-txt' style='font-size: 75%; white-space: nowrap; background-color: darkgray; color: white; border-radius: 5px'>&nbsp;OpEd&nbsp;</span>";
  }else{
    opHTML = " ";
  }

  if(sourceData == null){
    if(oldReddit){
      el[2].outerHTML = html + opHTML;
    }else{
      el[0].outerHTML = html + opHTML;
    }
    console.log('Source ' + el[1] + ' not identified in MBFC master list');
    return true;
  }else{
    if(oldReddit){
      el[2].outerHTML = " " + html + "&nbsp;<a href='" + url + "' target='_blank'><span class='stopaganda-txt' style='font-size: 75%; white-space: nowrap; " + accStyle + "; border-radius: 5px'>&nbsp;Acc: " + sourceData['accuracy'] + "&nbsp;</span>&nbsp;<span class='stopaganda-txt' style='font-size: 75%; white-space:nowrap; " + biasStyle + "; border-radius: 5px;'>&nbsp;Bias:&nbsp;" + sourceData['bias'].toUpperCase() + "&nbsp;</span>&nbsp;" + opHTML + "</a>&nbsp;";
    }else{
      el[0].outerHTML = " " + html + "&nbsp;<a href='" + url + "' target='_blank'><span class='stopaganda-txt' style='font-size: 75%; white-space: nowrap; " + accStyle + "; border-radius: 5px'>&nbsp;Acc: " + sourceData['accuracy'] + "&nbsp;</span>&nbsp;<span class='stopaganda-txt' style='font-size: 75%; white-space:nowrap; " + biasStyle + "; border-radius: 5px;'>&nbsp;Bias:&nbsp;" + sourceData['bias'].toUpperCase() + "&nbsp;</span>&nbsp;" + opHTML + "</a>&nbsp;";
    }
    return true;
  }
}

// function to identify target elements
function run(sourceHash, oldReddit, collection){
  if(collection == null){
    // if null, the script isn't meant for this page
    return false;
  }
  // set base subreddits for which tagging is relevant
  if(collection){
    baseSubs = ['r/news', 'r/inthenews', 'r/worldnews', 'r/politics', 'r/canada'];
  }
  if(oldReddit){
    var linkParentClass = "p.title";
    // get link element parents
    var sources = document.querySelectorAll(linkParentClass + ':not(.stopaganda)');
    // add stopaganda class to each element to make sure that script isn't run multiple times on the same element
    sources.forEach(function(e){ e.classList.add('stopaganda') });
    var sourcesArray = Array.from(sources);
    // get tags only for entries that identify as one of base subs if this is a collection page
    if(collection){
      sourcesArray = sourcesArray.filter(function(e) { return e.parentElement.getElementsByClassName('subreddit')[0] != null }).filter(function(e) { return baseSubs.indexOf(e.parentElement.getElementsByClassName('subreddit')[0].text) >=0 });
    }

    var linkRegex = /https?\:\/\/(?:www\.)?(.*?)\//;
    // run script to add decals to each target identified
    // [fullLink, baseLink, linkElement]
    var baseLinks = sourcesArray.map(function(e){ 
      link = e.querySelector('a');
      return [link, link.href.match(linkRegex)[1], e.querySelector('.domain')];
    });
  }else{
    var linkClass = ".b5szba-0";
    // get link elements
    var sources = document.querySelectorAll(linkClass + ':not(.stopaganda)');
    // add stopaganda class to each element to make sure that script isn't run multiple times on the same element
    sources.forEach(function(e){ e.classList.add('stopaganda') });
    var sourcesArray = Array.from(sources);
    // get tags only for entries that identify as one of base subs if this is a collection page
    if(collection){
      sourcesArray = sourcesArray.filter(function(e) { return e.parentElement.parentElement.getElementsByClassName('s1i3ufq7-0')[0] != null } ).filter(function(e){ return baseSubs.indexOf(e.parentElement.parentElement.getElementsByClassName('s1i3ufq7-0')[0].text) >= 0 })
    }

    var linkRegex = /https?\:\/\/(?:www\.)?(.*?)\//;
    // run script to add decals to each target identified
    // [fullLink, baseLink, placeholder for oldReddit]
    var baseLinks = sourcesArray.map(function(e){ return [e, e.href.match(linkRegex)[1], null] });
  }
  
  baseLinks.forEach(function(e){
    updateHTML(e, sourceHash, oldReddit);
  });
}

// Wait until page is fully loaded then define observer
function initObserver(){
  // define whether page is old or new layout
  var oldReddit = document.getElementById('header-bottom-left') != null;
  // define which subreddit/root is loaded
  var url = document.location.href
  var parsedUrl = url.match(/reddit.com(?:\/r\/(.*?)(?:\/|$))?/);
  switch(parsedUrl[1]){
    case undefined:
      var collection = true;
      break;
    case 'all':
      var collection = true;
      break;
    case 'news':
      var collection = false;
      break;
    case 'politics':
      var collection = false;
      break;
    case 'worldnews':
      var collection = false;
      break;
    case 'inthenews':
      var collection = false;
      break;
    case 'canada':
      var collection = false;
      break;
    default:
      var collection = null;
      break;
  }
  if(!oldReddit){
  
    // set target element's array in a way that won't raise an error if it doesn't exist
    var targetNode = document.getElementsByClassName('s1rcgrht-0');
    if(targetNode.length == 0){
      // node doesn't exist yet; wait 500ms and try again
      window.setTimeout(initObserver, 500);
      return;		
    }
    // set target element
    var targetEl = targetNode[0];
    // set config for observer
    var config = { childList: true };

    // create observer protocol
    var observer = new MutationObserver(function(mutationsList, observer){
      for(var mutation of mutationsList){
        run(sourceHash, oldReddit, collection);
      }
    });

    // instantiate observer
    observer.observe(targetEl, config);
  }
	// Run initial time on load
	run(sourceHash, oldReddit, collection);
}

// run initObserver whenever reddit location changes
prevURL = '';
setInterval(function(){
  if(prevURL != document.location.href){
    initObserver();
    prevURL = document.location.href;
  }
},1000);

// load initial observer after data are loaded
url = chrome.runtime.getURL('sources/sources.json');

var sourceHash;

async function getData(){
  const response = await fetch(url);
  const json = await response.json();

  return json
}

getData().then(json => {
  sourceHash = json;
  initObserver();
});