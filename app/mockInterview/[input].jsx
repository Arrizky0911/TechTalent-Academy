import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageBackground,
  PermissionsAndroid
} from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // pastikan Anda sudah menginstal expo-linear-gradient
import { FontAwesome } from "@expo/vector-icons"; // pastikan Anda sudah menginstal @expo/vector-icons
import AntDesign from '@expo/vector-icons/AntDesign';
import React, {useState} from 'react';
import { router } from "expo-router";
import { useLocalSearchParams } from 'expo-router';
import useFetchData from '../../lib/useFetchData';
import { getQuestions, getTranscript } from '../../lib/AIConfig';
import Loading from "../../components/Loading";
import { Audio } from "expo-av";

const MockTest = () => {
  const {input} = useLocalSearchParams();
  let i = 0;
  const {data: questions, isLoading} = useFetchData(() => getQuestions(input));
  const [index, setIndex] = useState(0);
  const {data: answers, setAnswers} = useState([]);
  const [isTranscripting, setIsTranscripting] = useState(false);
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [recording, setRecording] = useState();

  const startRecording = async () => {
    console.log("Run start recording")
    try {
      if (permissionResponse.status !== 'granted') {
        console.log('Requesting permission..');
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync( Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  const stopRecording = async () => {
    console.log('Stopping recording..');
    setRecording(undefined);
    setIsTranscripting(true);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync(
      {
        allowsRecordingIOS: false,
      }
    );
    const uri = recording.getURI();
    console.log('Recording stopped and stored at', uri);
    const transcriptedText = await getTranscript(uri);
    setAnswers(answers => answers?.push(transcriptedText));
    console.log(answers);
    console.log(typeof answers);
    setIsTranscripting(false);
  }
  
  const handleSubmit = () => {
    let q = ["Describe your experience with different programming languages and their strengths and weaknesses. Which languages are you most comfortable with, and why?", "Explain your understanding of object-oriented programming (OOP) and how you apply it in your coding practices. Can you give an example?", "What are your preferred development environments and tools? How do you set up your workspace for optimal efficiency?", "Tell me about a recent software project you worked on. What were the challenges you faced, and how did you overcome them?", "How do you approach debugging and troubleshooting code issues? What are some of your favorite debugging techniques and tools?", "Explain your understanding of version control systems like Git. Describe your experience with branching, merging, and resolving conflicts.", "How do you ensure the code you write is clean, maintainable, and well-documented? What are some of your coding standards and best practices?", "Describe your experience with different software design patterns. What are the benefits of using design patterns, and can you give an example of a pattern you've implemented?", "How do you stay up-to-date with the latest software development trends and technologies? What resources do you use to expand your knowledge?", "What are your preferred testing methodologies and tools? How do you approach unit testing, integration testing, and end-to-end testing?", "Can you discuss a time when you had to learn a new programming language or technology quickly? How did you approach the learning process?", "What is your experience with working in a collaborative development environment? How do you communicate effectively with other developers?", "Explain your understanding of different software development methodologies, such as Agile or Waterfall. Which do you prefer, and why?", "Tell me about a time when you had to make a difficult technical decision. How did you approach the problem, and what was the outcome?"];
    let a = [
      `I have experience with various programming languages, including Python, Java, JavaScript, and C++. Each language has its strengths and weaknesses:
    
        * **Python:** A versatile language known for its readability and ease of use. It's great for data analysis, machine learning, and web development.
        * **Java:** A robust and scalable language widely used for enterprise applications.
        * **JavaScript:** The language of the web, used for frontend and backend development.
        * **C++:** A powerful language for systems programming and performance-critical applications.
    
      I am most comfortable with Python due to its readability, extensive libraries, and versatility.`,
    
      `I understand object-oriented programming (OOP) and apply it in my coding practices. OOP involves organizing code into objects, which have properties (attributes) and behaviors (methods). This promotes code reusability, modularity, and maintainability.
    
      For example, I might create a 'Person' class with properties like 'name', 'age', and 'address', and methods like 'getFullName()' and 'getAge()'. This allows me to create multiple 'Person' objects with different values and reuse the common code.`,
    
      `My preferred development environments are Visual Studio Code and IntelliJ IDEA. I customize my workspace with plugins, themes, and shortcuts to optimize efficiency. I also use version control systems like Git and task management tools like Trello to stay organized.`,
    
      `I recently worked on a web application using Python, Django, and React. A significant challenge was optimizing the application for performance, especially during peak traffic times. I addressed this by implementing caching mechanisms, optimizing database queries, and using asynchronous programming techniques.`,
    
      `I approach debugging and troubleshooting code issues systematically. I use debugging tools like debuggers and loggers to identify and fix errors. I also employ techniques like code reviews, unit testing, and code refactoring to prevent and detect issues early on.`,
    
      `I am proficient in Git and use it for version control in all my projects. I understand the importance of branching, merging, and resolving conflicts. I use strategies like Gitflow to manage different development branches and maintain a clean commit history.`,
    
      `I strive to write clean, maintainable, and well-documented code. I follow coding standards and best practices, such as:
    
        * **Consistency:** Using consistent naming conventions and formatting.
        * **Modularity:** Breaking down code into smaller, reusable functions or classes.
        * **Comments:** Adding clear and concise comments to explain code logic.
        * **Testing:** Writing unit tests to ensure code correctness.
    
      I also use tools like linters to automatically check for code quality issues.`,
    
      `I have experience with various software design patterns, including:
    
        * **Factory:** Creating objects without specifying their exact class.
        * **Singleton:** Ensuring that a class has only one instance.
        * **Observer:** Defining a one-to-many dependency between objects, so that when one object changes state, all its dependents are notified.
    
      Design patterns provide reusable solutions to common software design problems, improving code quality, maintainability, and flexibility.`,
    
      `I stay up-to-date with the latest software development trends and technologies by:
    
        * **Reading technical articles and blogs:** Following industry news and best practices.
        * **Attending conferences and webinars:** Learning about new tools and techniques.
        * **Participating in online communities:** Engaging with other developers and sharing knowledge.
        * **Experimenting with new technologies:** Trying out new tools and frameworks.`,
    
      `My preferred testing methodologies include:
    
        * **Unit testing:** Testing individual components or functions.
        * **Integration testing:** Testing the interaction between different components.
        * **End-to-end testing:** Testing the entire application from the user's perspective.
    
      I use testing frameworks like JUnit, TestNG, and Jest to automate testing and ensure code quality.`,
    
      `I once had to learn a new programming language, JavaScript, for a web development project. I started by going through online tutorials and documentation. I then practiced by building small projects and experimenting with different features. I also sought help from online communities and mentors when I encountered challenges.`,
    
      `I am comfortable working in collaborative development environments. I believe in effective communication, code reviews, and teamwork. I use tools like Git for version control and collaboration platforms like GitHub or GitLab.`,
    
      `I am familiar with both Agile and Waterfall methodologies. Agile methodologies, like Scrum and Kanban, emphasize iterative development, flexibility, and collaboration. Waterfall methodologies follow a linear approach with distinct phases. I prefer Agile methodologies due to their adaptability and focus on delivering value early in the development process.`,
    
      `A challenging technical decision I faced was choosing the right database for a large-scale application. I carefully evaluated the requirements of the application, including data volume, performance needs, and scalability. After considering factors like relational vs. NoSQL databases and cloud-based vs. on-premises options, I selected a suitable database solution that met the project's needs.`,
    ]
    const formattedQuestions = q.map(string => string + "#$%");
    const formattedAnswers = a.map(string => string + "#$%");
    let result = {
      questions: formattedQuestions,
      answers: formattedAnswers
    }
    console.log("redirecting")
    router.push({pathname: `mockFeedback/${input}`, params:result})
  }

  const refreshCurrentAnswer = () => {
    setAnswers( answers => answers.length = index - 1)
  }

  
  return (
    <ImageBackground
      source={require('./bgmock.png')} // Ensure the path is correct to your bgmock.png
      style={{ flex: 1 }}
       resizeMode= 'cover'
    >
    {(isLoading || isTranscripting) && (
        <Loading additionStyle="absolute h-full w-full z-[1000] bg-black" />
      )}
    <SafeAreaView className="bg-[#111315] h-full w-full flex pt-16">
      <View className='flex-row justify-between '>
        <TouchableOpacity className='ml-6' onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
        <View className='flex-1 mr-8'>
          <Text className="text-white text-center text-xl font-geistBold mb-10">
            Mock Interview
          </Text>
        </View>
      </View>
      <Text className="text-white text-center font-geistSemiBold text-base mt-3">
        {input} Job Interview
      </Text>

      <View className="flex flex-row justify-center items-end mr-16 ml-3">
        <Image
          source={{ uri: "https://via.placeholder.com/40" }} 
          className="  w-10 h-10 rounded-full border-2 ml-8 border-white"
        />
        {index == questions?.length ? (
          <View className=" mt-10 w-auto ml-4 bg-[#242627] p-3 rounded-t-2xl rounded-br-2xl flex flex-col justify-between">
            <Text className="text-white font-geistRegular text-xs">
              There are no more questions {answers.length == questions.length ? "Your answer has been saved" : ""}
            </Text>
            <View className="mt-4 border-t rounded-full w-full border-gray-500"></View>
          </View>
          
        ) : (
          <View className=" mt-10 w-auto ml-4 bg-[#242627] p-3 rounded-t-2xl rounded-br-2xl flex flex-col justify-between">
            <Text className="text-white font-geistRegular text-xs">
              {questions?.[index]}
            </Text>
            <View className="mt-4 border-t rounded-full w-full border-gray-500"></View>
            <Text className="text-gray-400 font-geistMedium text-[10px] mt-2 text-right ">{index + 1} of {questions?.length}</Text>
          </View>

        )}
      </View>

      {answers?.length == index? (
        <View className="mt-20 mb-10 items-center ">
          <LinearGradient
            colors={["#3b5998", "#192f6a"]}
            className="h-48 w-48 rounded-full border border-gray-200 items-center justify-center">
            <Text className="text-white font-geistRegular text-xl">02.00</Text>
          </LinearGradient>
        </View>
      ) : (
        <View className=" mt-10 w-auto ml-4 bg-[#242627] p-3 rounded-t-2xl rounded-br-2xl flex flex-col justify-between">
          <Text className="text-white font-geistRegular text-xs">
            {answers?.[index]}
          </Text>
          <View className="mt-4 border-t rounded-full w-full border-gray-500"></View>
          <Text className="text-gray-400 font-geistMedium text-[10px] mt-2 text-right ">{index + 1} of {questions?.length + 1}</Text>
        </View>
      )}

      {/* Control Buttons */}
      <View className="flex-1"></View>
        {index == questions?.length ? (
        <View className="flex-row justify-center w-full mb-10">
          <TouchableOpacity 
            onPress={() => handleSubmit()}
            className="bg-[#1e1e1e] p-4 border border-white/20 rounded-full mx-16">
            <Text>Submit Interview</Text>
          </TouchableOpacity>
        </View>
        ) : 
          answers[index] ? (
            <View className="flex-row justify-center w-full mb-10">
              <TouchableOpacity 
                onPress={() => refreshCurrentAnswer()}
                className="bg-[#1e1e1e] p-4 border border-white/20 rounded-full ">
                <FontAwesome name="times" size={24} color="white" />
                </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => recording ? stopRecording() : startRecording()}
                className="bg-[#1e1e1e] p-4 border border-white/20 rounded-full mx-16">
                <FontAwesome name="microphone" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setIndex(i => i + 1)}
                className="bg-[#1e1e1e] p-4 border border-white/20 rounded-full ">
                <FontAwesome name="play" size={24} color="white" />
              </TouchableOpacity>
            </View>

          ) : (
            <View className="flex-row justify-center w-full mb-10">
              <TouchableOpacity 
                onPress={() => recording ? stopRecording() : startRecording()}
                className="bg-[#1e1e1e] p-4 border border-white/20 rounded-full mx-16">
                <FontAwesome name="microphone" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setIndex(i => i + 1)}
                className="bg-[#1e1e1e] p-4 border border-white/20 rounded-full ">
                <FontAwesome name="play" size={24} color="white" />
              </TouchableOpacity>
            </View>

          

        )}
    </SafeAreaView>
    </ImageBackground>
  );
}

export default MockTest