"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, IndianRupee } from "lucide-react"
import { useRouter } from "next/navigation"
import { tiers } from "@/data/paymentDetails"

interface AnimatedTextProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ children, className = "", delay = 0 }) => (
  <motion.span
    className={`inline-block ${className}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.5, delay }}
  >
    {children}
  </motion.span>
)

interface AnimatedPriceProps {
  price: number
  prevPrice: number
}

const AnimatedPrice: React.FC<AnimatedPriceProps> = ({ price, prevPrice }) => {
  const [displayPrice, setDisplayPrice] = useState(prevPrice)

  useEffect(() => {
    const duration = 700
    const steps = 60
    const stepDuration = duration / steps
    const increment = (price - prevPrice) / steps

    let currentStep = 0
    const interval = setInterval(() => {
      if (currentStep < steps) {
        setDisplayPrice(prev => Math.round((prev + increment) * 100) / 100)
        currentStep++
      } else {
        clearInterval(interval)
        setDisplayPrice(price)
      }
    }, stepDuration)

    return () => clearInterval(interval)
  }, [price, prevPrice])

  return (
    <div className="text-3xl font-bold flex items-center">
      <div>{displayPrice}%</div>
    </div>
  )
}

const BillingPage = () => {
  const [activeTab, setActiveTab] = useState<string>("basic")
  const [prevPrice, setPrevPrice] = useState<number>(0)
  const router = useRouter()
  const activeSubscription =  "BASIC"

  const handleTabChange = (value: string) => {
    const currentTier = tiers.find(tier => tier.name.toLowerCase() === activeTab)
    if (currentTier) {
      setPrevPrice(currentTier.price)
    }
    setActiveTab(value)
  }

  // const handlePayment = async (amount: Number | string, productId: string) => {

  //   const res = await fetch('/api/checkout', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ amount, productId }),
  //   });

  //   if (res.redirected) {
  //     router.push(res.url)
  //     return;
  //   }

  //   const data = await res.json();

  //   if (data.error) {
  //     return alert(data.error);
  //   }

  //   if (data.id) {
  //     const options = {
  //       key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Your Razorpay Key ID
  //       amount: data.amount,
  //       currency: data.currency,
  //       name: 'Starter-Kit',
  //       description: 'Test Transaction',
  //       order_id: data.id,
  //       handler: async function (response: any) {
  //         console.log("response:- ", response);
  //         const { razorpay_order_id: order_id, razorpay_payment_id: payment_id, razorpay_signature } = response;
  //         const orderCreated = await verifyPayment({ order_id, payment_id, razorpay_signature })
  //         // Handle post-payment logic here (e.g., saving payment info)
  //       },
  //       prefill: {
  //         name: user?.name || 'Customer Name',
  //         email: user?.email || 'customer@example.com',
  //       },
  //       theme: {
  //         color: '#F37254',
  //       },
  //     };

  //     const razorpay = new (window as any).Razorpay(options);
  //     razorpay.open();
  //   } else {
  //     alert('Error creating order');
  //   }
  // };

  return (
    <div className="flex-grow container  mx-auto px-4 py-8">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-900">Simple, Transparent Pricing</h1>
      <p className="text-xl text-center mb-12 text-gray-600">Choose the plan that&apos;s right for you</p>

      <div className="w-full max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800">Choose Your Perfect Plan</h1>
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 h-fit">
            {tiers.map((tier) => (
              <TabsTrigger
                key={tier.name.toLowerCase()}
                value={tier.name.toLowerCase()}
                className="text-sm md:text-base font-semibold py-2 px-1 md:px-4"
              >
                <tier.icon className={`mr-1 md:mr-2 h-4 w-4 md:h-5 md:w-5 ${tier.color}`} />
                <span className="hidden md:inline">{tier.name}</span>
                <span className="md:hidden">{tier.name.slice(0, 3)}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          <AnimatePresence mode="sync">
            {tiers.map((tier) => (
              <TabsContent key={tier.name.toLowerCase()} value={tier.name.toLowerCase()}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="overflow-hidden">
                    <CardHeader className={`bg-gradient-to-r ${tier.color.replace('text', 'from')}-100 to-white`}>
                      <CardTitle>
                        <AnimatedText className="text-2xl md:text-3xl font-bold">{tier.name}</AnimatedText>
                      </CardTitle>
                      <CardDescription>
                        <AnimatedText delay={0.1}>{tier.description}</AnimatedText>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                      <div className="flex flex-row justify-center items-end">
                        <AnimatedPrice price={tier.price} prevPrice={prevPrice} /><span className="w-2"></span> Commission Per Hiring
                        {/* <AnimatedText className="text-gray-500 mt-2" delay={0.2}>
                          {tier.period}
                        </AnimatedText> */}
                      </div>
                      <ul className="space-y-3">
                        {tier.features.map((feature, index) => (
                          <motion.li
                            key={index}
                            className="flex items-center space-x-3"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 + 0.3 }}
                          >
                            <Check className={`flex-shrink-0 ${tier.color}`} size={20} />
                            <span>{feature}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={() => {
                        if (tier.name.toUpperCase() === activeSubscription) {
                          return;
                        }
                        if (tier.price === 0) {
                          // handlePayment(0, tier.productId)
                        }
                        // handlePayment(tier.price, tier.productId)
                      }} className="w-full text-lg py-4 md:py-6" variant={tier.name.toUpperCase() === activeSubscription ? "secondary" : tier.name === "Pro" ? "default" : "outline"}>
                        {
                          tier.name.toUpperCase() === activeSubscription ? "Activated" :
                            tier.name === "Basic" ? "Start Free" : "Subscribe"
                        }
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              </TabsContent>
            ))}
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  )
}

export default BillingPage
