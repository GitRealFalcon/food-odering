import { View, Text } from 'react-native'
import React from 'react'
import { Redirect, Slot } from 'expo-router'

export default function _layout() {
    const isAthenticated = false
    if(!isAthenticated) return <Redirect href={"/sign-in"} />
  return (
    <Slot/>
  )
}