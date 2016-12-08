console.log('loaded');

// function genericOnClick(info, tab) {
//   console.log("item " + info.menuItemId + " was clicked");
//   console.log("info: " + JSON.stringify(info));
//   console.log("tab: " + JSON.stringify(tab));
// }


// var parent = chrome.contextMenus.create({"title": "Test parent item"});
// var child1 = chrome.contextMenus.create(
//   {"title": "Child 1", "parentId": parent, "onclick": genericOnClick});

// var item = chrome.contextMenus.create({title: "Wipe this", onclick: pinkify});


// var pinkify = function(info, tab) {
//  console.log(tab);
//  chrome.tabs.executeScript({
//    code: 'console.log("item!")',
//    file: 'listener.js'
//  });

// }
// var subMenus = []

// var TEMPCOUNTER = 0

var menuParent = 'translucify';
var mainMenu = function() {
  return  {
    title: 'Translucify this', 
    contexts: ['all'],
    id: menuParent
   };
 }


// Set up context menu at install time.
chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create(mainMenu());  
});

// add click event
chrome.contextMenus.onClicked.addListener(function(info, tab) {
  console.log('click handler', info, tab);
//  chrome.tabs.sendMessage(tab.id, {menu: menuParent});
//  // chrome.contextMenus.removeAll(function() {
//    // console.log('removed')
//    chrome.contextMenus.create({
//      title: 'hello',
//      contexts:  ['all'],
//      id: 'hello-context',
//      parentId: menuParent
//    })
//  // }
});

var elHandler = function(tab, el) {
  console.log(this, el, tab); 

  chrome.runtime.sendMessage({id: 'remove-item'});

}

console.log(chrome)


chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  console.log('HEARD', msg, sender);  
  if (msg.id !== 'item-list') {
    return;
  }

  chrome.tabs.sendMessage(sender.tab.id, {msg: "message from above"});

  var menus = msg.items.map(function(item, n) {
    return {
      title: item.tag,
      contexts: ['all'],
      id: `submenu-${n}`,
      parentId: menuParent    }
  })
  menus.unshift(mainMenu());
  console.log(menus);

  chrome.contextMenus.removeAll(function() {
    menus.forEach(function(menu) {
      chrome.contextMenus.create(menu)
        // .onClicked(elHandler.bind(null, sender.tab.id, menu.element));
    })
  });

  // chrome.contextMenus.create({
 //   title: 'Translucify this', 
 //   contexts: ['all'],
 //    id: menuParent
 //   })  

  // msg.items.map(function(item) {
  //  console.log(item);    
  //  console.log(`submenu${TEMPCOUNTER++}`);
  //  chrome.contextMenus.create({
  //    title: item.tag,
  //    contexts: ['all'],
  //    id: `submenu${TEMPCOUNTER++}`,
  //    parentId: menuParent
  //  });
  // });
  // console.log(item, items)
  // item.style.pointerEvents = 'none';
  // item.style.userSelect = 'none';
  // item.style.opacity = 0.5;
})

// // The onClicked callback function.
// function onClickHandler(info, tab) {
//  // alert(JSON.stringify(info));
//  console.log(info, tab);
//   // var sText = info.selectionText;
//   // var url = "https://www.google.com/search?q=" + encodeURIComponent(sText);  
//   // window.open(url, '_blank');
// };
