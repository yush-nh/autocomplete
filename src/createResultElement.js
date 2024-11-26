export default function createResultElement(item, i) {
  const resultElement = document.createElement('li')
  resultElement.classList.add('autocomplete-item')

  resultElement.dataset.index = i
  resultElement.textContent = item
  return resultElement
}
