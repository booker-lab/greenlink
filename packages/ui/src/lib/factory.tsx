import { ark } from '@ark-ui/react'
import { forwardRef } from 'react'
import { cn } from './utils'

/**
 * Ark UI Factory wrapper to bind Tailwind CSS classes easily.
 * Usage: const Button = styled(ark.button, 'px-4 py-2 bg-blue-500')
 */
export const styled = (Component: any, baseClass: string) => {
    return forwardRef<any, any>(({ className, ...props }, ref) => {
        // In Ark UI v3+, 'ark' is a function that returns a component
        // However, to keep it simple and avoid SSR/Proxy issues, 
        // we can just wrap the Ark component with our classes.
        const ArkComponent = Component as any
        return <ArkComponent ref={ ref } className = { cn(baseClass, className) } {...props} />
  })
}

export { ark } from '@ark-ui/react'
