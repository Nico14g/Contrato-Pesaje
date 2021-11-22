import React from "react";
import {
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Card, Icon, Avatar, Image } from "react-native-elements";
import { size } from "lodash";

export const ListaPlantillas = (props) => {
  const { plantillas } = props;
  //const plantillas = ["a", "d", "c  "];
  return (
    <>
      <ScrollView style={styles.container}>
        {size(plantillas) > 0 ? (
          <FlatList
            data={plantillas}
            renderItem={(plantilla) => <Plantilla plantilla={plantilla} />}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : (
          <View style={styles.loaderPlantilla}>
            <ActivityIndicator size="large" />
            <Text>Cargando plantillas</Text>
          </View>
        )}
      </ScrollView>
    </>
  );
};

function Plantilla(props) {
  const { plantilla } = props;
  console.log(plantilla);
  return (
    <Card>
      <View>
        <Avatar rounded icon={{ name: "person-pin-circle" }} />
        <Text>{plantilla.item}</Text>
        <Text> {plantilla.index} </Text>
        <Icon
          onPress={console.log("a")}
          type="material-community"
          name="play-circle-outline"
          size={100}
          color="#000000"
        />
      </View>
    </Card>
  );
}
const styles = StyleSheet.create({
  container: { maxHeight: "60%", minHeight: "60%" },
  loaderPlantilla: { marginTop: 10, marginBottom: 10, alignItems: "center" },
});
