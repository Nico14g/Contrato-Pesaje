import React, { useState } from "react";
import { View } from "react-native";
import { useFormik, FormikProvider } from "formik";
import {
  Button,
  Dialog,
  Portal,
  Provider,
  Paragraph,
} from "react-native-paper";
import firestore from "@react-native-firebase/firestore";

export default function ModalCreacionTemporero(props) {
  const {
    open,
    setOpen,
    nombreTemporero,
    rutTemporero,
    setOpenSnackbar,
    setMessage,
    user,
  } = props;

  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      nombreUsuario: nombreTemporero.split(" ", 2)[0],
      apellidoUsuario:
        nombreTemporero.split(" ", 2)[1] === undefined
          ? ""
          : nombreTemporero.split(" ", 2)[1],
      rut: rutTemporero,
    },

    onSubmit: () => guardarDatos(),
  });

  const { handleSubmit, values } = formik;

  const hideDialog = () => setOpen(false);

  const error = (e) => {
    console.log(e);
    setLoading(false);
    setMessage("Ha ocurrido un error.");
    setOpenSnackbar(true);
    setOpen(false);
  };

  const guardarDatos = async () => {
    setLoading(true);

    const data = {
      ...values,
      uid: values.rut,
      cuid: user.rol === "company" ? user.uid : user.cuid,
      rol: "harvester",
      habilitado: true,
      ciudad: "",
      comuna: "",
      direccion: "",
      fechaCreacion: new Date(),
    };
    await firestore()
      .collection("usuarios")
      .doc(data.rut)
      .set(data)
      .then(() => {
        setMessage(
          "Guardado correctamente, ahora puede realizar el pesaje sin problemas"
        );
        setLoading(false);
        setOpenSnackbar(true);
        setOpen(false);
      })
      .catch((e) => {
        error(e);
      });
  };
  return (
    <Provider>
      <View>
        <Portal>
          <Dialog
            visible={open}
            onDismiss={hideDialog}
            style={{ backgroundColor: "#f2f2f2" }}
          >
            <Dialog.Title style={{ alignSelf: "center", color: "black" }}>
              Temporero no registrado
            </Dialog.Title>
            <FormikProvider value={formik}>
              <Dialog.Content>
                <Paragraph style={{ color: "black", fontSize: 16 }}>
                  ¿Desea crear el usuario{" "}
                  {values.nombreUsuario +
                    " " +
                    values.apellidoUsuario +
                    " de rut: " +
                    values.rut +
                    "?"}
                </Paragraph>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={hideDialog} color="red">
                  Cancelar
                </Button>
                <Button
                  loading={loading}
                  onPress={handleSubmit}
                  color="#2f3bc7"
                >
                  Aceptar
                </Button>
              </Dialog.Actions>
            </FormikProvider>
          </Dialog>
        </Portal>
      </View>
    </Provider>
  );
}
