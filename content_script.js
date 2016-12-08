console.log('Injected listener script');

(function() {
  var item;
  var items = [];
  
  document.addEventListener('mousedown', function(event) {
    let parent;
    if (event.button == 2) {
      item = event.target;
      parent = item;
      do {
        parent = parent.parentNode;
        items.push(parent);
      } while (parent)

      items = items.filter(n=>n && n.tagName).map(function(n) {
        return {
          tag: n.tagName.toLowerCase(),
          element: n,
          elementString: n.toString(),
          className: n.className
        };
      }).reverse();
      
      chrome.runtime.sendMessage({item: item, items: items, id: 'item-list'});
    }
  }, true);





  chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    console.log('in content script listener:', msg, sender); 
    // console.log(item, items)
//    item.style.pointerEvents = 'none';
//    item.style.userSelect = 'none';
//    item.style.opacity = 0.5;
  });
})();