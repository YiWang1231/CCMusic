// 给元素添加类名的函数
export function addClass(el, className) {
  // 是否已有此类名
  if (hasClass(el, className)) {
    // 是,返回
    return
  }
  // 否,以空格字符分割想元素的类名,赋给newClass
  let newClass = el.className.split(' ')
  // 将想添加的类名加入newClass中
  newClass.push(className)
  // 用空格分隔newClass并作为元素的类名
  el.className = newClass.join(' ')
}

// 判断元素是否有某类名的函数
export function hasClass(el, className) {
  let reg = new RegExp('(^|\\s+)' + className + '(\\s+|$)')
  return reg.test(el.className)
}

// set或get元素的属性值
export function getData(el, name, val) {
  const prefix = 'data-'
  name = prefix + name
  if (val) {
    return el.setAttribute(name, val)
  } else {
    return el.getAttribute(name)
  }
}

// 创建一个div
let elementStyle = document.createElement('div').style
// 检测浏览器支持
let vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }
  // 立即执行函数
  // 判断支持哪些css特性
  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }
  return false
})()

export function prefixStyle(style) {
  if (vendor === false) {
    return false
  }

  if (vendor === 'standard') {
    return style
  }
  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}