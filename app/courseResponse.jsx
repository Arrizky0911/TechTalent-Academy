import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRoute } from '@react-navigation/native'

const courseResponse = () => {
  const route = useRoute()
  const {courseName} = route.params  

  return (
    <SafeAreaView>
        <View>
        <Text>Course Response</Text>
        <Text> {courseName}</Text>
        </View>
    </SafeAreaView>
  )
}

export default courseResponse