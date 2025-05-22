<template>
  <form @submit.prevent="onSubmit" class="space-y-6 max-w-xl mx-auto">
    <FormField name="text" v-slot="{ field, errorMessage }">
      <FormItem>
        <FormLabel>Write your review</FormLabel>
        <FormControl>
          <Textarea v-bind="field" rows="5" placeholder="Write your review here"/>
        </FormControl>
        <FormMessage>{{ errorMessage }}</FormMessage>
      </FormItem>
    </FormField>
    <Button type="submit" :disabled="submitting || !meta.valid">
      {{ submitting ? 'Submitting...' : 'Submit Review' }}
    </Button>
  </form>
</template>

<script setup lang="ts">
import { ref, h } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/store/authStore'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/components/firebase'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { toast, ToastAction } from '@/components/ui/toast'

const auth = useAuthStore()
const route = useRoute()
const hotelId = route.params.hotelId as string

const schema = toTypedSchema(z.object({
  text: z.string().min(1, 'Review can’t be empty')
}))

const { handleSubmit, defineField, meta, resetForm } = useForm({
  validationSchema: schema,
  initialValues: { text: '' }
})

defineField('text')

const submitting = ref(false)

const onSubmit = handleSubmit(async ({ text }) => {
  if (!auth.user?.uid) {
    toast({
      title: 'Not logged in',
      description: 'You must sign in to post a review',
      variant: 'destructive',
      action: h(ToastAction, { altText: 'OK' }, { default: () => 'OK' })
    })
    return
  }
  submitting.value = true
  try {
    await addDoc(collection(db, 'reviews'), {
      hotelId,
      userId: auth.user.uid,
      text,
      createdAt: serverTimestamp()
    })
    toast({ title: 'Review submitted!' })
    resetForm()
  } catch {
    toast({
      title: 'Submission failed',
      description: 'Please try again later',
      variant: 'destructive',
      action: h(ToastAction, { altText: 'OK' }, { default: () => 'OK' })
    })
  } finally {
    submitting.value = false
  }
})
</script>
