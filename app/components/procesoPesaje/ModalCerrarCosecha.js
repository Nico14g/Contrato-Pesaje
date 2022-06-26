import React, { useState } from "react";
import { View } from "react-native";
import {
  Button,
  Dialog,
  Portal,
  Provider,
  Paragraph,
} from "react-native-paper";
import { storeData } from "../../utilidades/variablesGlobales";
import firestore from "@react-native-firebase/firestore";

export default function ModalCerrarCosecha(props) {
  const {
    open,
    setOpen,
    categoriaSelected,
    setLoadingTCosecha,
    setOpenSnackbar,
    setMessage,
  } = props;

  const [loading, setLoading] = useState(false);

  const hideDialog = () => setOpen(false);

  const terminarCosecha = async () => {
    setLoadingTCosecha(true);
    const categoria = {
      cuid: categoriaSelected.item.cuid,
      fechaInicio: new Date(
        categoriaSelected.item.fechaInicio.seconds * 1000 +
          categoriaSelected.item.fechaInicio.nanoseconds / 1000000
      ),
      fechaTermino: new Date(),
      idCategoria: categoriaSelected.item.idCategoria,
      nombreCategoria: categoriaSelected.item.nombreCategoria,
    };

    firestore()
      .collection("categoria")
      .doc(categoriaSelected.item.idCategoria)
      .set(categoria);
    setLoadingTCosecha(false);
    categoriaSelected.item.fechaTermino = new Date();
    storeData(categoriaSelected, "@categoriaSelect");
    setOpen(false);
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
              Terminar Cosecha
            </Dialog.Title>
            <Dialog.Content>
              <Paragraph style={{ color: "black", fontSize: 16 }}>
                ¿Desea cerrar la cosecha{" "}
                {categoriaSelected.item.nombreCategoria}?
              </Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialog} color="red">
                Cancelar
              </Button>
              <Button
                loading={loading}
                onPress={() => terminarCosecha()}
                color="#2f3bc7"
              >
                Aceptar
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </Provider>
  );
}
