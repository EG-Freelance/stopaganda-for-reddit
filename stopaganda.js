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
        biasStyle = "background-color: rgb(0,185,175); color: white";
        break;
      case 'least biased':
        biasStyle = "background-color: rgb(0,150,0); color: white";
        break;
      case 'pro-science':
        biasStyle = "background-color: rgb(0,150,0); color: white";
        break;
      case 'right-center':
        biasStyle = "background-color: rgb(150,125,0); color: white";
        break;
      case 'right':
        biasStyle = "background-color: rgb(150,0,0); color: white";
        break;
      case 'questionable':
        biasStyle = "background-color: rgb(0,0,0); color: white";
        break;
      case 'conspiracy/pseudoscience':
        biasStyle = "background-color: rgb(0,0,0); color: white";
        break;
      case 'unlisted':
        biasStyle = "background-color: rgb(255,255,255); color: black";
        break;
      case 'satire':
        biasStyle = "background-color: rgb(200,0,200); color: white";
        break;      
      default:
        biasStyle = "background-color: rgb(0,0,0); color: white";
        break;
    }

    switch(sourceData['accuracy']){
      case 'very low':
        accStyle = "background-color: rgb(255,0,0); color: black";
        break;
      case 'low':
        accStyle = "background-color: rgb(255,100,0); color: white";
        break;
      case 'mixed':
        accStyle = "background-color: rgb(225,175,0); color: white";
        break;
      case 'mostly factual':
        accStyle = "background-color: rgb(175,200,0); color: white";
        break;
      case 'high':
        accStyle = "background-color: rgb(125,150,0); color: white";
        break;
      case 'very high':
        accStyle = "background-color: rgb(0,150,0); color: white";
        break;
      case 'unlisted':
        accStyle = "background-color: rgb(255,255,255); color: black";
        break;
      case 'satire':
        accStyle = "background-color: rgb(200,0,200); color: white";
        break;      
      default:
        accStyle = "background-color: rgb(0,0,0); color: white";
        break;
    }
  }else{
    accStyle = "color: rgb(0,0,0)'";
    biasStyle = "color: rgb(0,0,0)'";
  }

  var decalOpSpan = document.createElement("span");

  // create opinion HTML
  if(opinion != null){
    decalOpSpan.classList.add('stopaganda-txt');
    decalOpSpan.style = "font-size: 75%; white-space: nowrap; background-color: darkgray; color: white; border-radius: 5px; padding-left: 3px; padding-right: 2px; margin-right: 2px"
    decalOpSpan.textContent = "OpEd";
  }else{
    decalOpSpan.textContent = ' ';  
  }

  if(sourceData == null){
    if(oldReddit){
      el[2].insertAdjacentElement('afterend', decalOpSpan);
      // el[2].outerHTML = html + opHTML;
    }else{
      el[0].insertAdjacentElement('afterend', decalOpSpan);
      // el[0].outerHTML = html + opHTML;
    }
    console.log('Source ' + el[1] + ' not identified in MBFC master list');
    return true;
  }else{
    // create DOM elements to add
    var decalLink = document.createElement("a");
    var decalAccSpan = document.createElement("span");
    var decalBiasSpan = document.createElement("span");
    // create acc HTML
    decalAccSpan.classList.add("stopaganda-txt");
    decalAccSpan.style = "font-size: 75%; white-space: nowrap; border-radius: 5px; padding-left: 3px; padding-right: 2px; margin-right: 5px; margin-left: 2px; " + accStyle;
    decalAccSpan.textContent = " Acc: " + sourceData['accuracy'].toUpperCase() + " ";
    // create bias HTML
    decalBiasSpan.classList.add("stopaganda-txt");
    decalBiasSpan.style = "font-size: 75%; white-space: nowrap; border-radius: 5px; padding-left: 3px; padding-right: 2px; margin-right: 5px; " + biasStyle;
    decalBiasSpan.textContent = " Bias: " + sourceData['bias'].toUpperCase() + " ";
    // create and populate link HTML
    decalLink.href = url;
    decalLink.target = "_blank";
    decalLink.setAttribute('onmouseover', "this.setAttribute('style', 'opacity: 0.3; text-decoration: none')");
    decalLink.setAttribute('onmouseout', "this.setAttribute('style', 'opacity: 1.0')");
    decalLink.appendChild(decalAccSpan);
    decalLink.appendChild(decalBiasSpan);
    decalLink.appendChild(decalOpSpan);

    if(oldReddit){
      el[2].insertAdjacentElement('afterend', decalLink);
    }else{
      el[0].insertAdjacentElement('afterend', decalLink);
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
    if(!oldReddit){
      if(document.querySelectorAll('[data-click-id=subreddit]').length == 0){
        return false;
      }
    }else{
      if(document.querySelectorAll('.subreddit').length == 0){
        return false;
      }
    }
    baseSubs = ['r/news', 'r/inthenews', 'r/worldnews', 'r/politics', 'r/canada', 'r/europe', 'r/unitedkingdom'];
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
      sourcesArray = sourcesArray.filter(function(e) { return e.parentElement.getElementsByClassName('subreddit')[0] != null }).filter(function(e) { return baseSubs.indexOf(e.parentElement.getElementsByClassName('subreddit')[0].text) >= 0 }); // 2020.03.22 - Deprecated for NOT Old Reddit --- 2019.07.24 - Deprecated; structure changed
    }

    var linkRegex = /(?:https?\:\/\/)?(?:www\.)?([A-Za-z0-9\_\-\.]+)\/?/;
    // run script to add decals to each target identified
    // [fullLink, baseLink, linkElement]
    var baseLinks = sourcesArray.map(function(e){ 
      link = e.querySelector('a');
      return [link, link.href.match(linkRegex)[1], e.querySelector('.domain')];
    });
  }else{
    var linkClass = ".styled-outbound-link";
    // NOTE: 2019-08-06 -- following commented line is for in case the class above becomes deprecated
    // var sources = document.querySelectorAll('[data-click-id=body] a[target=_blank]:not([data-click-id=timestamp]):not(.stopaganda)');
    // get link elements
    var sources = document.querySelectorAll(linkClass + ':not(.stopaganda)');
    // add stopaganda class to each element to make sure that script isn't run multiple times on the same element
    sources.forEach(function(e){ e.classList.add('stopaganda') });
    var sourcesArray = Array.from(sources);
    // get tags only for entries that identify as one of base subs if this is a collection page
    if(collection){
      sourcesArray = sourcesArray.filter(function(e) { return Array.from(e.parentElement.parentElement.querySelectorAll('[data-click-id=subreddit]')).filter(function(ee){ return ee.querySelector('img') == null })[0] != null } ).filter(function(e){ return baseSubs.indexOf(Array.from(e.parentElement.parentElement.querySelectorAll('[data-click-id=subreddit]')).filter(function(ee){ return ee.querySelector('img') == null })[0].text) >= 0 })
    }

    var linkRegex = /(?:https?\:\/\/)?(?:www\.)?([A-Za-z0-9\_\-\.]+)\/?/;
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
    case 'europe':
      var collection = false;
      break;
    case 'unitedkingdom':
      var collection = false;
      break;
    default:
      var collection = null;
      break;
  }
  if(!oldReddit){  
    // old Reddit doesn't have infinite scroll, so not necessary there

    // set target element's array in a way that won't raise an error if it doesn't exist
    var targetNodeClassName = Array.from(document.getElementsByTagName('div')).filter(function(el){ return el.children.length > 15 })[0].className; // Use this methodology to grab target element regardless of how Reddit changes class names -- 2019/06/13
    var targetNode = document.getElementsByClassName(targetNodeClassName);
    // var targetNode = document.getElementsByClassName('s34aip-0'); // test this symbol for new functionality - 2019/04/19
    // var targetNode = document.getElementsByClassName('s1rcgrht-0');
    if(targetNode.length == 0 || sourceHash == null){ // 2019-08-20 - make sure sourceHash is finished loading before trying to tag articles
      // node or sourceHash doesn't exist yet; wait 500ms and try again
      window.setTimeout(initObserver, 250);
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
    observer.observe(document.querySelector(".rpBJOHq2PR60pnwJlUyP0").parentElement, config);
  }
	// Run initial time on load
	run(sourceHash, oldReddit, collection);
}

// run initObserver whenever reddit location changes
prevURL = '';
prevNodeSet = document.querySelectorAll('[data-click-id=subreddit]').length;
setInterval(function(){
  currUrl = document.location.href;
  currNodeSet = document.querySelectorAll('[data-click-id=subreddit]').length;
  if((prevURL != currUrl) || (prevNodeSet != currNodeSet)){
    initObserver();
    prevURL = currUrl;
    prevNodeSet = currNodeSet;
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
}).then(function(){
  initObserver();
});