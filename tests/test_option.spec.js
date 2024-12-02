import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:8080/tests/views/test_option.html')
})

test.describe('when specifying minLength and input is less than minLength', () => {
  test('it should not display suggestions', async ({ page }) => {
    const input = page.locator('.autocomplete-input')
    await input.fill('sug')

    const suggestions = page.locator('.popover-autocomplete-container li')
    await expect(suggestions).toHaveCount(0)
  })
})

test.describe('when specifying onRender', () => {
  test('it should display with specified format', async ({ page }) => {
    const input = page.locator('.autocomplete-input')
    await input.fill('sugg')

    const firstSuggestion = page.locator('.popover-autocomplete-container li').first()
    const suggestionText = await firstSuggestion.textContent()

    await expect(suggestionText).toBe('result: suggest11')
  })
})
