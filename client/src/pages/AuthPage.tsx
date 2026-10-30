import { useState } from 'react'
import type { ReactNode, FormEvent } from 'react'
import peonies from '../assets/peonies.svg'
import { 
  Receipt, 
  CalendarDays, 
  Cloud,
  AlertCircle,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Sparkles,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type AuthPageProps = {
  isSignUp?: boolean
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void
  serverError?: string | null
  form?: { name?: string; email?: string; password?: string, confirm?: string }
  errors?: Record<string, string | undefined>
  onFieldChange?: (field: string, value: string) => void
  showPassword?: boolean
  onTogglePassword?: () => void
  passwordStrength?: {
    level: number
    label: string
    color: string
  }
  onForgotPassword?: () => void
  onFillDemo?: () => void
  onSwitchMode?: (mode: 'signin' | 'signup') => void
  busy?: boolean
}

const DEMO_EMAIL = 'demo@plutus.app'
const DEMO_PASSWORD = 'demo1234'

function AuthPage({
  isSignUp: isSignUpProp,
  onSubmit = () => {},
  serverError,
  form = {},
  errors = {},
  onFieldChange = () => {},
  showPassword,
  onTogglePassword,
  passwordStrength = {
    level: 0,
    label: '',
    color: '',
  },
  onForgotPassword,
  onFillDemo,
  onSwitchMode,
  busy,
}: AuthPageProps) {
  const [localShowPassword, setLocalShowPassword] = useState(false)
  const [localFields, setLocalFields] = useState<Record<string, string>>({})
  const [localIsSignUp, setLocalIsSignUp] = useState(false)
  const isSignUp = isSignUpProp ?? localIsSignUp
  const passwordVisible = showPassword ?? localShowPassword
  const togglePassword =
    onTogglePassword ?? (() => setLocalShowPassword(visible => !visible))

  const switchMode =
    onSwitchMode ??
    ((mode: 'signin' | 'signup') => setLocalIsSignUp(mode === 'signup'))

  const valueOf = (key: string) =>
    (form as Record<string, string | undefined>)[key] ?? localFields[key] ?? ''

  const changeField = (key: string, value: string) => {
    setLocalFields(previous => ({ ...previous, [key]: value }))
    onFieldChange(key, value)
  }

  const fillDemo =
    onFillDemo ??
    (() => {
      setLocalFields(previous => ({
        ...previous,
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
      }))
      onFieldChange('email', DEMO_EMAIL)
      onFieldChange('password', DEMO_PASSWORD)
    })

  return (
    <div className={`relative min-h-screen flex flex-col lg:flex-row text-[#1E2D26] font-sans overflow-hidden lg:overflow-visible bg-[#386D59] lg:bg-[#F7F4EE]`}>
      {/* Left Desktop Panel */}
      <aside className={`absolute inset-0 z-0 flex h-full w-full flex-col justify-start overflow-hidden bg-[#386D59] px-5 pt-4 sm:px-8 sm:pt-5 lg:relative lg:inset-auto lg:top-auto lg:z-10 lg:flex lg:h-auto lg:min-h-0 lg:justify-between lg:border-r lg:border-black/20 lg:w-[46%] lg:p-9 xl:w-[43%] xl:p-12`}>
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.10] lg:opacity-[0.12] bg-repeat"
          style={{ backgroundImage: `url(${peonies})`, backgroundSize: '360px' }}
        />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-[#386D59]/60 via-transparent to-[#285041]/80" />

        <div className="relative hidden lg:block">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border border-[#F6C163]/50 bg-[#285041] flex items-center justify-center text-[#F6C163] font-serif font-medium text-lg tracking-wider rounded-sm shadow-inner">
              <span className="translate-y-0.5">P</span>
            </div>
            <div>
              <h1 className="font-serif font-medium text-xl uppercase tracking-wide text-[#FAF8F2] leading-tight">
                Plutus
              </h1>
              <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#A8CABD]">
                Bill Tracker
              </p>
            </div>
          </div>
        </div>

        <div className="relative max-w-sm my-10 hidden lg:block">
          <div className="hidden lg:inline-flex items-center gap-2 mb-5 px-2.5 py-1 border border-[#F6C163]/30 bg-[#285041]/70 rounded-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F6C163]" />
            <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#F6C163]">
              Private Tracker · Est. 2026
            </span>
          </div>

          <h2 className="font-serif text-[22px] leading-tight sm:text-4xl lg:leading-[1.1] xl:text-[42px] text-[#FAF8F2] tracking-tight">
            Every bill,
            <br className="hidden lg:block" />{' '}accounted for.
          </h2>
          <p className="hidden lg:block mt-4 text-sm text-[#C8E0D6] leading-relaxed">
            Your household bills, all in one place. Track what is due, settle it, and keep the record straight.
          </p>

          <div className="mt-9 space-y-4 hidden lg:block">
            <Feature
              icon={Receipt}
              title="Recurring schedules"
              note="Settled bills roll forward to the next cycle automatically."
            />
            <Feature
              icon={CalendarDays}
              title="Timeline view"
              note="See every due date laid out across the month."
            />
            <Feature
              icon={Cloud}
              title="Cloud storage"
              note="Access your household records across devices."
            />
          </div>
        </div>

        <div className="relative border-t border-white/15 pt-5 hidden lg:flex items-center justify-between gap-4">
          <p className="hidden sm:block font-serif italic text-sm text-[#C8E0D6] max-w-60">
            “A clearer view of every commitment.”
          </p>
          <div className="text-right shrink-0">
            <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-[#A8CABD]">
              Cloud-based
            </p>
            <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-[#6FD4A4] flex items-center justify-end gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6FD4A4]" />
              Synced
            </p>
          </div>
        </div>
      </aside>

      {/* Access Column */}
      <main className="relative z-20 flex-1 flex flex-col min-h-screen lg:min-h-0">
        <div className="flex-1 flex flex-col lg:flex-row items-stretch lg:items-center justify-center px-4 py-4 sm:px-8 sm:py-8 lg:p-12">
          <div
            className={`relative w-full max-w-107.5 mx-auto flex flex-1 flex-col rounded-sm border border-black/10 bg-[#F7F4EE]/92 px-4 pb-4 pt-1 shadow-[0_10px_30px_-12px_rgba(30,45,38,0.35)] backdrop-blur-md backdrop-saturate-150 [text-shadow:0_1px_0_rgba(255,255,255,0.6)] sm:px-5 sm:pb-6 sm:pt-2 lg:my-0 lg:block lg:flex-none lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-none lg:backdrop-saturate-100 lg:text-shadow:none`}
          >
            <div className="flex flex-1 flex-col justify-center pt-6 lg:block lg:flex-none lg:justify-start">
              <div className="lg:hidden relative mx-auto mb-5 w-14 h-14">
                <div className="absolute -inset-2 rounded-sm bg-[#C8860A]/20 blur-xl" />
                <div className="relative w-full h-full border border-[#C8860A]/60 bg-linear-to-br from-[#386D59] to-[#285041] flex items-center justify-center text-[#F6C163] font-serif font-medium text-2xl leading-none rounded-sm shadow-[0_8px_20px_-8px_rgba(40,80,65,0.6)] ring-1 ring-[#F6C163]/15">
                  <span className="translate-y-0.5">P</span>
                </div>
              </div>

              <FormHeading isSignUp={isSignUp} className="mb-6 lg:mb-4" />

              <div className="lg:border lg:border-black/10 lg:bg-[#FBF9F4] lg:rounded-sm lg:shadow-sm">
                <form onSubmit={onSubmit} className="space-y-4 lg:space-y-4 lg:p-6" noValidate>
                  {serverError && (
                    <div
                      role="alert"
                      className="flex items-start gap-2.5 border border-[#C0392B]/30 bg-[#C0392B]/[0.07] rounded-sm px-3 py-2.5"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 text-[#C0392B] mt-0.5" />
                      <p className="text-[11px] leading-relaxed text-[#C0392B] font-mono">
                        {serverError}
                      </p>
                    </div>
                  )}

                  {isSignUp && (
                    <Field id="name" label="Full name" icon={User} error={errors.name}>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        value={valueOf('name')}
                        onChange={e => changeField('name', e.target.value)}
                        placeholder="Ada Lovelace"
                        className="flex-1 min-w-0 h-10 lg:h-auto bg-white border border-black/12 rounded-sm px-3.5 py-2.5 text-xs lg:text-sm text-[#1E2D26] placeholder-[#7A9488] focus:outline-none focus:border-[#C8860A] transition-colors shadow-sm lg:border-0 lg:bg-transparent lg:rounded-none lg:px-0 lg:py-3 lg:shadow-none lg:focus:border-0"
                      />
                    </Field>
                  )}

                  <Field id="email" label="Email address" icon={Mail} error={errors.email}>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      value={valueOf('email')}
                      onChange={e => changeField('email', e.target.value)}
                      placeholder="you@example.com"
                      className="flex-1 min-w-0 h-10 lg:h-auto bg-white border border-black/12 rounded-sm px-3.5 py-2.5 text-xs lg:text-sm text-[#1E2D26] placeholder-[#7A9488] focus:outline-none focus:border-[#C8860A] transition-colors shadow-sm lg:border-0 lg:bg-transparent lg:rounded-none lg:px-0 lg:py-3 lg:shadow-none lg:focus:border-0"
                    />
                  </Field>

                  <Field
                    id="password"
                    label="Password"
                    icon={Lock}
                    error={errors.password}
                    right={
                      <button
                        type="button"
                        onClick={togglePassword}
                        aria-label={passwordVisible ? 'Hide password' : 'Show password'}
                        className="p-1 -mr-1 text-[#7A9488] hover:text-[#1E2D26] transition-colors rounded-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8860A]/40"
                      >
                        {passwordVisible ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    }
                  >
                    <input
                      id="password"
                      name="password"
                      type={passwordVisible ? 'text' : 'password'}
                      autoComplete={isSignUp ? 'new-password' : 'current-password'}
                      value={valueOf('password')}
                      onChange={e => changeField('password', e.target.value)}
                      placeholder={isSignUp ? 'At least 8 characters' : '••••••••'}
                      className="flex-1 min-w-0 h-10 lg:h-auto bg-white border border-black/12 rounded-sm px-3.5 pr-10 py-2.5 text-xs lg:text-sm text-[#1E2D26] placeholder-[#7A9488] focus:outline-none focus:border-[#C8860A] transition-colors shadow-sm lg:border-0 lg:bg-transparent lg:rounded-none lg:px-0 lg:pr-0 lg:py-3 lg:shadow-none lg:focus:border-0"
                    />
                  </Field>

                  {isSignUp && form.password && passwordStrength && (
                    <div className="flex items-center gap-2 -mt-1">
                      <div className="flex-1 flex gap-1">
                        {[1, 2, 3].map(step => (
                          <span
                            key={step}
                            className="h-1 flex-1 rounded-full transition-colors duration-200"
                            style={{
                              backgroundColor:
                                passwordStrength.level >= step ? passwordStrength.color : '#E2DED4',
                            }}
                          />
                        ))}
                      </div>
                      <span
                        className="font-mono text-[10px] tracking-wider uppercase"
                        style={{ color: passwordStrength.color }}
                      >
                        {passwordStrength.label}
                      </span>
                    </div>
                  )}

                  {isSignUp && (
                    <Field
                      id="confirm"
                      label="Confirm password"
                      icon={Lock}
                      error={errors.confirm}
                    >
                      <input
                        id="confirm"
                        name="confirm"
                        type={passwordVisible ? 'text' : 'password'}
                        autoComplete="new-password"
                        value={valueOf('confirm')}
                        onChange={e => changeField('confirm', e.target.value)}
                        placeholder="Repeat password"
                        className="flex-1 min-w-0 h-10 lg:h-auto bg-white border border-black/12 rounded-sm px-3.5 py-2.5 text-xs lg:text-sm text-[#1E2D26] placeholder-[#7A9488] focus:outline-none focus:border-[#C8860A] transition-colors shadow-sm lg:border-0 lg:bg-transparent lg:rounded-none lg:px-0 lg:py-3 lg:shadow-none lg:focus:border-0"
                      />
                    </Field>
                  )}

                  {!isSignUp && (
                    <div className="flex items-center justify-end pt-0.5">
                      <button
                        type="button"
                        onClick={onForgotPassword}
                        className="font-mono text-[11px] text-[#C8860A] hover:text-[#A36D06] hover:underline transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={busy}
                    className="w-full flex items-center justify-center gap-2 bg-[#386D59] hover:bg-[#2F5C4A] active:bg-[#285041] disabled:opacity-60 disabled:cursor-not-allowed text-white font-mono font-semibold text-xs tracking-wide px-4 py-3 rounded-sm shadow-sm transition-colors duration-150 mt-1"
                  >
                    {busy ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{isSignUp ? 'Opening ledger…' : 'Signing in…'}</span>
                      </>
                    ) : (
                      <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                    )}
                  </button>

                  {!isSignUp && (
                    <>
                      <div className="hidden lg:flex items-center gap-3 pt-0.5">
                        <span className="h-px flex-1 bg-black/10" />
                        <span className="font-mono text-[9px] tracking-[0.18em] uppercase text-[#7A9488]">
                          or
                        </span>
                        <span className="h-px flex-1 bg-black/10" />
                      </div>

                      <button
                        type="button"
                        onClick={fillDemo}
                        className="hidden lg:flex w-full items-center justify-between gap-2 border border-black/15 bg-[#EDE9E0] hover:bg-[#E8E4DA] px-3.5 py-2.5 rounded-sm text-left transition-colors"
                      >
                        <span className="flex items-center gap-2.5 min-w-0">
                          <Sparkles className="w-4 h-4 text-[#C8860A] shrink-0" />
                          <span className="min-w-0">
                            <span className="block text-[11px] font-semibold text-[#1E2D26]">
                              Try the demo ledger
                            </span>
                            <span className="block font-mono text-[10px] text-[#7A9488] truncate">
                              {DEMO_EMAIL} · {DEMO_PASSWORD}
                            </span>
                          </span>
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={fillDemo}
                        className="lg:hidden w-full flex items-center justify-center gap-1.5 py-1 font-mono text-[11px] text-[#C8860A] hover:text-[#A36D06] transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Try demo ledger</span>
                      </button>
                    </>
                  )}
                </form>
              </div>
            </div>
            
            <p className="mt-4 pt-0 text-center font-mono text-[11px] text-[#4A6358] lg:mt-4 lg:text-[11px]">
              {isSignUp ? 'Already have an account?' : 'Don\'t have an account?'}{' '}
              <button
                type="button"
                onClick={() => switchMode(isSignUp ? 'signin' : 'signup')}
                className="font-semibold text-[#386D59] underline underline-offset-2 hover:text-[#C8860A] transition-colors"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

type FieldProps = {
  id: string
  label: string
  icon: LucideIcon
  error?: string
  children: ReactNode
  right?: ReactNode
}

function Field({ id, label, icon: Icon, error, children, right }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block font-mono text-xs text-[#4A6358] lg:text-[10px] lg:tracking-[0.18em] lg:uppercase"
      >
        {label}
      </label>
      <div
        className={`relative flex items-center gap-2.5 lg:rounded-md lg:border lg:px-3.5 lg:bg-white lg:transition-all lg:duration-150 lg:focus-within:ring-2 lg:focus-within:ring-[#C8860A]/15 ${
          error
            ? 'lg:border-[#C0392B]/60 lg:focus-within:border-[#C0392B]'
            : 'lg:border-black/15 lg:focus-within:border-[#C8860A]'
        }`}
      >
        <Icon className="hidden lg:block w-4 h-4 shrink-0 text-[#7A9488]" />
        {children}
        {right && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 lg:static lg:translate-y-0">
            {right}
          </div>
        )}
      </div>
      {error && (
        <p className="flex items-center gap-1.5 text-[11px] text-[#C0392B] font-mono">
          <AlertCircle className="w-3 h-3 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  )
}

function FormHeading({ isSignUp, className = '' }: { isSignUp?: boolean; className?: string }) {
  return (
    <div className={className}>
      <div className="hidden lg:flex items-center gap-2 mb-2">
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#C8860A] bg-[#C8860A]/10 px-2 py-0.5 rounded-sm border border-[#C8860A]/25">
          {isSignUp ? 'New Account' : 'Access'}
        </span>
        <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#7A9488]">
          Plutus Ledger
        </span>
      </div>
      <h2 className="font-serif text-[24px] sm:text-3xl font-medium tracking-tight text-[#1E2D26] text-center lg:text-left">
        {isSignUp ? 'Register' : 'Sign In'}
      </h2>
      <p className="text-[13px] mt-1 lg:mt-1 leading-relaxed text-[#4A6358] text-center lg:text-left">
        {isSignUp ? 'Create an account to get started.' : 'Enter your details to continue.'}
      </p>
    </div>
  )
}

function Feature({ icon: Icon, title, note }: { icon: LucideIcon; title: string; note: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 shrink-0 rounded-sm border border-white/15 bg-[#2F5C4A] flex items-center justify-center">
        <Icon className="w-4 h-4 text-[#F6C163]" />
      </div>
      <div className="pt-0.5">
        <p className="text-xs font-semibold text-[#FAF8F2] tracking-wide">{title}</p>
        <p className="text-[11px] text-[#A8CABD] leading-relaxed mt-0.5">{note}</p>
      </div>
    </div>
  )
}

export default AuthPage