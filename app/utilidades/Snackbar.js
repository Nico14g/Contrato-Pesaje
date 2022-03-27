import React, { useState } from "react";
import { View, StyleSheet } from "react-native";

import { Snackbar } from "react-native-paper";

export const SnackBar = (props) => {
  const { open, setOpen, message } = props;

  return (
    <View style={styles.container}>
      <Snackbar
        visible={open}
        onDismiss={() => setOpen(false)}
        action={{
          label: "Cerrar",
          onPress: () => {
            setOpen(false);
          },
        }}
      >
        {message}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
  },
});
