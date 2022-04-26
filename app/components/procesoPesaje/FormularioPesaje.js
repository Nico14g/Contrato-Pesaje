import React, { useState } from "react";
import { StyleSheet, Dimensions, Text, View } from "react-native";
import { TextInput } from "react-native-paper";
import Autocomplete from "react-native-autocomplete-input";
import { Input, Icon, Button } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FormikProvider } from "formik";
import { Picker } from "@react-native-picker/picker";

export default function FormularioPesaje(props) {
  const { formik, bandejas } = props;
  const [selectedBandeja, setSelectedBandeja] = useState();
  const [isSelected, setIsSelected] = useState(true);
  const { setValues, values } = formik;

  const handleValueChange = (itemValue) => {
    setSelectedBandeja(itemValue);
    if (itemValue !== "") {
      const bandeja = bandejas.find((bandeja) => bandeja.id === itemValue);
      setValues({ ...values, ...bandeja });
      setIsSelected(false);
    }
  };

  const actualizarEstado = (e, key) => {
    setValues({ ...values, [key]: e });
    if (key === "originalWeight") {
      console.log(selectedBandeja);
      values.originalWeight = e;
      setValues({
        ...values,
        weight: parseFloat(e) - values.dcto,
      });
    }
  };

  return (
    <FormikProvider value={formik}>
      <View style={styles.viewPicker}>
        <Picker
          selectedValue={selectedBandeja}
          onValueChange={(itemValue, itemIndex) => handleValueChange(itemValue)}
          placeholder="Seleccione un Tipo de Bandeja"
          mode="dropdown"
          style={styles.pickerContainer}
        >
          {isSelected && (
            <Picker.Item label="Seleccione un Tipo de Bandeja" value="" />
          )}
          {bandejas.map((bandeja) => (
            <Picker.Item
              key={bandeja.id}
              label={bandeja.nombre}
              value={bandeja.id}
            />
          ))}
        </Picker>
      </View>

      <View style={styles.containerTextFields}>
        <TextInput
          mode="outlined"
          style={styles.textInput}
          outlineColor="lightgrey"
          placeholder="Peso Bruto"
          onChangeText={(e) => actualizarEstado(e, "originalWeight")}
          keyboardType="numeric"
          value={values.originalWeight.toString()}
          activeOutlineColor="lightgrey"
          right={<TextInput.Affix text="KG" />}
        />
        <View>
          <Icon name="arrow-right" type="material-community" />
        </View>
        <TextInput
          mode="outlined"
          style={styles.textInput}
          outlineColor="lightgrey"
          activeOutlineColor="lightgrey"
          placeholder="Peso Neto"
          onChangeText={(e) => actualizarEstado(e, "weight")}
          keyboardType="numeric"
          value={values.weight.toString()}
          right={<TextInput.Affix text="KG" />}
        />
      </View>
    </FormikProvider>
  );
}

const styles = StyleSheet.create({
  autoComplete: {
    paddingHorizontal: 10,
    height: 50,
    fontSize: 16,
  },
  autoCompleteContainer: {
    alignSelf: "center",
    borderRadius: 7,
    marginTop: 15,
    marginBottom: 25,
    width: Dimensions.get("window").width * 0.85,
  },
  autoCompleteInput: {
    borderRadius: 7,
    borderWidth: 1,
    backgroundColor: "white",
  },
  pickerContainer: {
    alignSelf: "center",
    width: Dimensions.get("window").width * 0.85,
    backgroundColor: "white",
  },
  viewPicker: {
    paddingVertical: 2,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderRadius: 7,
    marginTop: 10,
    alignSelf: "center",
    width: Dimensions.get("window").width * 0.86,
    borderWidth: 1,
    borderColor: "lightgrey",
  },
  containerTextFields: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
  },
  container: {
    left: 0,
    marginTop: 15,
    alignSelf: "center",
    maxWidth: Dimensions.get("window").width * 0.45,
    borderColor: "gray",
  },

  inputContainer: {
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "lightgrey",
    backgroundColor: "white",
    height: 50,
  },
  input: {
    height: 49,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  textInput: {
    width: Dimensions.get("window").width * 0.37,
    backgroundColor: "white",
    height: 50,
    margin: 10,
  },
});
