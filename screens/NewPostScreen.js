import React from "react";
import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import { Button } from "react-native-elements";
import { Formik } from "formik";
import FormInput from "../components/FormInput";
import * as Yup from "yup";
import ErrorMessage from "../components/ErrorMessage";
import firebase from "../config/Firebase/firebaseConfig";

function NewPostScreen({ route, navigation }) {
  const image = navigation.getParam("image");

  const validationSchema = Yup.object().shape({
    species: Yup.string()
      .label("Species")
      .required("Please enter a species")
  });

  function handleUpload(values, actions) {
    const { species, weight, length, bait } = values;
    let uid = firebase.auth().currentUser.uid;
    console.log(uid);

    const data = {
      species: species,
      weight: weight,
      length: length,
      bait: bait,
      image: image
    };

    //console.log(uid);

    firebase
      .firestore()
      .collection("users")
      .doc(uid)
      .collection("posts")
      .add(data);

    navigation.navigate("Home");
  }

  return (
    <ScrollView style={styles.container}>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 20
        }}
      >
        <Image
          source={{ uri: image }}
          style={{
            //resizeMode: "contain",
            height: 250,
            width: 500,
            aspectRatio: 1,
            borderBottomLeftRadius: 15,
            borderBottomRightRadius: 15,
            borderTopRightRadius: 15,
            borderTopLeftRadius: 15,
            overflow: "hidden"
          }}
        />
      </View>

      <Formik
        initialValues={{ species: "", weight: "", length: "", bait: "" }}
        onSubmit={values => console.log(values)}
        validationSchema={validationSchema}
        onSubmit={(values, actions) => {
          handleUpload(values, actions);
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          touched,
          errors
        }) => (
          <View>
            <FormInput
              name="species"
              value={values.species}
              onChangeText={handleChange("species")}
              placeholder="Enter Species"
              autoCapitalize="none"
              onBlur={handleBlur("species")}
            />
            <ErrorMessage errorValue={touched.species && errors.species} />

            <FormInput
              name="weight"
              value={values.weight}
              onChangeText={handleChange("weight")}
              placeholder="Enter Weight"
              autoCapitalize="none"
              onBlur={handleBlur("weight")}
            />
            <FormInput
              name="length"
              value={values.length}
              onChangeText={handleChange("length")}
              placeholder="Enter Length"
              autoCapitalize="none"
              onBlur={handleBlur("length")}
            />
            <FormInput
              name="bait"
              value={values.bait}
              onChangeText={handleChange("bait")}
              placeholder="Enter Bait"
              autoCapitalize="none"
              onBlur={handleBlur("bait")}
            />
            <Button onPress={handleSubmit} title="Submit" />
          </View>
        )}
      </Formik>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
    // justifyContent: "center"
  }
});

export default NewPostScreen;
