"use client"
import { handleCreateRecruitmentJobProfile } from "@/actions/actions"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { toast } from "sonner"



const CreateJobProfile = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className='p-6 w-[200px] border rounded-lg bg-secondary hover:scale-105 hover:shadow-sm cursor-pointer transition-all'
          aria-label="Add New Interview"
          type="button"
        >
          <h2 className='text-lg text-center'>+ Add New</h2>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Job Post</DialogTitle>
        </DialogHeader>

        <form
          className="flex flex-col gap-2"
          action={async (data: FormData) => {
            setIsSubmitting(true)
            const created = await handleCreateRecruitmentJobProfile(data)
            if (created) {
              toast.success('Job Profile Created Successfully')
            } else {
              toast.error('All fields are required')
            }
            setIsSubmitting(false)
          }}
        >
          <div>
            <label>Enter Job Title</label>
            <Input
              type="text"
              name="jobTitle"
              id="jobTitle"
              placeholder="Job title"
              autoFocus
            />
          </div>
          <div>
            <label>Enter Job Position</label>
            <Input
              type="text"
              name="jobPosition"
              id="jobPosition"
              placeholder="Senior Full Stack Developer"
            />
          </div>
          <div>
            <label>Job Description</label>
            <Textarea
              name="jobDesc"
              id="jobDesc"
              placeholder="Job requirements"
            />
          </div>
          <div>
            <label>Job Experience</label>
            <Input
              type="number"
              name="jobExperience"
              defaultValue={0}
            />
          </div>
          <Button type="submit" variant="default" disabled={isSubmitting}>
            Create Job Profile for hiring
          </Button>
        </form>

      </DialogContent>
    </Dialog>
  )
}

export default CreateJobProfile
