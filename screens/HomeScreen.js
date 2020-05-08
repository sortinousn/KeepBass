import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image
} from "react-native";
import { Button, Icon } from "react-native-elements";
import RBSheet from "react-native-raw-bottom-sheet";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import firebase from "../config/Firebase/firebaseConfig";
import { TextInput } from "react-native-gesture-handler";
import { object } from "yup";

function Home({ navigation }) {
  const [posts, setPosts] = useState([]);

  const refRBSheet = useRef();

  useEffect(() => {
    fetchPosts();
    console.log(posts);
  }, []);

  const fetchPosts = () => {
    let posts = [];

    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("posts")
      .get()
      .then(snap => {
        let docs = [];
        snap.docs.forEach(doc => {
          docs.push(doc.data());
        });
        setPosts(prevState => [...prevState, ...docs]);
      });
  };

  async function handleSignout() {
    try {
      await firebase.auth().signOut();
      navigation.navigate("Auth");
    } catch (error) {
      console.log(error);
    }
  }

  const Test = posts => (
    <>
      {posts.map(Object => (
        <Text>{Object.species}</Text>
      ))}
    </>
  );

  const getPermission = async permission => {
    let { status } = await Permissions.askAsync(permission);
    if (status !== "granted") {
      Linking.openURL("app-settings:");
      return false;
    }
    return true;
  };

  const selectPhoto = async () => {
    const status = await getPermission(Permissions.CAMERA_ROLL);
    if (status) {
      const result = await ImagePicker.launchImageLibraryAsync();
      if (!result.cancelled) {
        //this.props.navigation.navigate("NewPost", { image: result.uri });
      }
    }
  };

  const takePhoto = async () => {
    const status = await getPermission(Permissions.CAMERA);
    if (status) {
      const result = await ImagePicker.launchCameraAsync();
      if (!result.cancelled) {
        refRBSheet.current.close();

        navigation.navigate("NewPost", { image: result.uri });
        //console.log(result.uri);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Button
        onPress={() => refRBSheet.current.open()}
        raised
        title="Log a Catch!"
        buttonStyle={{ height: 50 }}
      />
      <Button
        title="Signout"
        onPress={handleSignout}
        titleStyle={{
          color: "#F57C00"
        }}
        type="clear"
      />
      <FlatList
        data={posts}
        style={{ flex: 1 }}
        renderItem={({ item }) => {
          return (
            <View style={styles.listItem}>
              <Image
                source={{ uri: item.image }}
                style={{
                  height: 100,
                  width: 110,
                  aspectRatio: 1,
                  borderBottomLeftRadius: 15,
                  borderBottomRightRadius: 15,
                  borderTopRightRadius: 15,
                  borderTopLeftRadius: 15,
                  overflow: "hidden"
                }}
              />
              <View style={{ alignItems: "center", flex: 1 }}>
                <Text style={{ fontWeight: "bold" }}>{item.species}</Text>
                <Text>{item.weight}</Text>
              </View>
              <TouchableOpacity
                style={{
                  height: 50,
                  width: 50,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              ></TouchableOpacity>
            </View>
          );
        }}
        keyExtractor={(item, index) => index}
      />

      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        height="200"
        customStyles={{
          wrapper: {
            backgroundColor: "transparent"
          },
          draggableIcon: {
            backgroundColor: "#000"
          }
        }}
      >
        <TouchableOpacity onPress={takePhoto}>
          <View
            style={{
              paddingVertical: 15,
              paddingHorizontal: 10,
              flexDirection: "row",
              alignItems: "center"
            }}
          >
            <Icon reverse name="ios-aperture" type="ionicon" color="#517fa4" />
            <Text>Take a Photo</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={takePhoto}>
          <View
            style={{
              paddingVertical: 15,
              paddingHorizontal: 10,
              flexDirection: "row",
              alignItems: "center"
            }}
          >
            <Icon reverse name="picture" type="antdesign" color="#517fa4" />
            <Text>Choose Image from Gallery</Text>
          </View>
        </TouchableOpacity>
      </RBSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
    // alignItems: "center",
  },
  listItem: {
    margin: 10,
    padding: 10,
    backgroundColor: "#FFF",
    width: "80%",
    flex: 1,
    alignSelf: "center",
    flexDirection: "row",
    borderRadius: 5
  }
});

export default Home;
