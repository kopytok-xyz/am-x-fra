export const symbolToElement = () => {
  const symbolToElement_elChecker = document.querySelectorAll('[symbol-to-element]');
  if(symbolToElement_elChecker.length){
    function escapeRegExp(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    }
    var symbols = document.querySelectorAll('[symbol-to-element]')
    var symbolMap = new Map()
    symbols.forEach(function(el) {
      var key = el.getAttribute('symbol-to-element')
      if (!symbolMap.has(key)) {
        symbolMap.set(key, el)
      }
    })
    var keys = Array.from(symbolMap.keys()).map(escapeRegExp)
    if (keys.length > 0) {
      var regex = new RegExp(keys.join("|"), "g")
      function replaceTextNode(textNode) {
        var text = textNode.nodeValue
        var fragment = document.createDocumentFragment()
        var lastIndex = 0
        text.replace(regex, function(match, offset) {
          fragment.appendChild(document.createTextNode(text.substring(lastIndex, offset)))
          fragment.appendChild(symbolMap.get(match).cloneNode(true))
          lastIndex = offset + match.length
        })
        fragment.appendChild(document.createTextNode(text.substring(lastIndex)))
        textNode.parentNode.replaceChild(fragment, textNode)
      }
      function traverseNodes(node) {
        if (node.nodeType === Node.TEXT_NODE) {
          if (node.nodeValue.match(regex)) {
            replaceTextNode(node)
          }
        } else {
          node.childNodes.forEach(function(child) {
            traverseNodes(child)
          })
        }
      }
      var contentEls = document.querySelectorAll('[symbol-to-icons-content]')
      contentEls.forEach(function(el) {
        traverseNodes(el)
      })
    }
  }
};
