import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:8080/tests/views/test_obj_data.html')
})

test.describe('when data is array of objects', () => {
  test('it should be able to get values from result with same properties', async ({ page }) => {
    const input = page.locator('.autocomplete-input')
    await input.fill('sug')

    const suggestion = page.locator('.autocomplete li', { hasText: 'suggest11' })
    await suggestion.click()

    const anotherInput = page.locator('.another-input')
    await expect(input).toHaveValue('1')
    await expect(anotherInput).toHaveValue('suggest11')
  })
})
