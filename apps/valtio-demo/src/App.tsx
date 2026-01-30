import {
  DataTable,
  GlobalCounterDemo,
  LocalCounterDemo,
  MixedCounterDemo,
  ShoppingCart,
  SignupForm,
  ThemeToggle,
  TodoApp,
  UserProfile,
} from './demos'

const App = () => {
  return (
    <div className=" min-h-screen bg-slate-50 py-8 px-4 transition-colors dark:bg-slate-900 dark:text-slate-100">
      <div className="mx-auto max-w-8xl columns-2 gap-x-6 md:columns-3 [&>*]:break-inside-avoid [&>*]:mb-6">
        <ThemeToggle />
        <LocalCounterDemo />
        <GlobalCounterDemo />
        <MixedCounterDemo />
        <TodoApp />
        <ShoppingCart />
        <UserProfile userId="1" />
        <SignupForm />
        <DataTable />
      </div>
    </div>
  )
}

export default App
