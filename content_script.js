// Set up the element cache
window[chrome.runtime.id] = {};

(function() {
  let item;
  let items = [];
  const cache = window[chrome.runtime.id]

  /**
   * Returns a queryString style representation of a DOM element
   * Looks something like this:
   *     div#myid.class1.class2
   * @param  {object} el DOM element
   * @return {string}    tag#id.class1.class2
   */
  const queryStringify = function(el) {
    const id = (el.id) ? `#${el.id}` : '';
    const classes = (el.className) ? `.${el.className.replace(/\s/g, '.')}` : '';
    const dims = ` | ${el.offsetWidth}x${el.offsetHeight}`;
    return el.tagName.toLowerCase() + id + classes + dims;
  }

  /**
   * rfc4122 version 4 compliant uuid
   * from http://stackoverflow.com/a/2117523/503463
   * @return {string} uuid
   */
  const getUuid = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0;
      return ((c === 'x') ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  const omitTags = ['html', 'body'];

  document.addEventListener('mouseover', function(event) {
    let parent;
    item = event.target;
    parent = item;
    do {
      items.push(parent);
      parent = parent.parentNode;
    } while (parent);

    items = items
      .filter(n => n && n.tagName && omitTags.indexOf(n.tagName.toLowerCase()) === -1)
      .map(function(n) {
        const uuid = getUuid();

        cache[uuid] = n;

        return {
          tag: n.tagName.toLowerCase(),
          querySelector: queryStringify(n),
          uuid: uuid,
          className: n.className
        };
      });

    chrome.runtime.sendMessage({item: item, items: items, id: 'item-list'});
  });


  chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg.id !== 'hide-me') return;

    const el = cache[msg.key];
    el.style.pointerEvents = 'none';
    el.style.userSelect = 'none';
    el.style.opacity = 0.4;
    el.style.filter = 'blur(3px)';
  });
})();
