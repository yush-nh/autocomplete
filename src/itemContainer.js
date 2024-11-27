import createResultElement from './createResultElement.js'

export default class ItemContainer {
  #inputElement
  #onRender
  #container
  #resizeObserver

  constructor(inputElement, onRender) {
    this.#inputElement = inputElement
    this.#onRender = onRender
    this.#container = document.createElement('ul')
    this.#container.setAttribute('popover', 'manual')
    this.#container.classList.add('autocomplete')
    this.#container.style.margin = 0 // Clear popover default style.
    inputElement.parentElement.appendChild(this.#container)

    window.addEventListener('resize', this.#moveUnderInputElement.bind(this))
    this.#resizeObserver = new ResizeObserver(this.#moveUnderInputElement.bind(this))
    this.#resizeObserver.observe(inputElement.parentElement)
  }

  get element() {
    return this.#container
  }

  set items(items) {
    if (items.length > 0) {
      this.#container.innerHTML = ''
      const elements = items.map((item, i) => createResultElement(item, i, this.#onRender))
      this.#container.append(...elements)
      this.#moveUnderInputElement()
      this.#container.showPopover()
    } else {
      this.#container.hidePopover()
    }
  }

  highlight(index) {
    this.#unhighlight() // Clear previous highlight.

    const target = this.#container.querySelector(`li:nth-child(${index + 1})`)

    if (target) {
      target.classList.add('autocomplete-item-highlighted')
    }
  }

  #moveUnderInputElement() {
    const rect = this.#inputElement.getBoundingClientRect()

    Object.assign(this.#container.style, {
      position: 'absolute',
      top: `${rect.bottom + window.scrollY}px`,
      left: `${rect.left + window.scrollX}px`
    })
  }

  #unhighlight() {
    const target = this.#container.querySelector('.autocomplete-item-highlighted')

    if (target) {
      target.classList.remove('autocomplete-item-highlighted')
    }
  }
}
