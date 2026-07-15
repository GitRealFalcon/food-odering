import { View, Text, Button, Alert } from 'react-native'
import React, { useState } from 'react'
import { Link, router } from 'expo-router'
import CustomInput from '@/components/CustomInput'
import CustomButton from '@/components/CustomButton'
import { createUser } from '@/lib/appwrite'

const SignUp = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  })

  const submit = async () => {
    const { name, email, password } = form
    if (!email || !password || !name) return Alert.alert("Error", "Please enter valid email address & password")

    setIsSubmitting(true)
    try {

      await createUser({ name, email, password })
      router.replace("/")
    } catch (error: any) {
      Alert.alert("Error", error.message)
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <View className='gap-10 bg-white rounded-lg p-5 mt-5'>

      <CustomInput
        placeholder='Enter Your Name'
        value={form.name}
        onChangeText={(text) => setForm((prev) => ({ ...prev, name: text }))}
        label='Full Name'
        keyboardType='default'
      />
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
      <CustomButton textStyle='Sign In' isLoading={isSubmitting} onPress={submit} title='Sign Up' />
      <View className='flex justify-center items-center flex-row gap-2'>
        <Text className='base-ragular text-gray-100'>Already have an acccount?</Text>
        <Link href={"/sign-in"} className='base-bold text-primary'>Sign In</Link>
      </View>
    </View>
  )
}

export default SignUp