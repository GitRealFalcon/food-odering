import { View, Text, Button, Alert } from 'react-native'
import React, { useState } from 'react'
import { Link, router } from 'expo-router'
import CustomInput from '@/components/CustomInput'
import CustomButton from '@/components/CustomButton'
import { signIn } from '@/lib/appwrite'
import * as Sentry from "@sentry/react-native"

const SignIn = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({
    email: "",
    password: ""
  })

  const submit = async () => {
    const { email, password } = form
    if (!email || !password) return Alert.alert("Error", "Please enter valid email address & password")

    setIsSubmitting(true)
    try {

      await signIn({ email, password })
      router.replace("/")
    } catch (error: any) {
      Alert.alert("Error", error.message)
      Sentry.captureEvent(error)
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <View className='gap-10 bg-white rounded-lg p-5 mt-5'>

      <CustomInput
        placeholder='Enter Your Email'
        value={form.email}
        onChangeText={(text) => setForm((prev) => ({ ...prev, email: text }))}
        label='Email'
        keyboardType='email-address'
      />
      <CustomInput
        placeholder='Enter Your Password'
        value={form.password}
        onChangeText={(text) => setForm((prev) => ({ ...prev, password: text }))}
        label='Password'
        secureTextEntry={true}
      />
      <CustomButton textStyle='Sign In' isLoading={isSubmitting} onPress={submit} title='Sign In' />
      <View className='flex justify-center items-center mt-5 flex-row gap-2'>
        <Text className='base-ragular text-gray-100'>Don't have an acccount?</Text>
        <Link href={"/sign-up"} className='base-bold text-primary'>Sign Up</Link>
      </View>
    </View>
  )
}

export default SignIn