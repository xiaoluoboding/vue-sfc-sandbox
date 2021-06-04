export const debounce = (fn: Function, n = 166) => {
  let handle: any
  return (...args: any[]) => {
    if (handle) clearTimeout(handle)
    handle = setTimeout(() => {
      fn(...args)
    }, n)
  }
}

export const logger = (msg: string) => {
  const styles = [
    'color: white',
    'background: #42b983',
    'margin-left: 4px',
    'padding: 2px 4px',
    'border-radius: 2px'
  ].join(';')
  console.log(
    msg,
    styles,
    ''
  )
}
