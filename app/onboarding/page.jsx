'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const nextStep = () => setStep(prev => prev + 1)
  const prevStep = () => setStep(prev => prev - 1)

  return (
    <div className="max-w-md mx-auto p-6">
      {step === 1 && (
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Welcome to KMR</h1>
          <p className="text-gray-600">Let's get you started with your account</p>

          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={nextStep}>Next</Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Contact Information</h1>

          <div className="space-y-2">
            <Label>Email Address</Label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>

          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={prevStep}>Back</Button>
            <Button onClick={nextStep}>Next</Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Complete Setup</h1>
          <p className="text-gray-600">Review your information</p>

          <div className="space-y-2">
            <div>
              <span className="font-medium">Name:</span> {formData.name}
            </div>
            <div>
              <span className="font-medium">Email:</span> {formData.email}
            </div>
            <div>
              <span className="font-medium">Phone:</span> {formData.phone}
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={prevStep}>Back</Button>
            <Button>Complete Setup</Button>
          </div>
        </div>
      )}
    </div>
  )
}