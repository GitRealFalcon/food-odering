import { View, Text, TouchableOpacity, Image, Platform } from 'react-native'
import React from 'react'
import { MenuItem } from '@/type'

const MenuCard = ({item : {image_url, name, price}} : {item : MenuItem}) => {
  return (
    <TouchableOpacity className='menu-card' style={Platform.OS === "android" ? {elevation : 10, shadowColor : "#878787"} : {}}>
        <Image source={{uri : image_url}} className='size-32 absolute -top-10'  resizeMode='contain'/>
        <Text className='text-center base-bold text-dark-100 mb-2' numberOfLines={1}>{name}</Text>
        <Text className='body-regular text-gray-600 mb-4'>From ${price}</Text>
        <TouchableOpacity onPress={()=>{}}>
            <Text className='paragreph-bold text-primary'>Add to Cart +</Text>
        </TouchableOpacity>
    </TouchableOpacity>
  )
}

export default MenuCard