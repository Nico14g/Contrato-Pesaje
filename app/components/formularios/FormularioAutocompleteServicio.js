import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Autocomplete from "react-native-autocomplete-input";

export const FormularioAutocompleteServicio = (props) => {
  const { servicios, servicio, setServicio, setValues, values } = props;

  const [hideResults, setHideResults] = useState({
    nombreServicio: true,
    ubicacion: true,
    faenas: true,
    temporada: true,
    horasJornada: true,
    distribucionHoras: true,
    sueldo: true,
    labor: true,
  });

  const [options, setOptions] = useState({
    nombreServicio: [],
    ubicacion: [],
    faenas: [],
    temporada: [],
    horasJornada: [],
    distribucionHoras: [],
    sueldo: [],
    labor: [],
  });

  useEffect(() => {
    let list = {
      nombreServicio: query("nombreServicio"),
      ubicacion: query("ubicacion"),
      faenas: query("faenas"),
      temporada: query("temporada"),
      horasJornada: query("horasJornada"),
      distribucionHoras: query("distribucionHoras"),
      sueldo: query("sueldo"),
      labor: query("labor"),
    };

    setOptions(list);
  }, [servicios]);

  function query(key) {
    let data = [];
    servicios.map((servicio) => data.push(servicio[key]));
    return data;
  }

  const seleccion = (item, key) => {
    const data = query(key);
    const index = data.indexOf(item);
    let newServicio = {
      nombreServicio: servicios[index].nombreServicio,
      ubicacion: servicios[index].ubicacion,
      faenas: servicios[index].faenas,
      temporada: servicios[index].temporada,
      horasJornada: servicios[index].horasJornada,
      distribucionHoras: servicios[index].distribucionHoras,
      sueldo: servicios[index].sueldo,
      labor: servicios[index].labor,
    };
    setValues(newServicio);
    setServicio(newServicio);
  };

  return (
    <View style={styles.scrollView}>
      <Autocomplete
        style={styles.autoComplete}
        containerStyle={styles.autoCompleteContainer}
        inputContainerStyle={styles.autoCompleteInput}
        data={options.nombreServicio}
        placeholderTextColor="gray"
        placeholder="Nombre Servicio"
        value={servicio.nombreServicio}
        onChangeText={(text) => {
          setServicio({ ...servicio, nombreServicio: text });
          setValues({ ...values, nombreServicio: text });
          setOptions({
            ...options,
            nombreServicio: query("nombreServicio").filter((servicio) => {
              return servicio.toLowerCase().includes(text.toLowerCase());
            }),
          });
          setHideResults({ ...hideResults, nombreServicio: false });
        }}
        onFocus={() =>
          setHideResults({ ...hideResults, nombreServicio: false })
        }
        onEndEditing={() =>
          setHideResults({ ...hideResults, nombreServicio: true })
        }
        hideResults={hideResults.nombreServicio}
        flatListProps={{
          nestedScrollEnabled: () => true,
          keyExtractor: (_, idx) => idx,
          renderItem: ({ item }) => (
            <TouchableOpacity
              onPress={() => {
                seleccion(item, "nombreServicio");
                setOptions({
                  ...options,
                  nombreServicio: [],
                });
                setHideResults({
                  ...hideResults,
                  nombreServicio: true,
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
        data={options.ubicacion}
        placeholderTextColor="gray"
        placeholder="Ubicación"
        value={servicio.ubicacion}
        onChangeText={(text) => {
          setServicio({ ...servicio, ubicacion: text });
          setValues({ ...values, ubicacion: text });
          setOptions({
            ...options,
            ubicacion: query("ubicacion").filter((servicio) => {
              return servicio.toLowerCase().includes(text.toLowerCase());
            }),
          });
          setHideResults({ ...hideResults, ubicacion: false });
        }}
        onFocus={() => setHideResults({ ...hideResults, ubicacion: false })}
        onEndEditing={() => setHideResults({ ...hideResults, ubicacion: true })}
        hideResults={hideResults.ubicacion}
        flatListProps={{
          nestedScrollEnabled: () => true,
          keyExtractor: (_, idx) => idx,
          renderItem: ({ item }) => (
            <TouchableOpacity
              onPress={() => {
                seleccion(item, "ubicacion");
                setOptions({
                  ...options,
                  ubicacion: [],
                });
                setHideResults({ ...hideResults, ubicacion: true });
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
        data={options.faenas}
        placeholderTextColor="gray"
        placeholder="Faenas"
        value={servicio.faenas}
        onChangeText={(text) => {
          setServicio({ ...servicio, faenas: text });
          setValues({ ...values, faenas: text });
          setOptions({
            ...options,
            faenas: query("faenas").filter((servicio) => {
              return servicio.toLowerCase().includes(text.toLowerCase());
            }),
          });
          setHideResults({ ...hideResults, faenas: false });
        }}
        onFocus={() => setHideResults({ ...hideResults, faenas: false })}
        onEndEditing={() => setHideResults({ ...hideResults, faenas: true })}
        hideResults={hideResults.faenas}
        flatListProps={{
          nestedScrollEnabled: () => true,
          keyExtractor: (_, idx) => idx,
          renderItem: ({ item }) => (
            <TouchableOpacity
              onPress={() => {
                seleccion(item, "faenas");
                setOptions({
                  ...options,
                  faenas: [],
                });
                setHideResults({ ...hideResults, faenas: true });
              }}
            >
              <Text style={{ fontSize: 16 }}>{item}</Text>
            </TouchableOpacity>
          ),
        }}
      />

      <Autocomplete
        style={styles.autoComplete}
        containerStyle={styles.autoCompleteContainer}
        inputContainerStyle={styles.autoCompleteInput}
        data={options.temporada}
        placeholderTextColor="gray"
        placeholder="Temporada"
        value={servicio.temporada}
        onChangeText={(text) => {
          setServicio({ ...servicio, temporada: text });
          setValues({ ...values, temporada: text });
          setOptions({
            ...options,
            temporada: query("temporada").filter((servicio) => {
              return servicio.toLowerCase().includes(text.toLowerCase());
            }),
          });
          setHideResults({ ...hideResults, temporada: false });
        }}
        onFocus={() => setHideResults({ ...hideResults, temporada: false })}
        onEndEditing={() => setHideResults({ ...hideResults, temporada: true })}
        hideResults={hideResults.temporada}
        flatListProps={{
          nestedScrollEnabled: true,
          keyExtractor: (_, idx) => idx,
          renderItem: ({ item }) => (
            <TouchableOpacity
              onPress={() => {
                seleccion(item, "temporada");
                setOptions({
                  ...options,
                  temporada: [],
                });
                setHideResults({ ...hideResults, temporada: true });
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
        data={options.horasJornada}
        placeholderTextColor="gray"
        placeholder="Horas por Jornada"
        value={servicio.horasJornada}
        onChangeText={(text) => {
          setServicio({ ...servicio, horasJornada: text });
          setValues({ ...values, horasJornada: text });
          setOptions({
            ...options,
            horasJornada: query("horasJornada").filter((servicio) => {
              return servicio.toLowerCase().includes(text.toLowerCase());
            }),
          });
          setHideResults({ ...hideResults, horasJornada: false });
        }}
        onFocus={() => setHideResults({ ...hideResults, horasJornada: false })}
        onEndEditing={() =>
          setHideResults({ ...hideResults, horasJornada: true })
        }
        hideResults={hideResults.horasJornada}
        flatListProps={{
          nestedScrollEnabled: () => true,
          keyExtractor: (_, idx) => idx,
          renderItem: ({ item }) => (
            <TouchableOpacity
              onPress={() => {
                seleccion(item, "horasJornada");
                setOptions({
                  ...options,
                  horasJornada: [],
                });
                setHideResults({ ...hideResults, horasJornada: true });
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
        data={options.distribucionHoras}
        placeholderTextColor="gray"
        placeholder="Distribución de Horas"
        value={servicio.distribucionHoras}
        onChangeText={(text) => {
          setServicio({ ...servicio, distribucionHoras: text });
          setValues({ ...values, distribucionHoras: text });
          setOptions({
            ...options,
            distribucionHoras: query("distribucionHoras").filter((servicio) => {
              return servicio.toLowerCase().includes(text.toLowerCase());
            }),
          });
          setHideResults({ ...hideResults, distribucionHoras: false });
        }}
        onFocus={() =>
          setHideResults({ ...hideResults, distribucionHoras: false })
        }
        onEndEditing={() =>
          setHideResults({ ...hideResults, distribucionHoras: true })
        }
        hideResults={hideResults.distribucionHoras}
        flatListProps={{
          nestedScrollEnabled: () => true,
          keyExtractor: (_, idx) => idx,
          renderItem: ({ item }) => (
            <TouchableOpacity
              onPress={() => {
                seleccion(item, "distribucionHoras");

                setOptions({
                  ...options,
                  distribucionHoras: [],
                });
                setHideResults({
                  ...hideResults,
                  distribucionHoras: true,
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
        data={options.sueldo}
        placeholderTextColor="gray"
        placeholder="Sueldo"
        value={servicio.sueldo}
        onChangeText={(text) => {
          setServicio({ ...servicio, sueldo: text });
          setValues({ ...values, sueldo: text });
          setOptions({
            ...options,
            sueldo: query("sueldo").filter((servicio) => {
              return servicio.toLowerCase().includes(text.toLowerCase());
            }),
          });
          setHideResults({ ...hideResults, sueldo: false });
        }}
        onFocus={() => setHideResults({ ...hideResults, sueldo: false })}
        onEndEditing={() => setHideResults({ ...hideResults, sueldo: true })}
        hideResults={hideResults.sueldo}
        flatListProps={{
          nestedScrollEnabled: () => true,
          keyExtractor: (_, idx) => idx,
          renderItem: ({ item }) => (
            <TouchableOpacity
              onPress={() => {
                seleccion(item, "sueldo");
                setOptions({
                  ...options,
                  sueldo: [],
                });
                setHideResults({ ...hideResults, sueldo: true });
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
        data={options.labor}
        placeholderTextColor="gray"
        placeholder="Labor"
        value={servicio.labor}
        onChangeText={(text) => {
          setServicio({ ...servicio, labor: text });
          setValues({ ...values, labor: text });
          setOptions({
            ...options,
            labor: query("labor").filter((servicio) => {
              return servicio.toLowerCase().includes(text.toLowerCase());
            }),
          });
          setHideResults({ ...hideResults, labor: false });
        }}
        onFocus={() => setHideResults({ ...hideResults, labor: false })}
        onEndEditing={() => setHideResults({ ...hideResults, labor: true })}
        hideResults={hideResults.labor}
        flatListProps={{
          nestedScrollEnabled: () => true,
          keyExtractor: (_, idx) => idx,
          renderItem: ({ item }) => (
            <TouchableOpacity
              onPress={() => {
                seleccion(item, "labor");
                setOptions({
                  ...options,
                  labor: [],
                });
                setHideResults({ ...hideResults, labor: true });
              }}
            >
              <Text style={{ fontSize: 16 }}>{item}</Text>
            </TouchableOpacity>
          ),
        }}
      />
    </View>
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
