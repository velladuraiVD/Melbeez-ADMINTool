import React from 'react'
import { AuthProvider } from '../AuthContext'
import Transaction from './Transaction'

function Maintransaction() {
  return (
    <>
    <AuthProvider>
      <Transaction/>
    </AuthProvider>
  </>
  )
}

export default Maintransaction