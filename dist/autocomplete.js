function createResultElement(item, i, onRender) {
  const resultElement = document.createElement('li');
  resultElement.classList.add('autocomplete-item');

  if (typeof item === 'object' && item !== null) {
    for (const [key, value] of Object.entries(item)) {
      resultElement.dataset[key] = value;
    }
  } else {
    resultElement.dataset.value = item;
  }

  resultElement.dataset.index = i;
  resultElement.textContent = onRender(item);
  return resultElement
}

class ItemContainer {
  #inputElement
  #onRender
  #container

  constructor(inputElement, onRender) {
    this.#inputElement = inputElement;
    this.#onRender = onRender;
    this.#container = document.createElement('ul');
    this.#container.setAttribute('popover', 'auto');
    this.#container.classList.add('autocomplete');
    this.#container.style.margin = 0; // Clear popover default style.
    inputElement.parentElement.appendChild(this.#container);

    window.addEventListener('resize', this.#moveUnderInputElement.bind(this));
  }

  get element() {
    return this.#container
  }

  set items(items) {
    if (items.length > 0) {
      this.#container.innerHTML = '';
      const elements = items.map((item, i) => createResultElement(item, i, this.#onRender));
      this.#container.append(...elements);
      this.#moveUnderInputElement();
      this.#container.showPopover();
    } else {
      this.#container.hidePopover();
    }
  }

  highlight(index) {
    this.#unhighlight(); // Clear previous highlight.

    const target = this.#container.querySelector(`li:nth-child(${index + 1})`);

    if (target) {
      target.classList.add('autocomplete-item-highlighted');
    }
  }

  #moveUnderInputElement() {
    const rect = this.#inputElement.getBoundingClientRect();

    Object.assign(this.#container.style, {
      position: 'absolute',
      top: `${rect.bottom + window.scrollY}px`,
      left: `${rect.left + window.scrollX}px`
    });
  }

  #unhighlight() {
    const target = this.#container.querySelector('.autocomplete-item-highlighted');

    if (target) {
      target.classList.remove('autocomplete-item-highlighted');
    }
  }
}

class AutocompleteModel {
  #onTermChange
  #onItemsChange
  #onHighlightIndexChange
  #termMinLength
  #term = ''
  #items = []
  #highlightedIndex = -1

  constructor(onTermChange, onItemsChange, onHighlightIndexChange, minLength) {
    this.#onTermChange = onTermChange;
    this.#onItemsChange = onItemsChange;
    this.#onHighlightIndexChange = onHighlightIndexChange;
    this.#termMinLength = minLength;
  }

  get term() {
    return this.#term
  }

  set term(value) {
    this.#term = value;

    if (this.#term.length >= this.#termMinLength) {
      this.#onTermChange(this.#term);
    } else {
      this.clearItems();
    }
  }

  get itemsCount() {
    return this.#items.length
  }

  get hasItems() {
    return this.#items.length > 0
  }

  get hasNoItems() {
    return this.#items.length === 0
  }

  set items(value) {
    this.#items = value;
    this.clearHighlight();
    this.#onItemsChange(this.#items);
  }

  get highlightedIndex() {
    return this.#highlightedIndex
  }

  set highlightedIndex(value) {
    this.#highlightedIndex = value;
    this.#onHighlightIndexChange(this.#highlightedIndex);
  }

  clearItems() {
    this.items = [];
  }

  clearHighlight() {
    this.highlightedIndex = -1;
  }

  moveHighlightIndexPrevious() {
    const isItemHighlighted = this.highlightedIndex >= 0;

    if (isItemHighlighted) {
      this.highlightedIndex--;
    } else {
      this.highlightedIndex = this.itemsCount - 1;
    }
  }

  moveHighlightIndexNext() {
    const hasNextItem = this.highlightedIndex < this.itemsCount - 1;

    if (hasNextItem) {
      this.highlightedIndex++;
    } else {
      this.clearHighlight();
    }
  }
}

class Autocomplete {
  #onSelect
  #itemContainer
  #model

  constructor({
    inputElement,
    onSearch,
    onSelect,
    onRender = (item) => item,
    minLength = 3
  }) {
    this.#onSelect = onSelect;
    this.#itemContainer = new ItemContainer(inputElement, onRender);

    this.#model = new AutocompleteModel(
      (term) => onSearch(term, (results) => (this.#model.items = results)),
      (items) => (this.#itemContainer.items = items),
      (index) => this.#itemContainer.highlight(index),
      minLength
    );

    this.#setEventHandlersToInput(inputElement);
    this.#setEventHandlersToItemsContainer(this.#itemContainer.element);
  }

  #setEventHandlersToInput(element) {
    element.addEventListener('input', ({ target }) => this.#model.term = target.value);
    element.addEventListener('keydown', (event) => this.#handleKeydown(event));
    element.addEventListener('keyup', (event) => this.#handleKeyup(event));
  }

  #setEventHandlersToItemsContainer(element) {
    this.#delegate(element, 'mousedown', 'li', ({ delegateTarget }) => {
      this.#onSelect(delegateTarget.dataset);
      element.hidePopover();
    });

    this.#delegate(element, 'mouseover', 'li', ({ delegateTarget }) => {
      this.#model.highlightedIndex = Number(delegateTarget.dataset.index);
    });

    this.#delegate(element, 'mouseout', 'li', () => {
      this.#model.clearHighlight();
    });
  }

  #delegate(element, event, selector, callback) {
    element.addEventListener(event, ({ target }) => {
      const delegateTarget = target.closest(selector);
      if (delegateTarget) {
        callback({ delegateTarget });
      }
    });
  }

  #handleKeydown(event) {
    if (this.#model.hasNoItems) return

    switch (event.key) {
      case 'ArrowDown':
        this.#model.moveHighlightIndexNext();
        break

      case 'ArrowUp':
        this.#model.moveHighlightIndexPrevious();
        break

      case 'Tab':
        event.preventDefault();
        if (event.shiftKey) {
          this.#model.moveHighlightIndexPrevious();
        } else {
          this.#model.moveHighlightIndexNext();
        }
        break

      case 'Escape':
        event.preventDefault();
        this.#model.clearItems();
        break
    }
  }

  #handleKeyup(event) {
    if (event.key === 'Enter' && this.#model.hasItems) {
      event.stopPropagation();

      const currentItem = document.querySelector('.autocomplete-item-highlighted');

      if (currentItem) {
        this.#onSelect(currentItem.dataset);
      }

      this.#model.clearItems();
    }
  }
}

export { Autocomplete as default };
