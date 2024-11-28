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

test.describe('keyboard operation', () => {
  test.describe('when ArrowDown key pressed', () => {
    test('it highlight one suggestion below', async ({ page }) => {
      const input = page.locator('.autocomplete-input')
      await input.fill('sug')

      const firstSuggestion = page.locator('.autocomplete li').first()
      await expect(firstSuggestion).not.toHaveClass(/autocomplete-item-highlighted/)

      await input.focus()
      await page.keyboard.press('ArrowDown')

      await expect(firstSuggestion).toHaveClass(/autocomplete-item-highlighted/)
    })
  })

  test.describe('when ArrowUp key pressed', () => {
    test('it highlight one suggestion above', async ({ page }) => {
      const input = page.locator('.autocomplete-input')
      await input.fill('sug')

      const lastSuggestion = page.locator('.autocomplete li').last()
      await expect(lastSuggestion).not.toHaveClass(/autocomplete-item-highlighted/)

      await input.focus()
      await page.keyboard.press('ArrowUp')
      await expect(lastSuggestion).toHaveClass(/autocomplete-item-highlighted/)
    })
  })

  test.describe('when Tab key pressed', () => {
    test('it highlight one suggestion below', async ({ page }) => {
      const input = page.locator('.autocomplete-input')
      await input.fill('sug')

      const firstSuggestion = page.locator('.autocomplete li').first()
      await expect(firstSuggestion).not.toHaveClass(/autocomplete-item-highlighted/)

      await input.focus()
      await page.keyboard.press('Tab')
      await expect(firstSuggestion).toHaveClass(/autocomplete-item-highlighted/)
    })
  })

  test.describe('when Shift+Tab key pressed', () => {
    test('it highlight one suggestion above', async ({ page }) => {
      const input = page.locator('.autocomplete-input')
      await input.fill('sug')

      const lastSuggestion = page.locator('.autocomplete li').last()
      await expect(lastSuggestion).not.toHaveClass(/autocomplete-item-highlighted/)

      await input.focus()
      await page.keyboard.down('Shift')
      await page.keyboard.press('Tab')
      await expect(lastSuggestion).toHaveClass(/autocomplete-item-highlighted/)
    })
  })

  test.describe('when Enter key pressed while a suggestion highlighted', () => {
    test('it should applied in the input', async ({ page }) => {
      const input = page.locator('.autocomplete-input')
      await input.fill('sug')

      const firstSuggestion = page.locator('.autocomplete li').first()
      await expect(firstSuggestion).not.toHaveClass(/autocomplete-item-highlighted/)

      await input.focus()
      await page.keyboard.press('ArrowDown')
      await expect(firstSuggestion).toHaveClass(/autocomplete-item-highlighted/)

      const suggestionText = await firstSuggestion.textContent()
      await expect(suggestionText).toBe('suggest11')
      await page.keyboard.press('Enter')
      await expect(input).toHaveValue('suggest11')
    })
  })

  test.describe('when Escape key pressed', () => {
    test('it should hide suggestions', async ({ page }) => {
      const input = page.locator('.autocomplete-input')
      await input.fill('sug')

      const suggestionList = page.locator('.autocomplete')
      await expect(suggestionList).toBeVisible()

      await page.keyboard.press('Escape')
      await expect(suggestionList).toBeHidden()
    })
  })
})

test.describe('options', () => {
  test.describe('minLength', () => {
    test.describe('when not specifying minLength and input is less than 3 characters', () => {
      test('it should not display suggestions', async ({ page }) => {
        const input = page.locator('.autocomplete-input')
        await input.fill('su')

        const suggestions = page.locator('.autocomplete li')
        await expect(suggestions).toHaveCount(0)
      })
    })

    test.describe('when specifying minLength and input is less than minLength', () => {
      test('it should not display suggestions', async ({ page }) => {
        await page.goto('http://localhost:8080/tests/views/test_option.html')

        const input = page.locator('.autocomplete-input')
        await input.fill('sug')

        const suggestions = page.locator('.autocomplete li')
        await expect(suggestions).toHaveCount(0)
      })
    })
  })

  test.describe('onRender', () => {
    test.describe('when specifying onRender', () => {
      test('it should display with specified format', async ({ page }) => {
        await page.goto('http://localhost:8080/tests/views/test_option.html')

        const input = page.locator('.autocomplete-input')
        await input.fill('sugg')

        const firstSuggestion = page.locator('.autocomplete li').first()
        const suggestionText = await firstSuggestion.textContent()

        await expect(suggestionText).toBe('result: suggest11')
      })
    })
  })
})
