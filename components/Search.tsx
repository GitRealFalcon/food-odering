import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { images } from '@/constants'
import { useDebouncedCallback } from "use-debounce"

const Search = () => {
  const params = useLocalSearchParams<{ query: string }>()
  const [Query, setQuery] = useState(params.query)
  const debounceSearch = useDebouncedCallback(
    (text: string) => router.setParams({ query: text }),
    500
  )
  const handleSearch = (text: string) => {
    setQuery(text)
    debounceSearch(text)
  }
  return (
    <View className='searchbar'>
      <TextInput
        className='flex-5 p-5'
        placeholder='Search for pizzas, burgers...'
        value={Query}
        onChangeText={handleSearch}
        placeholderTextColor={"#A0A0A0"}
      />

      <TouchableOpacity className='pr-5' onPress={() => console.log("Search Pressed")}>
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