var menuParentId = 'translucify';

/**
 * Chrome does something to mutate the menu object
 * so this function returns a newly created copy
 * of the top-most menu object
 */
var mainMenu = function() {
  return  {
    title: 'Translucify this',
    contexts: ['all'],
    id: menuParentId
  };
}


/**
 * Iniitalize the context menu
 */
chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create(mainMenu());
});


/**
 * Send message to content_script with the uuid of the element to hide
 */
chrome.contextMenus.onClicked.addListener(function(info, tab) {
  chrome.tabs.sendMessage(tab.id, {id: 'hide-me', key: info.menuItemId});
});


/**
 * Build the DOM element submenus
 */
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg.id !== 'item-list') return;

  var menus = msg.items.map(function(item, n) {
    return {
      title: item.querySelector,
      contexts: ['all'],
      id: item.uuid,
      parentId: menuParentId
    }
  })

  menus.unshift(mainMenu());

  chrome.contextMenus.removeAll(function() {
    menus.forEach(function(menu) {
      chrome.contextMenus.create(menu)
    })
  });
});
