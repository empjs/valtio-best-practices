import {useState} from 'react'
import {useT} from 'src/i18n'
import {Link} from 'wouter'
import {advantages, cards, docCardIcons, type InstallLabel, installCommands} from './config'

export function HomePage() {
  const t = useT()
  const [installTab, setInstallTab] = useState<InstallLabel>('pnpm')
  const [copied, setCopied] = useState(false)
  const activeCmd = installCommands.find(c => c.label === installTab)!

  const handleCopyInstall = async () => {
    const text = activeCmd.cmd
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
      } else {
        const ta = document.createElement('textarea')
        ta.value = text
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <main className="relative mx-auto max-w-6xl px-4 pt-4 pb-8 sm:pt-6 sm:pb-12">
      {/* 首页背景：蓝橙虚化色块 */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-blue-400/30 blur-[100px] dark:bg-blue-500/20 dark:blur-[120px]" />
        <div className="absolute -right-32 bottom-1/4 h-80 w-80 rounded-full bg-orange-400/30 blur-[100px] dark:bg-orange-500/20 dark:blur-[120px]" />
        <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-300/20 blur-[80px] dark:bg-blue-400/15 dark:blur-[100px]" />
      </div>
      {/* 标题区：蓝橙高斯模糊背景 + 蓝橙渐变底 + 标题蓝橙渐变字 */}
      <header className="relative mb-10 mt-10 overflow-hidden rounded-2xl text-center">
        {/* 蓝橙浮动模糊背景（参考 UI UX Pro Max：primary/accent + blur-3xl + animate-float） */}
        <div className="pointer-events-none absolute inset-0 -z-20" aria-hidden>
          <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-blue-500/30 blur-3xl animate-float dark:bg-blue-500/25" />
          <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-orange-500/20 blur-3xl animate-float dark:bg-orange-500/15" />
        </div>
        <div className="header-overlay-gradient" aria-hidden />
        <div className="relative px-6 py-10 sm:py-12">
          <h1 className="mx-auto mb-4 max-w-4xl text-center text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="hero-gradient-text">{t('home.heroTitle')}</span>
          </h1>
          <p className="mx-auto mb-4 max-w-2xl text-lg font-medium text-slate-800 dark:text-slate-200">
            {t('home.heroDesc')}
          </p>

          <p className="mx-auto mb-4 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {t('home.heroDeps')}
          </p>
          <div className="mx-auto max-w-2xl rounded-xl border border-slate-400/50 bg-slate-200/80 p-3 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-900/80 sm:p-4 flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-3">
            <div role="tablist" aria-label={t('home.installTabs')} className="flex shrink-0 flex-wrap gap-1 sm:gap-2">
              {installCommands.map(({label}) => {
                const isActive = installTab === label
                return (
                  <button
                    key={label}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`install-panel-${label}`}
                    id={`install-tab-${label}`}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => setInstallTab(label)}
                    className={`cursor-pointer rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${
                      isActive
                        ? 'border-slate-500 bg-slate-100 text-slate-800 dark:border-slate-500 dark:bg-slate-700 dark:text-slate-100'
                        : 'border-slate-500/50 bg-transparent text-slate-600 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:bg-slate-700/80'
                    }`}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
            <div
              role="tabpanel"
              id={`install-panel-${activeCmd.label}`}
              aria-labelledby={`install-tab-${activeCmd.label}`}
              className="relative min-w-0 flex-1"
            >
              <code className="block rounded-lg border border-slate-600/50 bg-slate-900/80 px-3 py-2 pr-12 font-mono text-sm text-slate-100 dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-200">
                {activeCmd.cmd}
              </code>
              <button
                type="button"
                onClick={handleCopyInstall}
                className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded text-slate-400 transition-colors duration-200 hover:text-slate-100 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 dark:text-slate-400 dark:hover:text-orange-300"
                aria-label={copied ? t('home.copied') : t('home.copy')}
              >
                {copied ? (
                  <svg
                    className="h-4 w-4 shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                ) : (
                  <svg
                    className="h-4 w-4 shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className="relative mb-12 sm:mb-16 text-center" aria-labelledby="advantages-heading">
        <h2 id="advantages-heading" className="mx-auto mb-2 max-w-2xl text-2xl font-semibold sm:text-3xl">
          <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-orange-500 bg-clip-text text-transparent dark:from-blue-400 dark:via-blue-300 dark:to-orange-400">
            {t('home.advantagesTitle')}
          </span>
        </h2>
        <p className="mx-auto mb-2 max-w-xl text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-400">
          {t('home.advantagesSub')}
        </p>
        {/* 副标题下渐变线 */}
        <div
          className="mx-auto mb-8 h-px max-w-xs bg-gradient-to-r from-transparent via-blue-300 to-transparent dark:via-blue-600"
          aria-hidden
        />
        <ul className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {advantages.map(({titleKey, descKey, icon}) => (
            <li key={titleKey} className="flex">
              <div className="group relative flex h-full w-full flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white/60 p-6 text-left shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-300/50 hover:bg-white/80 hover:shadow-xl hover:shadow-blue-500/10 dark:border-white/10 dark:bg-slate-800/40 dark:hover:border-blue-500/50 dark:hover:bg-slate-800/60 dark:hover:shadow-blue-900/20">
                <span
                  className="pointer-events-none absolute -left-12 -top-12 h-24 w-24 rounded-full bg-gradient-to-br from-blue-400/20 to-orange-400/20 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100 dark:from-blue-500/30 dark:to-orange-500/30"
                  aria-hidden
                />

                <div className="relative min-w-0 flex-1 text-left">
                  <h3 className="mb-3 text-lg font-bold text-slate-900 transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-orange-500 group-hover:bg-clip-text group-hover:text-transparent dark:text-slate-100 dark:group-hover:from-blue-400 dark:group-hover:to-orange-400">
                    {t(titleKey)}
                  </h3>
                  <p className="min-h-[2.5rem] text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {t(descKey)}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="relative text-center" aria-labelledby="docs-nav-heading">
        {/* 顶部渐变装饰线 */}
        <div className="mx-auto mb-6 h-1 w-24 rounded-full" aria-hidden />
        <h2 id="docs-nav-heading" className="mx-auto mb-2 max-w-2xl text-2xl font-semibold sm:text-3xl">
          <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-orange-500 bg-clip-text text-transparent dark:from-blue-400 dark:via-blue-300 dark:to-orange-400">
            {t('home.docSectionTitle')}
          </span>
        </h2>
        <p className="mx-auto mb-2 max-w-xl text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-400">
          {t('home.docSectionSub')}
        </p>
        {/* 副标题下渐变线 */}
        <div
          className="mx-auto mb-8 h-px max-w-xs bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-600"
          aria-hidden
        />
        <ul className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(({href, titleKey, descKey}) => {
            const slug = href.slice(1) || 'use'
            const Icon = docCardIcons[slug] ?? docCardIcons['use']
            return (
              <li key={href} className="flex">
                <Link
                  href={href}
                  className="group relative flex h-full w-full flex-col justify-between cursor-pointer overflow-hidden rounded-2xl border border-slate-200/80 bg-white/60 p-6 text-left shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-300/50 hover:bg-white/80 hover:shadow-xl hover:shadow-blue-500/10 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 dark:border-white/10 dark:bg-slate-800/40 dark:hover:border-blue-500/50 dark:hover:bg-slate-800/60 dark:hover:shadow-blue-900/20 dark:focus-visible:ring-offset-slate-900"
                >
                  <span
                    className="pointer-events-none absolute -left-12 -top-12 h-24 w-24 rounded-full bg-gradient-to-br from-blue-400/20 to-orange-400/20 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100 dark:from-blue-500/30 dark:to-orange-500/30"
                    aria-hidden
                  />

                  <div className="relative min-w-0 flex-1 text-left">
                    <h3 className="mb-3 text-lg font-bold text-slate-900 transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-orange-500 group-hover:bg-clip-text group-hover:text-transparent dark:text-slate-100 dark:group-hover:from-blue-400 dark:group-hover:to-orange-400">
                      {t(titleKey)}
                    </h3>
                    <p className="min-h-[2.5rem] text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      {t(descKey)}
                    </p>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>
    </main>
  )
}
