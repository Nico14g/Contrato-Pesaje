import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeData = async (value, STORAGE_KEY) => {
  try {
    const jsonValue = JSON.stringify(value);
    return await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (e) {
    // saving error
  }
};

export const readData = async (STORAGE_KEY) => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    let valor;
    jsonValue !== null ? (valor = JSON.parse(jsonValue)) : (valor = null);
    return valor;
  } catch (e) {
    alert("Se ha producido un fallo al recuperar las plantillas");
  }
};
