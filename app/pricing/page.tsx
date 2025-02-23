"use client"
import BillingPage from "@/components/Billing/BillingComponent"


const page = () => {
  return (
    <div className="h-screen flex flex-col w-full">
      <div className="flex justify-between items-center p-4 bg-slate-900/10">
        <div className="text-orange-500 text-3xl font-extrabold">CVison</div>
        <div></div>
      </div>
      <BillingPage />
    </div>
  )
}

export default page
