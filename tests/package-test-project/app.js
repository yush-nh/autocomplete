import Autocomplete from "@ysh-nh/autocomplete"

const items = ['suggest11', 'suggest12', 'suggest21', 'suggest22']
const inputElement = document.querySelector('.autocomplete-input')

new Autocomplete({
  inputElement: inputElement,
  onSearch: (term, onResult) => {
    const results = items.filter((item) => item.includes(term))
    onResult(results)
  },
  onSelect: (result) => inputElement.value = result.value
})
