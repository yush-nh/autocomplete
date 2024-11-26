export default function createResultElement(item, i, onRender) {
  const resultElement = document.createElement('li')
  resultElement.classList.add('autocomplete-item')

  if (typeof item === 'object' && item !== null) {
    for (const [key, value] of Object.entries(item)) {
      resultElement.dataset[key] = value
    }
  } else {
    resultElement.dataset.value = item
  }

  resultElement.dataset.index = i
  resultElement.textContent = onRender(item)
  return resultElement
}
