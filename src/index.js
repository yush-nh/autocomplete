import ItemContainer from "./itemContainer.js"
import AutocompleteModel from "./autocompleteModel.js"

export default class Autocomplete {
  #onSelect
  #itemContainer
  #model

  constructor(inputElement, onSearch, onSelect, onRender = (item) => item, minLength = 3) {
    this.#onSelect = onSelect
    this.#itemContainer = new ItemContainer(inputElement, onRender)

    this.#model = new AutocompleteModel(
      (term) => onSearch(term, (results) => (this.#model.items = results)),
      (items) => (this.#itemContainer.items = items),
      (index) => this.#itemContainer.highlight(index),
      minLength
    )

    this.#setEventHandlersToInput(inputElement)
    this.#setEventHandlersToItemsContainer(this.#itemContainer.element)
  }

  #setEventHandlersToInput(element) {
    element.addEventListener('input', ({ target }) => this.#model.term = target.value)
    element.addEventListener('keydown', (event) => this.#handleKeydown(event))
    element.addEventListener('keyup', (event) => this.#handleKeyup(event))
  }

  #setEventHandlersToItemsContainer(element) {
    this.#delegate(element, 'mousedown', 'li', ({ delegateTarget }) => {
      this.#onSelect(delegateTarget.textContent)
      element.hidePopover()
    })

    this.#delegate(element, 'mouseover', 'li', ({ delegateTarget }) => {
      this.#model.highlightedIndex = Number(delegateTarget.dataset.index)
    })

    this.#delegate(element, 'mouseout', 'li', () => {
      this.#model.clearHighlight()
    })
  }

  #delegate(element, event, selector, callback) {
    element.addEventListener(event, ({ target }) => {
      const delegateTarget = target.closest(selector)
      if (delegateTarget) {
        callback({ delegateTarget })
      }
    })
  }

  #handleKeydown(event) {
    if (this.#model.hasNoItems) return

    switch (event.key) {
      case 'ArrowDown':
        this.#model.moveHighlightIndexNext()
        break

      case 'ArrowUp':
        this.#model.moveHighlightIndexPrevious()
        break

      case 'Tab':
        event.preventDefault()
        if (event.shiftKey) {
          this.#model.moveHighlightIndexPrevious()
        } else {
          this.#model.moveHighlightIndexNext()
        }
        break

      case 'Escape':
        event.preventDefault()
        this.#model.clearItems()
        break
    }
  }

  #handleKeyup(event) {
    if (event.key === 'Enter' && this.#model.hasItems) {
      event.stopPropagation()

      const currentItem = document.querySelector('.autocomplete-item-highlighted')

      if (currentItem) {
        this.#onSelect(currentItem.textContent)
      }

      this.#model.clearItems()
    }
  }
}
