# autocomplete
An autocomplete library supporting top-layer display using the Popover API.

# How to use
Import autocomplete library to your project
```html
<script src="cdn url"></script>
```
or
```js
// ES6 modules
import Autocomplete from '@ysh-nh/autocomplete'
```
Prepare search data.   
This supports an array of strings or an array of objects.

```html
<body>
  <input class="autocomplete-input">

  <script>
    const items = ['suggest11', 'suggest12', 'suggest21', 'suggest22']
  </script>
<body>
```

Create new instance of Autocomplete with target input element.
```js
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
```
# Options
## inputElement (required)
The input element to attach the autocomplete functionality to.
example:
```js
inputElement: document.querySelector('.autocomplete-input')
```
## onSearch (required)
 Callback function for searching. Accepts `term` and `onResult` as arguments. Uses `term` to search and calls `onResult` with the results.   

 The search function to get results can be freely customized.  

example:
```js
onSearch: (term, onResult) => {
  const results = items.filter((item) => item.includes(term))
  onResult(results)
}
```
## onSelect (required)
Callback function executed when an item is selected.  

example:
```js
onSelect: (result) => inputElement.value = result.value
```
result is a dataset property.  
If you used an array of strings as data, the result can be retrieved from value.  
If you used an array of objects as data, the result can be retrieved from the property name of the data.
## onRender (optional)
Function to customize rendering of each item.  

example:
```js
onRender: (item) => `result: ${item.value}`
```
defaults to render only search result.
## minLength (optional)
Minimum number of characters required to start the search. Defaults to 3.

example:
```js
minLength: 4
```

# Run Tests
## E2E test
This project uses Playwright for testing. Follow the steps below to execute the tests.

### 1. Start the server
Before running the tests, need to start the local server.
```
npm run server
```

### 2. Run the tests
Once the server is running, you can execute the tests with the following command:
```
npm run test
```

## Package test
This project has an environment that allows you to test the operation of the package through npm.

### 1. Create the package
Run following command on the root directory.
```
npm pack
```
This command generates a `.tgz` package file.

### 2. Install package
Move to the package-test-project directory.
```
cd tests/package-test-project
```

Install package.
```
npm install ../../ysh-nh-autocomplete-1.0.0.tgz
```

### 3. Start the test server
On the package-test-project directory, run
```
npx vite
```

After starting the server, open `http://localhost:5173` in your browser to test and confirm the package works as expected.

If you have not updated source code, `npm pack` and `npm install` steps are not required.
