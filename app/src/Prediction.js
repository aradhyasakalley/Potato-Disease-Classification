import React, { useState } from 'react';
import { View, TouchableOpacity, Image, Text, ActivityIndicator, StyleSheet } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { ImageBackground } from 'react-native';
import { BlurView } from '@react-native-community/blur';

const placeholderImage = require('../assets/download.png'); // Replace with the actual path

const App = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const selectImageFromCamera = async () => {
    // Use the camera to take a photo
    try {
      const image = await ImagePicker.openCamera({
        width: 300,
        height: 400,
        cropping: true,
      });

      setSelectedImage(image);
      setPrediction(null); // Clear previous prediction
    } catch (error) {
      console.log(error);
    }
  };

  const selectImageFromGallery = async () => {
    // Select an image from the gallery
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
      });

      setSelectedImage(image);
      setPrediction(null); // Clear previous prediction
    } catch (error) {
      console.log(error);
    }
  };

  const uploadImage = async () => {
    const formData = new FormData();
    formData.append('file', {
      uri: selectedImage.path,
      name: 'image.jpg',
      type: 'image/jpeg',
    });

    try {
      setIsLoading(true); // Start loading animation
      const response = await axios.post('https://us-central1-sodium-pathway-396811.cloudfunctions.net/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Handle the response, set prediction state, stop loading animation
      setPrediction(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    
    <View style={styles.container}>
      <Text style={{ fontSize: 40, textAlign: 'center', color: 'darkgreen' }}>Potato Disease Classifier</Text>
      <Text style={{ fontSize: 20, textAlign: 'center', marginTop: 20 }}>Capture an image or use gallery</Text>
      <View style={styles.imageContainer}>
        <Image source={selectedImage ? { uri: selectedImage.path } : placeholderImage} style={styles.image} />
        <TouchableOpacity style={styles.button} onPress={uploadImage}>
          <Text style={styles.buttonText}>Upload and Predict</Text>
        </TouchableOpacity>
      </View>
      {isLoading && (
        <ActivityIndicator style={styles.loadingIndicator} size="large" color="blue" />
      )}
      {prediction && (
        <View style={styles.predictionContainer}>
          <Text style={styles.predictionText}>Predicted Class: {prediction.class}</Text>
          <Text style={styles.predictionText}>Confidence: {prediction.confidence}</Text>
        </View>
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.iconButton} onPress={selectImageFromCamera}>
          <Icon name="camera" size={60} color="white"  />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={selectImageFromGallery}>
          <Icon name="image" size={60} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    alignItems: 'center',
  },
  buttonContainer: {
    marginTop: 50,
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  iconButton: {
    backgroundColor: 'darkgreen',
    padding: 10,
    borderRadius: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 12,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: 'darkgreen',
    borderRadius: 10,
    width: 320,
    height: 60,
    marginTop: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 30,
    borderWidth: 5,
    borderColor: 'darkgreen',
  },
  predictionContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  predictionText: {
    fontSize: 22,
    marginBottom: 5,
    fontWeight : 'bold',
    color : 'darkgreen'
  },
  loadingIndicator: {
    marginTop: 30,
  },
});

export default App;
