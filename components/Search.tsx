import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { images } from '@/constants'
import { useDebouncedCallback } from "use-debounce"

const Search = () => {
  const params = useLocalSearchParams<{ query: string }>()
  const [Query, setQuery] = useState(params.query)

  const handleSearch = (text: string) => {
    setQuery(text)
    if(!text) router.setParams({query : undefined})
  }

  const handleSubmit = ()=>{
    if(Query.trim()) router.setParams({query : Query})
  }
  return (
    <View className='searchbar'>
      <TextInput
        className='flex-5 p-5'
        placeholder='Search for pizzas, burgers...'
        value={Query}
        onChangeText={handleSearch}
        placeholderTextColor={"#A0A0A0"}
        onSubmitEditing={handleSubmit}
        returnKeyType='search'
      />

      <TouchableOpacity className='pr-5' onPress={() => router.setParams({query : Query})}>
        <Image
          source={images.search}
          className='size-6'
          resizeMode='contain'
          tintColor={"#5D5F60"}
        />

      </TouchableOpacity>
    </View>
  )
}

export default Search