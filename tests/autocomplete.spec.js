import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:8080/tests/views/test_str_data.html')
})

test.describe('basic operation', () => {
  test.describe('when input value matched', () => {
    test('it should display suggestions', async ({ page }) => {
      const input = page.locator('.autocomplete-input')
      await input.fill('suggest2')

      const suggestionList = page.locator('.autocomplete')
      await expect(suggestionList).toBeVisible()

      const suggestions = page.locator('.autocomplete li')
      await expect(suggestions).toHaveCount(2)
    })
  })

  test.describe('when input value does not matched', () => {
    test('it should not display suggestions', async ({ page }) => {
      const input = page.locator('.autocomplete-input')
      await input.fill('abc')

      const suggestionList = page.locator('.autocomplete')
      await expect(suggestionList).toBeHidden()
    })
  })

  test.describe('when suggestion hovered', () => {
    test('it should highlighted', async ({ page }) => {
      const input = page.locator('.autocomplete-input')
      await input.fill('sug')

      const suggestion = page.locator('.autocomplete li', { hasText: 'suggest11' })
      await suggestion.hover()

      await expect(suggestion).toHaveClass(/autocomplete-item-highlighted/)
    })
  })

  test.describe('when suggestion unhovered', () => {
    test('it should unhighlighted', async ({ page }) => {
      const input = page.locator('.autocomplete-input')
      await input.fill('sug')

      const suggestion = page.locator('.autocomplete li', { hasText: 'suggest11' })
      await suggestion.hover()
      await expect(suggestion).toHaveClass(/autocomplete-item-highlighted/)

      const body = page.locator('body')
      await body.hover()
      await expect(suggestion).not.toHaveClass(/autocomplete-item-highlighted/)
    })
  })

  test.describe('when suggestion clicked', () => {
    test('it should applied in the input', async ({ page }) => {
      const input = page.locator('.autocomplete-input')
      await input.fill('sug')

      const suggestion = page.locator('.autocomplete li', { hasText: 'suggest11' })
      await suggestion.click()

      await expect(input).toHaveValue('suggest11')
    })
  })

  test.describe('when interacted outside of suggestions', () => {
    test('it should hide suggestions', async ({ page }) => {
      const input = page.locator('.autocomplete-input')
      await input.fill('sug')

      const suggestionList = page.locator('.autocomplete')
      await expect(suggestionList).toBeVisible()

      await page.click('body')
      await expect(suggestionList).toBeHidden()
    })
  })

  test.describe('when data is array of objects', () => {
    test('it should be able to extract values from properties', async ({ page }) => {
      await page.goto('http://localhost:8080/tests/views/test_obj_data.html')

      const input = page.locator('.autocomplete-input')
      await input.fill('sug')

      const suggestion = page.locator('.autocomplete li', { hasText: 'suggest11' })
      await suggestion.click()

      const anotherInput = page.locator('.another-input')
      await expect(input).toHaveValue('1')
      await expect(anotherInput).toHaveValue('suggest11')
    })
  })
})
