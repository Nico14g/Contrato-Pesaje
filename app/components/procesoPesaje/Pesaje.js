import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Platform } from "react-native";
import { Icon, Button, Text } from "react-native-elements";
import Autocomplete from "react-native-autocomplete-input";

export default function Pesaje(props) {
  const { setIndex, user } = props;
  const componentMounted = useRef(true);

  useEffect(() => {
    if (componentMounted.current) {
      console.log("hola");
    }
    return () => {
      componentMounted.current = false;
    };
  }, []);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.item}>
          <Text h4>Pesaje de fruta</Text>
        </View>

        <View style={styles.nuevo}></View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    maxHeight: "12%",
    marginTop: 20,
  },

  item: {
    width: "70%",
    flexDirection: "row-reverse",
    alignSelf: "center",
  },

  nuevo: {
    alignItems: "center",
    width: "30%",
  },
  boton: {
    width: 80,
    height: 36,
    backgroundColor: "#99c781",
    borderColor: "#3f9d2f",
    shadowOffset: { width: -1, height: 3 },
    shadowRadius: 4,
    shadowColor: "gray",
    borderRadius: 20,
  },

  containerSearchBar: {
    marginBottom: 15,
    alignSelf: "center",
    alignItems: "center",
    width: "90%",
    padding: 0,
  },
  inputSearchBar: {
    backgroundColor: "#ffffff",
  },
});
