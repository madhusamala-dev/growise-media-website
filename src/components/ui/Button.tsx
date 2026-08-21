import { cva, type VariantProps } from 'class-variance-authority'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../../lib/cn'

const buttonVariants = cva(
  'group inline-flex select-none items-center justify-center gap-2 rounded-full font-display font-semibold tracking-tight whitespace-nowrap transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        primary:
          'bg-ember-500 text-white shadow-[0_10px_30px_-12px_rgba(255,74,17,0.65)] hover:-translate-y-0.5 hover:bg-ember-600 hover:shadow-[0_16px_40px_-12px_rgba(255,74,17,0.8)]',
        gold: 'bg-gold-400 text-ink-950 shadow-[0_10px_30px_-14px_rgba(255,212,0,0.7)] hover:-translate-y-0.5 hover:bg-gold-500',
        outline:
          'border border-ink-300 text-ink-950 hover:border-ink-950 hover:bg-ink-950 hover:text-white',
        outlineLight:
          'border border-white/25 bg-white/5 text-white backdrop-blur-sm hover:-translate-y-0.5 hover:border-white/60 hover:bg-white hover:text-ink-950',
        ghost: 'text-ink-950 hover:bg-ink-950/5',
        ghostLight: 'text-white/80 hover:bg-white/10 hover:text-white',
      },
      size: {
        sm: 'h-9 px-4 text-[13px]',
        md: 'h-11 px-6 text-[15px]',
        lg: 'h-[3.25rem] px-8 text-base',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
)

interface BaseProps extends VariantProps<typeof buttonVariants> {
  children: ReactNode
  className?: string
}

type ButtonAsButton = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> & {
    href?: undefined
    to?: undefined
  }

type ButtonAsLink = BaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className'> & { href: string; to?: undefined }

type ButtonAsRouterLink = BaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'href'> & { to: string; href?: undefined }

type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsRouterLink

export function Button(props: ButtonProps) {
  const { variant, size, className, children, ...rest } = props

  if ('to' in props && props.to !== undefined) {
    const { to: _to, ...routerRest } = rest as AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }
    return (
      <Link to={_to} className={cn(buttonVariants({ variant, size }), className)} {...routerRest}>
        {children}
      </Link>
    )
  }

  if ('href' in props && props.href !== undefined) {
    const { href, ...anchorRest } = rest as AnchorHTMLAttributes<HTMLAnchorElement>
    return (
      <a href={href} className={cn(buttonVariants({ variant, size }), className)} {...anchorRest}>
        {children}
      </a>
    )
  }

  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  )
}
