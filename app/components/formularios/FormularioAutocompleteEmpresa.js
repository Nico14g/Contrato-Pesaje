import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Autocomplete from "react-native-autocomplete-input";
import { validateRut, formatRut } from "@fdograph/rut-utilities";

export const FormularioAutocompleteEmpresa = (props) => {
  const {
    empresas,
    empresa,
    setEmpresa,
    setValues,
    values,
    setValidateRutRazon,
    setValidateRutRepresentante,
  } = props;

  const [hideResults, setHideResults] = useState({
    cargoRepresentante: true,
    ciudad: true,
    direccion: true,
    razonSocial: true,
    representante: true,
    rutRazonSocial: true,
    rutRepresentante: true,
  });

  const [options, setOptions] = useState({
    cargoRepresentante: [],
    ciudad: [],
    direccion: [],
    razonSocial: [],
    representante: [],
    rutRazonSocial: [],
    rutRepresentante: [],
  });

  useEffect(() => {
    let list = {
      cargoRepresentante: query("cargoRepresentante"),
      ciudad: query("ciudad"),
      direccion: query("direccion"),
      razonSocial: query("razonSocial"),
      representante: query("representante"),
      rutRazonSocial: query("rutRazonSocial"),
      rutRepresentante: query("rutRepresentante"),
    };

    setOptions(list);
  }, [empresas]);

  function query(key) {
    let data = [];
    empresas.map((empresa) => data.push(empresa[key]));
    return data;
  }

  const seleccion = (item, key) => {
    const data = query(key);
    const index = data.indexOf(item);
    let newEmpresa = {
      cargoRepresentante: empresas[index].cargoRepresentante,
      ciudad: empresas[index].ciudad,
      direccion: empresas[index].direccion,
      razonSocial: empresas[index].razonSocial,
      representante: empresas[index].representante,
      rutRazonSocial: empresas[index].rutRazonSocial,
      rutRepresentante: empresas[index].rutRepresentante,
    };
    setValues(newEmpresa);
    setEmpresa(newEmpresa);
  };

  return (
    // <ScrollView horizontal={false} style={styles.ScrollViewA}>
    //   <ScrollView horizontal={true} style={styles.ScrollViewB}>
    <View style={styles.scrollView}>
      <Autocomplete
        style={styles.autoComplete}
        containerStyle={styles.autoCompleteContainer}
        inputContainerStyle={styles.autoCompleteInput}
        data={options.razonSocial}
        placeholderTextColor="gray"
        placeholder="Razón Social"
        value={empresa.razonSocial}
        onChangeText={(text) => {
          setEmpresa({ ...empresa, razonSocial: text });
          setValues({ ...values, razonSocial: text });
          setOptions({
            ...options,
            razonSocial: query("razonSocial").filter((empresa) => {
              return empresa.toLowerCase().includes(text.toLowerCase());
            }),
          });
          setHideResults({ ...hideResults, razonSocial: false });
        }}
        onFocus={() => setHideResults({ ...hideResults, razonSocial: false })}
        onEndEditing={() =>
          setHideResults({ ...hideResults, razonSocial: true })
        }
        hideResults={hideResults.razonSocial}
        flatListProps={{
          nestedScrollEnabled: () => true,
          keyExtractor: (_, idx) => idx,
          renderItem: ({ item }) => (
            <TouchableOpacity
              onPress={() => {
                seleccion(item, "razonSocial");
                setOptions({
                  ...options,
                  razonSocial: [],
                });
                setHideResults({ ...hideResults, razonSocial: true });
              }}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          ),
        }}
      />

      <Autocomplete
        style={styles.autoComplete}
        containerStyle={styles.autoCompleteContainerRut}
        inputContainerStyle={styles.autoCompleteInput}
        data={options.rutRazonSocial}
        placeholderTextColor="gray"
        placeholder="Rut Razón Social"
        value={empresa.rutRazonSocial}
        onChangeText={(text) => {
          setEmpresa({ ...empresa, rutRazonSocial: text });
          setValues({ ...values, rutRazonSocial: text });
          setValidateRutRazon(!validateRut(text));
          setValues({
            ...values,
            rutRazonSocial: formatRut(text),
          });
          setOptions({
            ...options,
            rutRazonSocial: query("rutRazonSocial").filter((empresa) => {
              return empresa.toLowerCase().includes(text.toLowerCase());
            }),
          });
          setHideResults({ ...hideResults, rutRazonSocial: false });
        }}
        onFocus={() =>
          setHideResults({ ...hideResults, rutRazonSocial: false })
        }
        onEndEditing={() => {
          setValidateRutRazon(!validateRut(empresa.rutRazonSocial));
          setValues({
            ...values,
            rutRazonSocial: formatRut(empresa.rutRazonSocial),
          });
          setHideResults({ ...hideResults, rutRazonSocial: true });
        }}
        hideResults={hideResults.rutRazonSocial}
        flatListProps={{
          nestedScrollEnabled: () => true,
          keyExtractor: (_, idx) => idx,
          renderItem: ({ item }) => (
            <TouchableOpacity
              onPress={() => {
                seleccion(item, "rutRazonSocial");

                setOptions({
                  ...options,
                  rutRazonSocial: [],
                });
                setHideResults({ ...hideResults, rutRazonSocial: true });
              }}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          ),
        }}
      />
      {!validateRut(empresa.rutRazonSocial) ? (
        <Text
          style={{
            color: "red",
            alignSelf: "flex-start",
            marginBottom: 8,
            fontSize: 12,
            marginTop: 5,
          }}
        >
          {" "}
          Rut no válido
        </Text>
      ) : (
        <View style={{ marginBottom: 25 }}></View>
      )}

      <Autocomplete
        style={styles.autoComplete}
        containerStyle={styles.autoCompleteContainer}
        inputContainerStyle={styles.autoCompleteInput}
        data={options.ciudad}
        placeholderTextColor="gray"
        placeholder="Ciudad"
        value={empresa.ciudad}
        onChangeText={(text) => {
          setEmpresa({ ...empresa, ciudad: text });
          setValues({ ...values, ciudad: text });
          setOptions({
            ...options,
            ciudad: query("ciudad").filter((empresa) => {
              return empresa.toLowerCase().includes(text.toLowerCase());
            }),
          });
          setHideResults({ ...hideResults, ciudad: false });
        }}
        onFocus={() => setHideResults({ ...hideResults, ciudad: false })}
        onEndEditing={() => setHideResults({ ...hideResults, ciudad: true })}
        hideResults={hideResults.ciudad}
        flatListProps={{
          nestedScrollEnabled: () => true,
          keyExtractor: (_, idx) => idx,
          renderItem: ({ item }) => (
            <TouchableOpacity
              onPress={() => {
                seleccion(item, "ciudad");
                setOptions({
                  ...options,
                  ciudad: [],
                });
                setHideResults({ ...hideResults, ciudad: true });
              }}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          ),
        }}
      />

      <Autocomplete
        style={styles.autoComplete}
        containerStyle={styles.autoCompleteContainer}
        inputContainerStyle={styles.autoCompleteInput}
        data={options.representante}
        placeholderTextColor="gray"
        placeholder="Representante Legal"
        value={empresa.representante}
        onChangeText={(text) => {
          setEmpresa({ ...empresa, representante: text });
          setValues({ ...values, representante: text });
          setOptions({
            ...options,
            representante: query("representante").filter((empresa) => {
              return empresa.toLowerCase().includes(text.toLowerCase());
            }),
          });
          setHideResults({ ...hideResults, representante: false });
        }}
        onFocus={() => setHideResults({ ...hideResults, representante: false })}
        onEndEditing={() =>
          setHideResults({ ...hideResults, representante: true })
        }
        hideResults={hideResults.representante}
        flatListProps={{
          nestedScrollEnabled: () => true,
          keyExtractor: (_, idx) => idx,
          renderItem: ({ item }) => (
            <TouchableOpacity
              onPress={() => {
                seleccion(item, "representante");
                setOptions({
                  ...options,
                  representante: [],
                });
                setHideResults({ ...hideResults, representante: true });
              }}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          ),
        }}
      />

      <Autocomplete
        style={styles.autoComplete}
        containerStyle={styles.autoCompleteContainerRut}
        inputContainerStyle={styles.autoCompleteInput}
        data={options.rutRepresentante}
        placeholderTextColor="gray"
        placeholder="Rut Representante Legal"
        value={empresa.rutRepresentante}
        onChangeText={(text) => {
          setEmpresa({ ...empresa, rutRepresentante: text });
          setValues({ ...values, rutRepresentante: text });
          setValidateRutRepresentante(!validateRut(text));
          setValues({
            ...values,
            rutRepresentante: formatRut(text),
          });
          setOptions({
            ...options,
            rutRepresentante: query("rutRepresentante").filter((empresa) => {
              return empresa.toLowerCase().includes(text.toLowerCase());
            }),
          });
          setHideResults({ ...hideResults, rutRepresentante: false });
        }}
        onFocus={() =>
          setHideResults({ ...hideResults, rutRepresentante: false })
        }
        onEndEditing={() => {
          setValidateRutRepresentante(!validateRut(empresa.rutRepresentante));
          setValues({
            ...values,
            rutRepresentante: formatRut(empresa.rutRepresentante),
          });
          setHideResults({ ...hideResults, rutRepresentante: true });
        }}
        hideResults={hideResults.rutRepresentante}
        flatListProps={{
          nestedScrollEnabled: () => true,
          keyExtractor: (_, idx) => idx,
          renderItem: ({ item }) => (
            <TouchableOpacity
              onPress={() => {
                seleccion(item, "rutRepresentante");
                setOptions({
                  ...options,
                  rutRepresentante: [],
                });
                setHideResults({ ...hideResults, rutRepresentante: true });
              }}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          ),
        }}
      />
      {!validateRut(empresa.rutRepresentante) ? (
        <Text
          style={{
            color: "red",
            alignSelf: "flex-start",

            marginBottom: 8,
            fontSize: 12,
            marginTop: 5,
          }}
        >
          Rut no válido
        </Text>
      ) : (
        <View style={{ marginBottom: 25 }}></View>
      )}

      <Autocomplete
        style={styles.autoComplete}
        containerStyle={styles.autoCompleteContainer}
        inputContainerStyle={styles.autoCompleteInput}
        data={options.cargoRepresentante}
        placeholderTextColor="gray"
        placeholder="Cargo de Representante"
        value={empresa.cargoRepresentante}
        onChangeText={(text) => {
          setEmpresa({ ...empresa, cargoRepresentante: text });
          setValues({ ...values, cargoRepresentante: text });
          setOptions({
            ...options,
            cargoRepresentante: query("cargoRepresentante").filter(
              (empresa) => {
                return empresa.toLowerCase().includes(text.toLowerCase());
              }
            ),
          });
          setHideResults({ ...hideResults, cargoRepresentante: false });
        }}
        onFocus={() =>
          setHideResults({ ...hideResults, cargoRepresentante: false })
        }
        onEndEditing={() =>
          setHideResults({ ...hideResults, cargoRepresentante: true })
        }
        hideResults={hideResults.cargoRepresentante}
        flatListProps={{
          nestedScrollEnabled: () => true,
          keyExtractor: (_, idx) => idx,
          renderItem: ({ item }) => (
            <TouchableOpacity
              onPress={() => {
                seleccion(item, "cargoRepresentante");
                setOptions({
                  ...options,
                  cargoRepresentante: [],
                });
                setHideResults({
                  ...hideResults,
                  cargoRepresentante: true,
                });
              }}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          ),
        }}
      />

      <Autocomplete
        style={styles.autoComplete}
        containerStyle={styles.autoCompleteContainer}
        inputContainerStyle={styles.autoCompleteInput}
        data={options.direccion}
        placeholderTextColor="gray"
        placeholder="Dirección Empresa"
        value={empresa.direccion}
        onChangeText={(text) => {
          setEmpresa({ ...empresa, direccion: text });
          setValues({ ...values, direccion: text });
          setOptions({
            ...options,
            direccion: query("direccion").filter((empresa) => {
              return empresa.toLowerCase().includes(text.toLowerCase());
            }),
          });
          setHideResults({ ...hideResults, direccion: false });
        }}
        onFocus={() => setHideResults({ ...hideResults, direccion: false })}
        onEndEditing={() => setHideResults({ ...hideResults, direccion: true })}
        hideResults={hideResults.direccion}
        flatListProps={{
          nestedScrollEnabled: () => true,
          keyExtractor: (_, idx) => idx,
          renderItem: ({ item }) => (
            <TouchableOpacity
              onPress={() => {
                seleccion(item, "direccion");
                setOptions({
                  ...options,
                  direccion: [],
                });
                setHideResults({ ...hideResults, direccion: true });
              }}
            >
              <Text style={{ fontSize: 16 }}>{item}</Text>
            </TouchableOpacity>
          ),
        }}
      />
    </View>
    //   </ScrollView>
    // </ScrollView>
  );
};

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    position: "absolute",
    right: "10%",
    left: "10%",
  },
  autoComplete: {
    paddingHorizontal: 10,
    height: 50,
    fontSize: 16,
  },
  autoCompleteContainer: {
    borderRadius: 7,
    marginBottom: 25,
    width: Dimensions.get("window").width * 0.85,
  },
  autoCompleteContainerRut: {
    borderRadius: 7,
    width: Dimensions.get("window").width * 0.85,
  },
  autoCompleteInput: {
    borderRadius: 7,
    borderWidth: 1,
    backgroundColor: "white",
  },
  ScrollViewA: {
    alignSelf: "center",
    maxHeight: "70%",
  },
  scrollView: {
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center",
    maxWidth: "90%",
  },
});
/*
        flatListProps={{
          keyExtractor: (_, idx) => idx,
          renderItem: ({ item }) => (
            <TouchableOpacity 
              onPress={() => {
                console.log(item);
                setEmpresa({ ...empresa, razonSocial: item });
                //setOptions({
                //  ...options,
                //  razonSocial: [],
                //});
                //setHideResults({ ...hideResults, razonSocial: true });
              }}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          ),
        }}
*/
