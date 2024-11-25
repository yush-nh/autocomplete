export default function createResultElement(item, i, onRender) {
  const resultElement = document.createElement('li')
  resultElement.classList.add('autocomplete-item')

  resultElement.dataset.index = i
  resultElement.textContent = onRender(item)
  return resultElement
}
