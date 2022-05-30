import React, { useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { useFormik, FormikProvider } from "formik";
import { Button, Dialog, Portal, Provider } from "react-native-paper";
import { db } from "../../api/firebase";
import { doc, setDoc, addDoc, collection } from "firebase/firestore";
import FormularioEnlace from "./FormularioEnlace";
import { Picker } from "@react-native-picker/picker";
import { validateRut, formatRut } from "@fdograph/rut-utilities";
import EscrituraNFC from "./nfc/EscrituraNFC";

export default function ModalEnlace(props) {
  const { open, setOpen, user, temporeros, setOpenSnackbar, setMessage } =
    props;
  const [selectedTemporero, setSelectedTemporero] = useState(temporeros[0]);
  const [mostrarEscrituraNFC, setMostrarEscrituraNFC] = useState(false);

  const hideDialog = () => setOpen(false);

  const error = () => {
    setMessage("Ha ocurrido un error.");
    setOpenSnackbar(true);
    setOpen(false);
  };

  const guardarDatos = async () => {};
  return (
    <>
      <Provider>
        <View>
          <Portal>
            <Dialog
              visible={open}
              onDismiss={hideDialog}
              style={{ backgroundColor: "#f2f2f2" }}
            >
              <Dialog.Title
                style={{
                  alignSelf: "center",
                  color: "black",
                }}
              >
                Seleccione un Temporero
              </Dialog.Title>

              <Dialog.Content>
                <View style={styles.viewPicker}>
                  <Picker
                    selectedValue={selectedTemporero}
                    onValueChange={(itemValue, itemIndex) =>
                      handleValueChange(itemValue)
                    }
                    placeholder="Seleccione un Tipo de Bandeja"
                    mode="dropdown"
                    style={styles.pickerContainer}
                  >
                    {temporeros.map((temporero) => (
                      <Picker.Item
                        key={temporero.rut}
                        label={
                          temporero.firstName +
                          " " +
                          temporero.lastName +
                          " - " +
                          temporero.rut
                        }
                        value={temporero}
                      />
                    ))}
                  </Picker>
                </View>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={hideDialog} color="#2f3bc7">
                  Cancelar
                </Button>
                <Button
                  onPress={() => setMostrarEscrituraNFC(true)}
                  color="#2f3bc7"
                >
                  Enlazar
                </Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </View>
      </Provider>
      {mostrarEscrituraNFC && (
        <EscrituraNFC
          mostrarEscrituraNFC={mostrarEscrituraNFC}
          setMostrarEscrituraNFC={setMostrarEscrituraNFC}
          selectedTemporero={selectedTemporero}
          setOpenSnackbar={setOpenSnackbar}
          setMessage={setMessage}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  pickerContainer: {
    alignSelf: "center",
    width: Dimensions.get("window").width * 0.8,
    backgroundColor: "white",
  },
  viewPicker: {
    paddingVertical: 2,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderRadius: 7,
    marginTop: 10,
    alignSelf: "center",
    width: Dimensions.get("window").width * 0.81,
    borderWidth: 1,
    borderColor: "lightgrey",
  },
});
