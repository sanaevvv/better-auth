import React, { ComponentProps } from 'react'
import { ActionButton } from '../ui/action-button'

const BetterAuthActionButton = ({action, successMessage, ...props}:Omit<ComponentProps<typeof ActionButton>, 'action'> & {
  action: () => Promise<{ error: null | { message?: string } }>
  successMessage?: string
}) => {
  return (
    <ActionButton
      {...props}
      action={async () => {
        const res = await action()
        if (res.error) {
          return { error: true, message: res.error.message || "エラーが発生しました。再度お試しください。" }
        } else {
          return { error: false, message: successMessage }
        }
      }}
    />
  )
}

export default BetterAuthActionButton
