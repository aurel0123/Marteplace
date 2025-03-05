import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
export default function Landingpage() {
  return (
    <div>
      <Button asChild>
        <Link to="/dashboard">
        Dashbaord
        </Link>
        
      </Button>
    </div>
  )
}
