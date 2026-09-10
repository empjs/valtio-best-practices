import {mkdirSync, readFileSync} from 'node:fs'
import {afterEach, test as base, beforeEach, expect, type PlaywrightFixture} from '@rstest/playwright'
import type {Page} from 'playwright'

const baseURL = process.env.E2E_BASE_URL
const expectedVersion =
  process.env.E2E_EXPECTED_VERSION ?? JSON.parse(readFileSync('packages/valtio/package.json', 'utf8')).version
if (!baseURL) throw new Error('Run E2E with pnpm test:e2e or pnpm test:e2e:run')
const errors = new WeakMap<Page, string[]>()

beforeEach<PlaywrightFixture>(async ({page, onTestFailed, task}) => {
  const failures: string[] = []
  errors.set(page, failures)
  page.on('pageerror', error => failures.push(error.message))
  page.on('console', message => {
    if (message.type() === 'error') failures.push(message.text())
  })
  onTestFailed(async () => {
    mkdirSync('artifacts/e2e/screenshots', {recursive: true})
    await page.screenshot({path: `artifacts/e2e/screenshots/${task.id}.png`, fullPage: true})
  })
})

afterEach<PlaywrightFixture>(async ({page}) => {
  expect(errors.get(page)).toEqual([])
})

const routes = [
  ['/', 'Valtio Enhanced Store'],
  ['/manual', 'Store 方法使用手册'],
  ['/best-practices', '实战'],
  ['/use', '常规'],
  ['/collections', 'collections'],
  ['/subscribe', 'subscribe'],
  ['/performance', 'performance'],
]

for (const viewport of [
  {width: 1440, height: 1000},
  {width: 390, height: 844},
]) {
  const test = base.extend({
    playwright: {
      contextOptions: {viewport, colorScheme: 'light' as const},
      trace: {mode: 'retain-on-failure' as const, outputDir: 'artifacts/e2e/traces'},
    },
  })

  for (const [path, heading] of routes) {
    test(`${viewport.width}px: direct route and reload ${path}`, async ({page}) => {
      const response = await page.goto(`${baseURL}${path}`)
      expect(response?.status()).toBe(200)
      await expect(page.locator('h1')).toContainText(heading)
      await expect(page.getByRole('navigation', {name: '主导航'})).toBeVisible()
      const versionBadge = page.getByRole('navigation', {name: '主导航'}).locator('a[href="/"]').first().locator('span')
      await expect(versionBadge).toHaveText(`v${expectedVersion}`)
      if (viewport.width >= 640) await expect(versionBadge).toBeVisible()
      await page.reload()
      await expect(page.locator('h1')).toContainText(heading)
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
    })
  }

  test(`${viewport.width}px: global counters synchronize; local state stays isolated`, async ({page}) => {
    await page.goto(`${baseURL}/use`)
    const section = page.locator('section > div').filter({has: page.getByRole('heading', {name: '1. 常规用例'})})
    const counters = section.getByText(/^count: /)
    await expect(counters).toHaveText(['count: 0', 'count: 0', 'count: 0'])
    await section.getByRole('button', {name: '+1', exact: true}).first().click()
    await expect(counters).toHaveText(['count: 1', 'count: 1', 'count: 0'])
    await section.getByRole('button', {name: '+1', exact: true}).last().click()
    await expect(counters).toHaveText(['count: 1', 'count: 1', 'count: 1'])
  })

  test(`${viewport.width}px: history restores state and redo button availability`, async ({page}) => {
    await page.goto(`${baseURL}/use`)
    const section = page.locator('section > div').filter({has: page.getByRole('heading', {name: '2. 历史用例'})})
    for (const index of [0, 2]) {
      const increment = section.getByRole('button', {name: '+1', exact: true}).nth(index)
      const undo = section.getByRole('button', {name: '撤销', exact: true}).nth(index)
      const redo = section.getByRole('button', {name: '重做', exact: true}).nth(index)
      const counter = section.getByText(/^count: /).nth(index)
      await expect(redo).toBeDisabled()
      await increment.click()
      await expect(counter).toHaveText('count: 1')
      await increment.click()
      await expect(counter).toHaveText('count: 2')
      await undo.click()
      await expect(counter).toHaveText('count: 1')
      await expect(redo).toBeEnabled()
      await redo.click()
      await expect(counter).toHaveText('count: 2')
      await expect(redo).toBeDisabled()
    }
  })

  test(`${viewport.width}px: derived state updates reactively`, async ({page}) => {
    await page.goto(`${baseURL}/use`)
    const section = page.locator('section > div').filter({has: page.getByRole('heading', {name: '3. 派生用例'})})
    const sums = section.getByText(/^derived.sum:/)
    await expect(sums).toHaveText(['derived.sum: 3', 'derived.sum: 3', 'derived.sum: 3'])
    await section.getByRole('button', {name: 'a+1', exact: true}).first().click()
    await expect(sums).toHaveText(['derived.sum: 4', 'derived.sum: 4', 'derived.sum: 3'])
  })

  test(`${viewport.width}px: Map and Set mutations synchronize`, async ({page}) => {
    await page.goto(`${baseURL}/collections`)
    await page.getByRole('button', {name: "map.set('c', n+1)", exact: true}).first().click()
    const maps = page.locator('p[title^="Map ("]')
    await expect(maps.nth(0)).toContainText('c=1')
    await expect(maps.nth(1)).toContainText('c=1')
    await expect(maps.nth(2)).not.toContainText('c=1')
    await page.getByRole('button', {name: "tagSet.add('y')", exact: true}).first().click()
    const sets = page.locator('p[title^="Set ("]')
    await expect(sets.nth(0)).toHaveText('Set (2): x, y')
    await expect(sets.nth(1)).toHaveText('Set (2): x, y')
    await expect(sets.nth(2)).toHaveText('Set (1): x')
  })

  test(`${viewport.width}px: navigation, language and theme persist across reload`, async ({page}) => {
    await page.goto(baseURL)
    await page.getByRole('navigation').getByRole('link', {name: '常规', exact: true}).click()
    await expect(page).toHaveURL(`${baseURL}/use`)
    await expect(page.locator('h1')).toHaveText('常规')
    await page.getByRole('button', {name: '切换到深色', exact: true}).click()
    await expect(page.locator('html')).toHaveClass(/dark/)
    await page.getByRole('button', {name: '切换语言', exact: true}).click()
    await expect(page.locator('h1')).not.toHaveText('常规')
    const translated = await page.locator('h1').textContent()
    await page.reload()
    await expect(page.locator('h1')).toHaveText(translated!)
    await expect(page.locator('html')).toHaveClass(/dark/)
    mkdirSync('artifacts/e2e/screenshots', {recursive: true})
    await page.screenshot({path: `artifacts/e2e/screenshots/accepted-${viewport.width}.png`, fullPage: true})
  })
}
